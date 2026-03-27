import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import shutil

from app.main import app
from app.core.database import Base, get_db

# Use SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test.db"):
        os.remove("./test.db")

@pytest.fixture
def temp_dir():
    path = "test_api_dir"
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "test.txt"), "w") as f:
        f.write("api test content")
    yield os.path.abspath(path)
    shutil.rmtree(path)

def test_create_baseline(client, temp_dir):
    response = client.post(
        "/baselines/",
        json={"name": "Test Asset", "path": temp_dir, "description": "Testing API"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Asset"
    assert "current_hash" in data

def test_trigger_scan(client, temp_dir):
    # 1. Create baseline
    resp = client.post(
        "/baselines/",
        json={"name": "Scan Test", "path": temp_dir}
    )
    baseline_id = resp.json()["id"]
    
    # 2. Trigger scan
    resp = client.post(f"/baselines/{baseline_id}/scan")
    assert resp.status_code == 200
    assert resp.json()["message"] == "Scan initiated in background"
