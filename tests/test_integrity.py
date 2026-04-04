import pytest
from unittest.mock import MagicMock
from datetime import datetime
from app.domain.entities import Asset, ScanResult
from app.application.integrity_service import IntegrityService

class MockAssetRepository:
    def __init__(self):
        self.assets = {}
        self.scan_results = []

    def get_asset_by_id(self, asset_id: int):
        return self.assets.get(asset_id)

    def update_asset(self, asset: Asset):
        self.assets[asset.id] = asset

    def save_scan_result(self, result: ScanResult):
        self.scan_results.append(result)

    def get_all_assets(self):
        return list(self.assets.values())
    
    def get_stats(self):
        return None

def test_integrity_service_success():
    # Setup
    repo = MockAssetRepository()
    hasher = MagicMock()
    hasher.calculate_hash.return_value = "STABLE_HASH"
    
    asset = Asset(
        id=1, 
        name="PLC_Config", 
        path="/etc/sl/plc", 
        current_hash="STABLE_HASH", 
        is_consistent=True
    )
    repo.assets[1] = asset
    
    service = IntegrityService(repo, hasher)
    
    # Execute
    result = service.execute_scan(1)
    
    # Assert
    assert result.is_consistent is True
    assert result.scanned_hash == "STABLE_HASH"
    assert repo.assets[1].is_consistent is True
    assert repo.assets[1].last_scanned_at is not None

def test_integrity_service_tampered():
    # Setup
    repo = MockAssetRepository()
    hasher = MagicMock()
    hasher.calculate_hash.return_value = "TAMPERED_HASH"
    
    asset = Asset(
        id=2, 
        name="MES_Binary", 
        path="/usr/bin/mes", 
        current_hash="ORIGINAL_HASH", 
        is_consistent=True
    )
    repo.assets[2] = asset
    
    service = IntegrityService(repo, hasher)
    
    # Execute
    result = service.execute_scan(2)
    
    # Assert
    assert result.is_consistent is False
    assert result.scanned_hash == "TAMPERED_HASH"
    assert repo.assets[2].is_consistent is False
    assert "Unauthorized file changes" in result.details

def test_get_all_assets():
    # Setup
    repo = MockAssetRepository()
    hasher = MagicMock()
    
    repo.assets[1] = Asset(id=1, name="A1", path="/p1", current_hash="H1", is_consistent=True)
    repo.assets[2] = Asset(id=2, name="A2", path="/p2", current_hash="H2", is_consistent=True)
    
    service = IntegrityService(repo, hasher)
    
    # Execute
    assets = service.get_all_assets()
    
    # Assert
    assert len(assets) == 2
    assert assets[0].name == "A1"
    assert assets[1].name == "A2"
