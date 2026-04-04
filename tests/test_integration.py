import pytest
import os
import shutil
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import engine, SessionLocal
from app.db.models import Base

client = TestClient(app)

@pytest.fixture(scope="module")
def test_db():
    # Setup fresh test database
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def demo_folder():
    # Create a temporary demo folder for hashing
    path = "tests/demo_asset"
    os.makedirs(path, exist_ok=True)
    with open(f"{path}/config.txt", "w") as f:
        f.write("initial data")
    yield os.path.abspath(path)
    shutil.rmtree(path)

def test_full_asset_workflow(test_db, demo_folder):
    # 1. Register a new asset via API
    asset_payload = {
        "name": "Integration Test PLC",
        "path": demo_folder,
        "description": "Integration Test Description",
        "department": "Smart Factory A",
        "current_hash": "", # Hashed by backend
        "is_consistent": True
    }
    
    response = client.post("/api/assets", json=asset_payload)
    if response.status_code != 200:
        print(f"DEBUG Error Response: {response.json()}")
    assert response.status_code == 200
    asset_data = response.json()
    asset_id = asset_data["id"]
    initial_hash = asset_data["current_hash"]
    assert initial_hash != ""
    assert asset_data["is_consistent"] is True

    # 2. Get the asset and verify stats
    stats_response = client.get("/api/stats")
    assert stats_response.status_code == 200
    assert stats_response.json()["total_assets"] >= 1

    # 3. Simulate tampering
    with open(f"{demo_folder}/config.txt", "a") as f:
        f.write("\nTAMPERED DATA")

    # 4. Trigger scan
    scan_response = client.post(f"/api/scan/{asset_id}")
    assert scan_response.status_code == 200
    scan_result = scan_response.json()
    assert scan_result["is_consistent"] is False
    assert scan_result["scanned_hash"] != initial_hash
    assert "Unauthorized file changes" in scan_result["details"]

    # 5. Check if asset status is updated in DB
    assets_response = client.get("/api/assets")
    target_asset = next(a for a in assets_response.json() if a["id"] == asset_id)
    assert target_asset["is_consistent"] is False
