import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
import uuid
from datetime import datetime, timedelta
import random

def generate_data(db: Session, models_module):
    if db.query(models_module.InternalLedger).count() > 0:
        print("Data already exists. Skipping generation.")
        return

    print("Generating synthetic data into two tables...")
    num_records = 5000
    
    base_dates = [datetime.utcnow() - timedelta(days=random.randint(0, 7)) for _ in range(num_records)]
    base_amounts = [round(random.uniform(10, 500), 2) for _ in range(num_records)]
    base_ids = [str(uuid.uuid4()) for _ in range(num_records)]
    base_customers = [f"cus_{random.randint(1000, 9999)}" for _ in range(num_records)]
    
    internal_df = pd.DataFrame({
        "transaction_id": base_ids,
        "timestamp": base_dates,
        "amount": base_amounts,
        "currency": "USD",
        "status": "SUCCESS",
        "customer_id": base_customers,
    })

    gateway_df = internal_df.copy()

    # --- INJECT ANOMALIES ---
    # 1. Mismatched Status (5%)
    mismatch_idx = internal_df.sample(frac=0.05).index
    gateway_df.loc[mismatch_idx, 'status'] = "FAILED"

    # 2. Missing from Gateway (2%)
    missing_idx = internal_df[~internal_df.index.isin(mismatch_idx)].sample(frac=0.02).index
    gateway_df = gateway_df.drop(missing_idx)

    # 3. Duplicate Charges (1%)
    dup_idx = internal_df[~internal_df.index.isin(mismatch_idx) & ~internal_df.index.isin(missing_idx)].sample(frac=0.01).index
    duplicates = internal_df.loc[dup_idx].copy()
    internal_df = pd.concat([internal_df, duplicates], ignore_index=True)

    # Save to DB
    internal_records = internal_df.to_dict('records')
    db_internal = [models_module.InternalLedger(**r) for r in internal_records]
    db.add_all(db_internal)

    gateway_records = gateway_df.to_dict('records')
    db_gateway = [models_module.GatewayLog(**r) for r in gateway_records]
    db.add_all(db_gateway)

    db.commit()
    print(f"Successfully generated {len(internal_df)} internal records and {len(gateway_df)} gateway records.")
