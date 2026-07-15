import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-1.5-pro')
else:
    model = None

def analyze_batch(transactions: list) -> dict:
    """
    Takes a JSON batch (list of dicts) of anomalous transactions and asks Gemini to analyze it.
    """
    if not transactions:
        return _mock_insight()

    # Determine the most common anomaly type in the batch to help the mock/prompt
    anomaly_types = [t.get('anomaly_type') for t in transactions if t.get('anomaly_type')]
    primary_anomaly = max(set(anomaly_types), key=anomaly_types.count) if anomaly_types else "UNKNOWN"
    
    if model:
        # We only pass a sample of up to 50 to avoid token limits on huge batches
        sample_batch = transactions[:50]
        prompt = f"""
        Act as a technical product analyst / L1 Support Agent for a FinTech platform.
        I am providing a JSON batch of {len(transactions)} anomalous transactions. Here is a sample:
        {sample_batch}

        Please analyze this batch of errors. 
        Format the output as a JSON object with exactly these two fields: 
        1. "root_cause_summary": A plain English explanation of what went wrong based on the data.
        2. "recommended_action": What the customer support team should do to resolve this.
        Do not include any markdown formatting blocks like ```json, just output the raw JSON object.
        """
        try:
            response = model.generate_content(prompt)
            import json
            import re
            text = response.text
            match = re.search(r'```(?:json)?\n(.*?)\n```', text, re.DOTALL)
            if match:
                text = match.group(1)
            res = json.loads(text)
            return {
                "anomaly_type": primary_anomaly,
                "affected_count": len(transactions),
                "root_cause_summary": res.get("root_cause_summary", "Summary not found"),
                "recommended_action": res.get("recommended_action", "Action not found")
            }
        except Exception as e:
            print(f"AI generation failed: {e}")
            return _mock_insight(primary_anomaly, len(transactions))
    else:
        return _mock_insight(primary_anomaly, len(transactions))


def _mock_insight(anomaly_type: str = "MIXED", count: int = 0) -> dict:
    if anomaly_type == "STATUS_MISMATCH":
        summary = "Transactions show conflicting statuses between our internal database and the payment gateway, likely due to webhook delivery failures or race conditions."
        action = "Re-sync the affected transaction statuses manually via the payment gateway API and monitor webhook endpoint health."
    elif anomaly_type == "DUPLICATE":
        summary = "Multiple identical charges were detected for the same customer within a short timeframe, suggesting a frontend retry bug or gateway glitch."
        action = "Automatically void or refund the duplicate charges and notify the affected customers with an automated apology."
    elif anomaly_type == "MISSING_IN_GATEWAY":
        summary = "Transactions exist in our database but are missing from the gateway, indicating failures before reaching the payment processor."
        action = "Investigate the checkout flow logs and advise support to contact users whose carts were dropped."
    else:
        summary = "A mixed batch of anomalous transactions was detected across the ledger and gateway logs."
        action = "Review the latest system logs and escalate to the engineering team for a detailed review."
        
    return {
        "anomaly_type": anomaly_type,
        "affected_count": count,
        "root_cause_summary": summary,
        "recommended_action": action
    }
