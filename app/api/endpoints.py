from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from ..db.session import get_db
from ..infrastructure.database.sqlalchemy_repo import SQLAlchemyAssetRepository
from ..infrastructure.services.hasher_impl import DirHasher
from ..application.integrity_service import IntegrityService
from ..domain.entities import Asset, DashboardStats, ScanResult

router = APIRouter()

def get_integrity_service(db: Session = Depends(get_db)) -> IntegrityService:
    repo = SQLAlchemyAssetRepository(db)
    hasher = DirHasher()
    return IntegrityService(repo, hasher)

@router.get("/assets", response_model=List[Asset])
def list_assets(service: IntegrityService = Depends(get_integrity_service)):
    return service.get_all_assets()

@router.get("/stats", response_model=DashboardStats)
def get_stats(service: IntegrityService = Depends(get_integrity_service)):
    return service.get_dashboard_summary()

@router.post("/scan/{asset_id}", response_model=ScanResult)
def scan_asset(asset_id: int, service: IntegrityService = Depends(get_integrity_service)):
    try:
        return service.execute_scan(asset_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/scan-all")
def scan_all_assets(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    service = get_integrity_service(db)
    assets = service.get_all_assets()
    for asset in assets:
        background_tasks.add_task(service.execute_scan, asset.id)
    return {"message": f"Scanning {len(assets)} assets in background"}
