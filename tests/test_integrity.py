import pytest
from app.use_cases.integrity_use_cases import IntegrityUseCase, check_asset_integrity
from unittest.mock import MagicMock
from app.domain.entities import Asset, ScanResult
from datetime import datetime

class MockRepo:
    def __init__(self):
        self.assets = {}
    def get_asset_by_id(self, asset_id: int):
        return self.assets.get(asset_id)
    def update_asset(self, asset: Asset):
        self.assets[asset.id] = asset
    def save_scan_result(self, result: ScanResult):
        pass
    def get_all_assets(self):
        return list(self.assets.values())
    def get_stats(self):
        return None

def test_integrity_scan_logic():
    repo = MockRepo()
    hasher = MagicMock()
    hasher.calculate_hash.return_value = "hash123"
    
    # Create a domain asset
    asset = Asset(
        id=1, 
        name="Test Asset", 
        path="/test/path", 
        current_hash="hash123", 
        is_consistent=True
    )
    repo.assets[1] = asset
    
    use_case = IntegrityUseCase(repo, hasher)
    
    # Test healthy scan
    result = check_asset_integrity(use_case, 1)
    assert result.is_consistent is True
    assert result.scanned_hash == "hash123"
    
    # Test tamper scan
    hasher.calculate_hash.return_value = "tampered_hash"
    result = check_asset_integrity(use_case, 1)
    assert result.is_consistent is False
    assert result.scanned_hash == "tampered_hash"
    assert "Unauthorized file changes" in result.details
