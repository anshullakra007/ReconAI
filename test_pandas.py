import sys
sys.path.append('/Users/anshullakra/Documents/coding/ion_jd/backend/venv_full/lib/python3.14/site-packages')
import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

def generate_data():
    num_records = 5000
    base_dates = [datetime.utcnow() - timedelta(days=random.randint(0, 7)) for _ in range(num_records)]
    base_amounts = [round(random.uniform(10, 500), 2) for _ in range(num_records)]
    base_ids = [str(i) for i in range(num_records)]
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

    mismatch_idx = internal_df.sample(frac=0.05).index
    gateway_df.loc[mismatch_idx, 'status'] = "FAILED"

    missing_idx = internal_df[~internal_df.index.isin(mismatch_idx)].sample(frac=0.02).index
    gateway_df = gateway_df.drop(missing_idx)

    dup_idx = internal_df[~internal_df.index.isin(mismatch_idx) & ~internal_df.index.isin(missing_idx)].sample(frac=0.01).index
    duplicates = internal_df.loc[dup_idx].copy()

    amount_mismatch_idx = internal_df[
        ~internal_df.index.isin(mismatch_idx) & 
        ~internal_df.index.isin(missing_idx) & 
        ~internal_df.index.isin(dup_idx)
    ].sample(frac=0.02).index
    gateway_df.loc[amount_mismatch_idx, 'currency'] = 'EUR'
    gateway_df.loc[amount_mismatch_idx, 'amount'] = round(gateway_df.loc[amount_mismatch_idx, 'amount'] * random.uniform(0.5, 0.8), 2)

    time_mismatch_idx = internal_df[
        ~internal_df.index.isin(mismatch_idx) & 
        ~internal_df.index.isin(missing_idx) & 
        ~internal_df.index.isin(dup_idx) &
        ~internal_df.index.isin(amount_mismatch_idx)
    ].sample(frac=0.02).index
    gateway_df.loc[time_mismatch_idx, 'timestamp'] = gateway_df.loc[time_mismatch_idx, 'timestamp'] + pd.to_timedelta(np.random.randint(6, 30, size=len(time_mismatch_idx)), unit='m')

    safe_drift_idx = gateway_df[
        ~gateway_df.index.isin(time_mismatch_idx)
    ].sample(frac=0.10).index
    gateway_df.loc[safe_drift_idx, 'timestamp'] = gateway_df.loc[safe_drift_idx, 'timestamp'] + pd.to_timedelta(np.random.randint(1, 5, size=len(safe_drift_idx)), unit='m')

    safe_curr_idx = gateway_df[
        ~gateway_df.index.isin(amount_mismatch_idx)
    ].sample(frac=0.05).index
    gateway_df.loc[safe_curr_idx, 'currency'] = 'EUR'
    gateway_df.loc[safe_curr_idx, 'amount'] = round(gateway_df.loc[safe_curr_idx, 'amount'] / 1.10, 2)

    internal_df = pd.concat([internal_df, duplicates], ignore_index=True)

    print(f"SUCCESS {len(internal_df)} {len(gateway_df)}")

generate_data()
