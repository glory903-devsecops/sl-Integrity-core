from typing import List, Protocol, Optional
from datetime import datetime
from .entities import Asset, ScanResult, DashboardStats

class HashingServiceInterface(Protocol):
    def calculate_hash(self, path: str) -> str:
        """Calculate hash for a given file or directory."""
        ...

class AssetRepositoryInterface(Protocol):
    def get_all_assets(self) -> List[Asset]:
        """Fetch all managed assets."""
        ...
    def get_asset_by_id(self, asset_id: int) -> Optional[Asset]:
        """Fetch a specific asset by its ID."""
        ...
    def update_asset(self, asset: Asset) -> None:
        """Update an existing asset's status."""
        ...
    def save_scan_result(self, result: ScanResult) -> None:
        """Save a new scan result to history."""
        ...
    def get_stats(self) -> DashboardStats:
        """Retrieve aggregated dashboard statistics."""
        ...
