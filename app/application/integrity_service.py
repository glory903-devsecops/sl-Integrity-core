from typing import List, Optional
from datetime import datetime
from ..domain.entities import Asset, ScanResult, DashboardStats
from ..domain.interfaces import AssetRepositoryInterface, HashingServiceInterface

class IntegrityService:
    def __init__(self, repo: AssetRepositoryInterface, hasher: HashingServiceInterface):
        self.repo = repo
        self.hasher = hasher

    def execute_scan(self, asset_id: int) -> ScanResult:
        asset = self.repo.get_asset_by_id(asset_id)
        if not asset:
            raise ValueError(f"Asset with id {asset_id} not found")

        current_hash = self.hasher.calculate_hash(asset.path)
        is_consistent = (current_hash == asset.current_hash)
        
        details = "✅ Integrity check passed" if is_consistent else "⚠️ Unauthorized file changes detected"
        
        result = ScanResult(
            baseline_id=asset_id,
            scanned_path=asset.path,
            scanned_hash=current_hash,
            is_consistent=is_consistent,
            details=details,
            scan_time=datetime.utcnow()
        )
        
        # Update asset status
        asset.is_consistent = is_consistent
        asset.last_scanned_at = result.scan_time
        self.repo.update_asset(asset)
        self.repo.save_scan_result(result)
        
        return result

    def get_dashboard_summary(self) -> DashboardStats:
        return self.repo.get_stats()

    def get_all_assets(self) -> List[Asset]:
        return self.repo.get_all_assets()
