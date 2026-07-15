from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TransactionBase(BaseModel):
    id: str  
    date: datetime 
    amount: float
    currency: str
    status: str
    source: str
    customer_id: str
    is_anomaly: bool
    anomaly_type: Optional[str] = None

class TransactionResponse(TransactionBase):
    pass

class KPIResponse(BaseModel):
    total_processed: int
    anomalies_detected: int
    revenue_at_risk: float

class AnomalyChartData(BaseModel):
    date: str
    status_mismatch: int = 0
    duplicate: int = 0
    missing: int = 0

class AIInsightBase(BaseModel):
    anomaly_type: str
    affected_count: int
    root_cause_summary: str
    recommended_action: str

class AIInsightResponse(AIInsightBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
