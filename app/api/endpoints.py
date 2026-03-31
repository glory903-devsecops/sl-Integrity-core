from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from typing import List
import datetime

from ..db import session, models
from ..schemas import schemas
from ..services import integrity_service

router = APIRouter()

@router.get("/status")
def get_status():
    return {"status": "SL-Integrity-Core API Center Online", "timestamp": datetime.datetime.now()}

@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(session.get_db)):
    return integrity_service.get_dashboard_stats(db)

@router.post("/baselines/", response_model=schemas.Baseline)
def create_baseline(baseline: schemas.BaselineCreate, db: Session = Depends(session.get_db)):
    try:
        current_hash = integrity_service.calculate_integrity_hash(baseline.path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Hash calculation failed: {str(e)}")
        
    db_baseline = models.Baseline(
        **baseline.dict(),
        current_hash=current_hash,
        is_consistent=True
    )
    db.add(db_baseline)
    db.commit()
    db.refresh(db_baseline)
    return db_baseline

@router.get("/baselines/", response_model=List[schemas.Baseline])
def list_baselines(skip: int = 0, limit: int = 100, db: Session = Depends(session.get_db)):
    return db.query(models.Baseline).offset(skip).limit(limit).all()

@router.post("/baselines/{baseline_id}/scan")
async def trigger_scan(baseline_id: int, background_tasks: BackgroundTasks, db: Session = Depends(session.get_db)):
    baseline = db.query(models.Baseline).filter(models.Baseline.id == baseline_id).first()
    if not baseline:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    background_tasks.add_task(integrity_service.perform_scan_task, baseline_id)
    return {"message": "Integrity scan task scheduled in background"}

@router.post("/scan-all")
async def trigger_scan_all(background_tasks: BackgroundTasks, db: Session = Depends(session.get_db)):
    baselines = db.query(models.Baseline).all()
    for baseline in baselines:
        background_tasks.add_task(integrity_service.perform_scan_task, baseline.id)
    return {"message": f"Bulk scan of {len(baselines)} assets scheduled"}

@router.get("/scans/", response_model=List[schemas.ScanResult])
def list_scans(skip: int = 0, limit: int = 100, db: Session = Depends(session.get_db)):
    return db.query(models.ScanResult).order_by(models.ScanResult.scanned_at.desc()).offset(skip).limit(limit).all()
