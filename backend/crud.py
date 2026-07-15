from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import schemas
import datetime

def _get_reconciled_anomalies(db: Session):
    anomalies = []
    
    # 1. Missing in Gateway
    missing_records = db.query(models.InternalLedger).outerjoin(
        models.GatewayLog, models.InternalLedger.transaction_id == models.GatewayLog.transaction_id
    ).filter(models.GatewayLog.transaction_id == None).all()
    
    for r in missing_records:
        anomalies.append(schemas.TransactionResponse(
            id=r.transaction_id,
            date=r.timestamp,
            amount=r.amount,
            currency=r.currency,
            status=r.status,
            source="INTERNAL",
            customer_id=r.customer_id,
            is_anomaly=True,
            anomaly_type="MISSING_IN_GATEWAY"
        ))

    # 2. Mismatched Status
    mismatched_records = db.query(models.InternalLedger, models.GatewayLog).join(
        models.GatewayLog, models.InternalLedger.transaction_id == models.GatewayLog.transaction_id
    ).filter(models.InternalLedger.status != models.GatewayLog.status).all()

    for int_r, gw_r in mismatched_records:
        anomalies.append(schemas.TransactionResponse(
            id=int_r.transaction_id,
            date=int_r.timestamp,
            amount=int_r.amount,
            currency=int_r.currency,
            status=f"{int_r.status} / {gw_r.status}",
            source="RECONCILIATION",
            customer_id=int_r.customer_id,
            is_anomaly=True,
            anomaly_type="STATUS_MISMATCH"
        ))
        
    # 3. Duplicates
    duplicate_ids = db.query(models.InternalLedger.transaction_id).group_by(
        models.InternalLedger.transaction_id
    ).having(func.count(models.InternalLedger.id) > 1).all()
    
    dup_ids_list = [d[0] for d in duplicate_ids]
    
    if dup_ids_list:
        dup_records = db.query(models.InternalLedger).filter(models.InternalLedger.transaction_id.in_(dup_ids_list)).all()
        for r in dup_records:
            anomalies.append(schemas.TransactionResponse(
                id=r.transaction_id,
                date=r.timestamp,
                amount=r.amount,
                currency=r.currency,
                status=r.status,
                source="INTERNAL",
                customer_id=r.customer_id,
                is_anomaly=True,
                anomaly_type="DUPLICATE"
            ))

    return anomalies

def get_transactions(db: Session, skip: int = 0, limit: int = 100):
    records = db.query(models.InternalLedger).order_by(models.InternalLedger.timestamp.desc()).offset(skip).limit(limit).all()
    results = []
    for r in records:
        results.append(schemas.TransactionResponse(
            id=r.transaction_id,
            date=r.timestamp,
            amount=r.amount,
            currency=r.currency,
            status=r.status,
            source="INTERNAL",
            customer_id=r.customer_id,
            is_anomaly=False
        ))
    return results

def get_anomalies(db: Session, skip: int = 0, limit: int = 100):
    anomalies = _get_reconciled_anomalies(db)
    anomalies.sort(key=lambda x: x.date, reverse=True)
    return anomalies[skip:skip+limit]

def get_kpis(db: Session):
    total = db.query(models.InternalLedger).count()
    anomalies = _get_reconciled_anomalies(db)
    anomalies_detected = len(anomalies)
    revenue_at_risk = sum(a.amount for a in anomalies)
    return {
        "total_processed": total,
        "anomalies_detected": anomalies_detected,
        "revenue_at_risk": revenue_at_risk
    }

def get_anomaly_chart_data(db: Session):
    anomalies = _get_reconciled_anomalies(db)
    data = {}
    
    for a in anomalies:
        d = a.date.date()
        t = a.anomaly_type
        if d not in data:
            data[d] = {"date": str(d), "status_mismatch": 0, "duplicate": 0, "missing": 0}
        if t == "STATUS_MISMATCH":
            data[d]["status_mismatch"] += 1
        elif t == "DUPLICATE":
            data[d]["duplicate"] += 1
        elif t == "MISSING_IN_GATEWAY":
            data[d]["missing"] += 1
    
    return sorted(list(data.values()), key=lambda x: x["date"])

def save_ai_insight(db: Session, insight_data: dict):
    db_insight = models.AIInsight(**insight_data)
    db.add(db_insight)
    db.commit()
    db.refresh(db_insight)
    return db_insight

def get_ai_insights(db: Session, limit: int = 10):
    return db.query(models.AIInsight).order_by(models.AIInsight.created_at.desc()).limit(limit).all()

def get_anomaly_counts(db: Session):
    anomalies = _get_reconciled_anomalies(db)
    counts = {}
    for a in anomalies:
        counts[a.anomaly_type] = counts.get(a.anomaly_type, 0) + 1
    return counts.items()
