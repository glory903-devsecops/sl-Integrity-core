from typing import List, Optional
from sqlalchemy.orm import Session
from . import models
from ..domain.entities import Asset, ScanResult, DashboardStats

class SQLAlchemyAssetRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_assets(self) -> List[Asset]:
        db_assets = self.db.query(models.Baseline).all()
        return [Asset.model_validate(obj) for obj in db_assets]

    def get_asset_by_id(self, asset_id: int) -> Optional[Asset]:
        db_asset = self.db.query(models.Baseline).filter(models.Baseline.id == asset_id).first()
        if db_asset:
            return Asset.model_validate(db_asset)
        return None

    def update_asset(self, asset: Asset) -> None:
        db_asset = self.db.query(models.Baseline).filter(models.Baseline.id == asset.id).first()
        if db_asset:
            db_asset.is_consistent = asset.is_consistent
            db_asset.last_scanned_at = asset.last_scanned_at
            self.db.commit()

    def save_scan_result(self, result: ScanResult) -> None:
        db_result = models.ScanResult(
            baseline_id=result.baseline_id,
            scanned_path=result.scanned_path,
            scanned_hash=result.scanned_hash,
            is_consistent=result.is_consistent,
            details=result.details,
            scan_time=result.scan_time
        )
        self.db.add(db_result)
        self.db.commit()

    def get_stats(self) -> DashboardStats:
        total_assets = self.db.query(models.Baseline).count()
        healthy_assets = self.db.query(models.Baseline).filter(models.Baseline.is_consistent == True).count()
        critical_issues = self.db.query(models.Baseline).filter(models.Baseline.is_consistent == False).count()
        total_scans = self.db.query(models.ScanResult).count()
        
        return DashboardStats(
            total_assets=total_assets,
            healthy_assets=healthy_assets,
            critical_issues=critical_issues,
            total_scans=total_scans
        )
