import json
import urllib.request
import time
import random

BASE_URL = "http://localhost:8000/api"

def register_asset(name, path, description, department):
    data = {
        "name": name,
        "path": path,
        "description": description,
        "department": department,
        "is_consistent": True
    }
    req = urllib.request.Request(
        f"{BASE_URL}/assets",
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
    print("🏭 Seeding 300 Industrial Assets into sl-Integrity-Core...")
    
    # Realistic industrial asset categories
    categories = {
        "PLC": ["Siemens-S7-1500", "Mitsubishi-MELSEC", "LS-XGT", "Rockwell-Logix5000"],
        "Robot": ["ABB-IRB-6700", "Fanuc-R-2000iD", "Kuka-KR-QUANTEC", "Yaskawa-Motoman"],
        "Sensor": ["Keyence-CV-X", "Omron-ZW-7000", "Sick-NAV350", "Cognex-In-Sight"],
        "CNC": ["Mazak-Integrex-v2", "DMG-Mori-CTX", "Doosan-Lynx", "Hyundai-Wia-KF"],
        "Logistics": ["Daifuku-RGV-Mk3", "AutoStore-R5-Bot", "AGV-AMR-600", "Conveyor-Drive-C"],
        "Infrastructure": ["HVAC-System-P1", "Transformer-Node-B", "Power-Analyzer-Q", "UPS-Manager-Server"]
    }
    
    locations = ["Ulsan-Main-Plant-A", "Gumi-Electronic-B", "Pyeongtaek-Semicon-1", "Changwon-Machine-C", "Whasung-Automotive-D"]
    line_names = ["Assembly-Line-1", "Paint-Line-2", "Foundry-Line-Alpha", "Testing-Lab-7", "Warehouse-Zone-B"]

    start_time = time.time()
    
    total_to_register = 300
    for i in range(1, total_to_register + 1):
        cat_key = random.choice(list(categories.keys()))
        model = random.choice(categories[cat_key])
        location = random.choice(locations)
        line = random.choice(line_names)
        
        name = f"{model}-{i:03d}"
        path = f"/opt/sf/nodes/{location.lower()}/{line.lower()}/{name.lower()}"
        description = f"Industrial {cat_key} device located at {location} - {line}. Standard integrity monitoring enabled."
        
        register_asset(name, path, description, cat_key)
        if i % 50 == 0:
            print(f"✅ Registered {i}/{total_to_register} assets...")
            
    print(f"✨ Seed completed in {time.time() - start_time:.2f} seconds.")
    
    print("🔍 Triggering initial integrity scan for all new assets...")
    trigger_scan_all()
    print("📊 Successfully seeded 300 industrial assets. Check the dashboard at http://localhost:5173/sl-Integrity-core/")

if __name__ == "__main__":
    main()
