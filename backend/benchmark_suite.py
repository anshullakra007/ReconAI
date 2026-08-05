import asyncio
import aiohttp
import time
import numpy as np
from termcolor import colored

async def fetch(session, url, method="GET"):
    start = time.time()
    try:
        if method == "GET":
            async with session.get(url) as response:
                await response.read()
                status = response.status
        else:
            async with session.post(url) as response:
                await response.read()
                status = response.status
        latency = (time.time() - start) * 1000
        return latency, status == 200
    except Exception:
        latency = (time.time() - start) * 1000
        return latency, False

async def run_load_test(name, url, concurrent_reqs, method="GET"):
    print(f"\n{colored(f'--- Starting {name} ---', 'cyan', attrs=['bold'])}")
    print(f"Target: {url} | Concurrency: {concurrent_reqs} | Method: {method}")
    
    async with aiohttp.ClientSession() as session:
        start_time = time.time()
        tasks = [fetch(session, url, method) for _ in range(concurrent_reqs)]
        results = await asyncio.gather(*tasks)
        total_time = time.time() - start_time

    latencies = [r[0] for r in results]
    successes = sum([1 for r in results if r[1]])
    
    rps = concurrent_reqs / total_time
    p50 = np.percentile(latencies, 50)
    p90 = np.percentile(latencies, 90)
    p99 = np.percentile(latencies, 99)
    mean_lat = np.mean(latencies)
    
    print(colored("Results:", "green", attrs=['bold']))
    print(f"  Total Requests:  {concurrent_reqs}")
    print(f"  Success Rate:    {(successes/concurrent_reqs)*100:.1f}%")
    print(f"  Total Time:      {total_time:.2f} seconds")
    print(f"  Throughput:      {colored(f'{rps:.2f} RPS', 'magenta', attrs=['bold'])}")
    print(f"  Mean Latency:    {mean_lat:.2f} ms")
    print(f"  P50 Latency:     {p50:.2f} ms")
    print(f"  P90 Latency:     {p90:.2f} ms")
    print(f"  P99 Latency:     {p99:.2f} ms")
    print("-" * 50)

async def main():
    print(colored("ReconAI Exhaustive Benchmarking Suite", "blue", attrs=['bold', 'underline']))
    base_url = "http://localhost:8000"
    
    # 1. Database Load Test: KPIs
    await run_load_test("DB Load Test (KPIs)", f"{base_url}/api/kpis", 500)
    
    # 2. Database Load Test: Anomalies
    await run_load_test("DB Load Test (Anomalies)", f"{base_url}/api/anomalies", 500)
    
    # 3. AI Latency Test: Analyze Errors 
    # Warning: 10 concurrent requests to an LLM endpoint might hit free-tier rate limits
    await run_load_test("AI Latency Test (Gemini)", f"{base_url}/api/analyze-errors", 10, method="POST")

if __name__ == "__main__":
    asyncio.run(main())
