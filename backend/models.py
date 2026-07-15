from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class InternalLedger(Base):
    __tablename__ = "internal_ledger"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    transaction_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    amount = Column(Float)
    currency = Column(String, default="USD")
    status = Column(String)  # 'SUCCESS', 'FAILED', 'PENDING'
    customer_id = Column(String)

class GatewayLog(Base):
    __tablename__ = "gateway_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    transaction_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    amount = Column(Float)
    currency = Column(String, default="USD")
    status = Column(String)  # 'SUCCESS', 'FAILED', 'PENDING'
    customer_id = Column(String)

class AIInsight(Base):
    __tablename__ = "ai_insights"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    anomaly_type = Column(String)
    affected_count = Column(Integer)
    root_cause_summary = Column(String)
    recommended_action = Column(String)
