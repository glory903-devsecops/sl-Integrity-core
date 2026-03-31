import json
import urllib.request
import time
import random

BASE_URL = "http://localhost:8000/api"

def register_asset(name, path, description):
    data = {
        "name": name,
        "path": path,
        "description": description
    }
    req = urllib.request.Request(
        f"{BASE_URL}/baselines/",
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error registering {name}: {e}")
        return None

def trigger_scan_all():
    req = urllib.request.Request(f"{BASE_URL}/scan-all", method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error triggering scan: {e}")
        return None

def main():
    print("🚀 Starting SL-Integrity-Core Scaling Test (2000 Assets)...")
    
    # Node types and locations for realistic names
    node_types = ["PLC-Control", "AGV-Router", "SDF-AppServer", "Vision-Sensor", "Robot-Arm-Config"]
    locations = ["Ulsan-Plant-1", "Gyeongju-Plant-A", "Seongnam-R&D", "Daegu-Factory-2"]
    
    start_time = time.time()
    
    for i in range(1, 2001):
        node_type = random.choice(node_types)
        location = random.choice(locations)
        name = f"{node_type}-{i:04d}"
        path = f"/opt/sf/nodes/{location}/{name.lower()}"
        description = f"Manufacturing execution node at {location}. Integrity monitor active."
        
        asset = register_asset(name, path, description)
        if i % 100 == 0:
            print(f"✅ Registered {i}/2000 assets...")
            
    print(f"✨ Registration completed in {time.time() - start_time:.2f} seconds.")
    
    print("🔍 Triggering bulk integrity check...")
    trigger_scan_all()
    print("📊 Scaling test execution complete. Check the dashboard at http://localhost:8000")

if __name__ == "__main__":
    main()
