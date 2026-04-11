from typing import List, Optional
from sqlalchemy.orm import Session
from ...db import models
from ...domain.entities import Asset, ScanResult, DashboardStats
from ...domain.interfaces import AssetRepositoryInterface

class SQLAlchemyAssetRepository(AssetRepositoryInterface):
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
            details=result.details
        )
        self.db.add(db_result)
        self.db.commit()

    def register_asset(self, asset: Asset) -> Asset:
        db_asset = models.Baseline(
            name=asset.name,
            path=asset.path,
            description=asset.description,
            department=asset.department,
            location=asset.location,
            current_hash=asset.current_hash,
            is_consistent=asset.is_consistent
        )
        self.db.add(db_asset)
        self.db.commit()
        self.db.refresh(db_asset)
        return Asset.model_validate(db_asset)

    def get_stats(self) -> DashboardStats:
        total_assets = self.db.query(models.Baseline).count()
        healthy_assets = self.db.query(models.Baseline).filter(models.Baseline.is_consistent == True).count()
        critical_issues = self.db.query(models.Baseline).filter(models.Baseline.is_consistent == False).count()
        total_scans = self.db.query(models.ScanResult).count()
        
        # Department stats
        dept_stats = {}
        distinct_depts = self.db.query(models.Baseline.department).distinct().all()
        for (dept_name,) in distinct_depts:
            if not dept_name: continue
            dept_total = self.db.query(models.Baseline).filter(models.Baseline.department == dept_name).count()
            dept_healthy = self.db.query(models.Baseline).filter(
                models.Baseline.department == dept_name, 
                models.Baseline.is_consistent == True
            ).count()
            dept_stats[dept_name] = {"total": dept_total, "healthy": dept_healthy}

        # Recent scans (Audit Log)
        recent_scans_db = self.db.query(models.ScanResult).order_by(models.ScanResult.scanned_at.desc()).limit(15).all()
        recent_scans = []
        for obj in recent_scans_db:
            res = ScanResult.model_validate(obj)
            # Fetch baseline details for better UI context
            res.details = f"[{obj.baseline.name}] {obj.baseline.location} - {res.details}"
            recent_scans.append(res)

        return DashboardStats(
            total_assets=total_assets,
            healthy_assets=healthy_assets,
            critical_issues=critical_issues,
            total_scans=total_scans,
            department_stats=dept_stats,
            recent_scans=recent_scans
        )
