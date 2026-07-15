import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
import uuid
from datetime import datetime, timedelta
import random

def generate_data(db: Session, models_module):
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

    # 4. Currency / Amount Mismatch (2%)
    amount_mismatch_idx = internal_df[
        ~internal_df.index.isin(mismatch_idx) & 
        ~internal_df.index.isin(missing_idx) & 
        ~internal_df.index.isin(dup_idx)
    ].sample(frac=0.02).index
    gateway_df.loc[amount_mismatch_idx, 'currency'] = 'EUR'
    gateway_df.loc[amount_mismatch_idx, 'amount'] = round(gateway_df.loc[amount_mismatch_idx, 'amount'] * random.uniform(0.5, 0.8), 2)

    # 5. Timestamp Slack Mismatch (> 5 mins) (2%)
    time_mismatch_idx = internal_df[
        ~internal_df.index.isin(mismatch_idx) & 
        ~internal_df.index.isin(missing_idx) & 
        ~internal_df.index.isin(dup_idx) &
        ~internal_df.index.isin(amount_mismatch_idx)
    ].sample(frac=0.02).index
    gateway_df.loc[time_mismatch_idx, 'timestamp'] = gateway_df.loc[time_mismatch_idx, 'timestamp'] + pd.to_timedelta(np.random.randint(6, 30, size=len(time_mismatch_idx)), unit='m')

    # --- INJECT SAFE EDGE CASES (NOT ANOMALIES) ---
    
    # Safe drift (1 to 4 minutes) to 10% of records
    safe_drift_idx = internal_df[
        ~internal_df.index.isin(time_mismatch_idx)
    ].sample(frac=0.10).index
    gateway_df.loc[safe_drift_idx, 'timestamp'] = gateway_df.loc[safe_drift_idx, 'timestamp'] + pd.to_timedelta(np.random.randint(1, 5, size=len(safe_drift_idx)), unit='m')

    # Safe currency conversion (Gateway is EUR, amount is exactly USD / 1.10) to 5% of records
    safe_curr_idx = internal_df[
        ~internal_df.index.isin(amount_mismatch_idx)
    ].sample(frac=0.05).index
    gateway_df.loc[safe_curr_idx, 'currency'] = 'EUR'
    gateway_df.loc[safe_curr_idx, 'amount'] = round(gateway_df.loc[safe_curr_idx, 'amount'] / 1.10, 2)

    # Concatenate duplicates to internal_df now that index mapping is complete
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
