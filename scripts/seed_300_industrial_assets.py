import json
import urllib.request
import time
import random

BASE_URL = "http://localhost:8000/api"

def register_asset(name, path, description, department, location):
    data = {
        "name": name,
        "path": path,
        "description": description,
        "department": department,
        "location": location,
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
    
    # Standardized Industrial Asset Categories for SL-Integrity-Core
    categories = {
        "PLC 로직 컨트롤러": ["Siemens-S7-1500", "Mitsubishi-MELSEC", "LS-XGT", "Rockwell-Logix5000"],
        "MES 서버 설정": ["Manufacturing-Ex-Server", "Process-Control-Node", "Inventory-Sync-Srv", "Quality-Assurance-Module"],
        "R&D 설계 보안": ["Design-Workstation-X", "Core-Source-Vault", "Blueprint-Server-01", "Patent-Research-Node"],
        "백업 데이터베이스": ["Daily-Process-Backup", "Archive-Vault-Gumi", "Disaster-Recovery-DB", "Weekly-Log-Storage"]
    }
    
    locations = ["Ulsan-Main-Plant-A", "Gumi-Electronic-B", "Pyeongtaek-Semicon-1", "Changwon-Machine-C", "Whasung-Automotive-D"]
    line_names = ["Line-01-Logic", "Server-Room-B", "RD-Lab-Alpha", "Storage-Zone-Z"]

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
        
        register_asset(name, path, description, cat_key, location)
        if i % 50 == 0:
            print(f"✅ Registered {i}/{total_to_register} assets...")
            
    print(f"✨ Seed completed in {time.time() - start_time:.2f} seconds.")
    
    print("🔍 Triggering initial integrity scan for all new assets...")
    trigger_scan_all()
    print("📊 Successfully seeded 300 industrial assets. Check the dashboard at http://localhost:5173/sl-Integrity-core/")

if __name__ == "__main__":
    main()
