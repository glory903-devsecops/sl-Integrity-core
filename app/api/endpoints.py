from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..db.repository import SQLAlchemyAssetRepository
from ..services.hasher import DirHasher
from ..use_cases.integrity_use_cases import IntegrityUseCase
from ..domain.entities import Asset, DashboardStats
from typing import List

router = APIRouter()

def get_integrity_use_case(db: Session = Depends(get_db)) -> IntegrityUseCase:
    repo = SQLAlchemyAssetRepository(db)
    hasher = DirHasher()
    return IntegrityUseCase(repo, hasher)

@router.get("/assets", response_model=List[Asset])
def list_assets(use_case: IntegrityUseCase = Depends(get_integrity_use_case)):
    return use_case.get_all_assets()

@router.get("/stats", response_model=DashboardStats)
def get_stats(use_case: IntegrityUseCase = Depends(get_integrity_use_case)):
    return use_case.get_dashboard_summary()

@router.post("/scan/{asset_id}")
def scan_asset(asset_id: int, use_case: IntegrityUseCase = Depends(get_integrity_use_case)):
    try:
        return use_case.execute_scan(asset_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/scan-all")
def scan_all_assets(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    use_case = get_integrity_use_case(db)
    assets = use_case.get_all_assets()
    for asset in assets:
        background_tasks.add_task(use_case.execute_scan, asset.id)
    return {"message": f"Scanning {len(assets)} assets in background"}
