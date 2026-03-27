import os
import shutil
import pytest
from app.core.hashing import calculate_integrity_hash

@pytest.fixture
def temp_factory_dir():
    # Setup a temporary "factory asset" directory
    dir_path = "tmp_factory_asset"
    os.makedirs(dir_path, exist_ok=True)
    with open(os.path.join(dir_path, "firmware.bin"), "w") as f:
        f.write("v1.0.0-PROD")
    with open(os.path.join(dir_path, "config.yaml"), "w") as f:
        f.write("threshold: 100")
    
    yield dir_path
    
    # Cleanup
    shutil.rmtree(dir_path)

def test_hashing_consistency(temp_factory_dir):
    # Hash should be consistent for same content
    hash1 = calculate_integrity_hash(temp_factory_dir, algorithm="sha256")
    hash2 = calculate_integrity_hash(temp_factory_dir, algorithm="sha256")
    
    assert hash1 == hash2
    assert len(hash1) == 64  # SHA256 length

def test_integrity_breach_detection(temp_factory_dir):
    # 1. Record baseline
    baseline_hash = calculate_integrity_hash(temp_factory_dir)
    
    # 2. Simulate "unauthorized firmware change" (Integrity Breach)
    with open(os.path.join(temp_factory_dir, "firmware.bin"), "w") as f:
        f.write("v1.0.0-MALICIOUS")
        
    # 3. Verify mismatch
    new_hash = calculate_integrity_hash(temp_factory_dir)
    assert baseline_hash != new_hash
