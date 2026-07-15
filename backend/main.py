import traceback
import sys
import os

err_msg = ""
try:
    from fastapi import FastAPI, Depends, BackgroundTasks
    from fastapi.middleware.cors import CORSMiddleware
    from sqlalchemy.orm import Session
    from typing import List

    import models
    import schemas
    import crud
    import generate_data
    import ai_service
    from database import engine, get_db

    models.Base.metadata.create_all(bind=engine)

    app = FastAPI(title="ReconAI API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://frontend-fawn-five-21.vercel.app",
            "http://localhost:3000",
            "http://localhost:5173"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def on_startup():
        global err_msg
        try:
            db = next(get_db())
            first_record = db.query(models.InternalLedger).first()
            if first_record is None:
                print("Database is empty. Triggering synthetic data generation...")
                generate_data.generate_data(db, models)
            else:
                print("Database already populated. Skipping generation.")
            db.close()
        except Exception as e:
            err_msg = traceback.format_exc()
            print("STARTUP ERROR:", err_msg)

    @app.get("/api/kpis", response_model=schemas.KPIResponse)
    def read_kpis(db: Session = Depends(get_db)):
        return crud.get_kpis(db)

    @app.get("/api/chart-data", response_model=List[schemas.AnomalyChartData])
    def read_chart_data(db: Session = Depends(get_db)):
        return crud.get_anomaly_chart_data(db)

    @app.get("/api/transactions", response_model=List[schemas.TransactionResponse])
    def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
        normal_tx = crud.get_transactions(db, skip=skip, limit=limit)
        anomalies = crud.get_anomalies(db, skip=0, limit=limit)
        all_tx = normal_tx + anomalies
        all_tx.sort(key=lambda x: x.date, reverse=True)
        return all_tx[:limit]

    @app.get("/api/anomalies", response_model=List[schemas.TransactionResponse])
    def read_anomalies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
        return crud.get_anomalies(db, skip=skip, limit=limit)

    @app.post("/api/analyze-errors")
    def analyze_errors(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
        anomalies = crud._get_reconciled_anomalies(db)
        if not anomalies:
            return {"message": "No anomalies found."}
            
        from collections import defaultdict
        batches = defaultdict(list)
        for a in anomalies:
            batches[a.anomaly_type].append(a.dict())
            
        db.query(models.AIInsight).delete()
        db.commit()

        insights_created = []
        for anomaly_type, batch in batches.items():
            insight_data = ai_service.analyze_batch(batch)
            db_insight = crud.save_ai_insight(db, insight_data)
            insights_created.append(db_insight)
                
        return insights_created

    @app.get("/api/insights", response_model=List[schemas.AIInsightResponse])
    def get_insights(db: Session = Depends(get_db)):
        return crud.get_ai_insights(db)

    @app.get("/api/insights/trends", response_model=schemas.TrendResponse)
    def read_trends(db: Session = Depends(get_db)):
        return crud.get_trends(db)

    @app.get("/api/debug-error")
    def get_debug_error():
        global err_msg
        return {"error": err_msg}

except Exception as e:
    err_msg = traceback.format_exc()
    from fastapi import FastAPI
    app = FastAPI(title="Error Server")
    @app.get("/{path:path}")
    def catch_all(path: str):
        return {"error": "Startup Failed", "traceback": err_msg.splitlines()}
