from typing import List, Protocol, Optional
from datetime import datetime
from ..domain.entities import Asset, ScanResult, DashboardStats

class HashingServiceInterface(Protocol):
    def calculate_hash(self, path: str) -> str:
        ...

class AssetRepositoryInterface(Protocol):
    def get_all_assets(self) -> List[Asset]:
        ...
    def get_asset_by_id(self, asset_id: int) -> Optional[Asset]:
        ...
    def update_asset(self, asset: Asset) -> None:
        ...
    def save_scan_result(self, result: ScanResult) -> None:
        ...
    def get_stats(self) -> DashboardStats:
        ...

class IntegrityUseCase:
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

# Helper for tests or legacy compatibility if needed
def check_asset_integrity(use_case: IntegrityUseCase, asset_id: int) -> ScanResult:
    return use_case.execute_scan(asset_id)
