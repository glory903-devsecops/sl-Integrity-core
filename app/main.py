from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from .core import database, hashing

# FastAPI 초기화
app = FastAPI(
    title="에스엘(SL) SDF 데이터 무결성 플랫폼",
    description="SDF(Software Defined Factory) 무결성 및 데이터 라이프사이클 관리를 위한 IT 플랫폼",
    version="1.0.0"
)

# 테이블 생성 (데모용. 운영 환경에서는 Alembic 사용 권장)
models.Base.metadata.create_all(bind=database.engine)

@app.get("/")
def read_root():
    return {"message": "에스엘(SL) SDF-IP API 센터에 오신 것을 환영합니다.", "status": "정상 작동 중"}

@app.post("/baselines/", response_model=schemas.Baseline)
def create_baseline(baseline: schemas.BaselineCreate, db: Session = Depends(database.get_db)):
    # 초기 해시 계산
    try:
        current_hash = hashing.calculate_integrity_hash(baseline.path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"해시 계산 실패: {str(e)}")
        
    db_baseline = models.Baseline(
        **baseline.dict(),
        current_hash=current_hash
    )
    db.add(db_baseline)
    db.commit()
    db.refresh(db_baseline)
    return db_baseline

@app.get("/baselines/", response_model=List[schemas.Baseline])
def list_baselines(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return db.query(models.Baseline).offset(skip).limit(limit).all()

async def perform_scan_task(baseline_id: int, db: Session):
    baseline = db.query(models.Baseline).filter(models.Baseline.id == baseline_id).first()
    if not baseline:
        return
        
    try:
        new_hash = hashing.calculate_integrity_hash(baseline.path)
        is_match = (new_hash == baseline.current_hash)
        
        scan_result = models.ScanResult(
            baseline_id=baseline_id,
            scanned_path=baseline.path,
            scan_hash=new_hash,
            is_match=is_match
        )
        db.add(scan_result)
        db.commit()
    except Exception as e:
        print(f"Scan failed for baseline {baseline_id}: {e}")

@app.post("/baselines/{baseline_id}/scan")
async def trigger_scan(baseline_id: int, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    baseline = db.query(models.Baseline).filter(models.Baseline.id == baseline_id).first()
    if not baseline:
        raise HTTPException(status_code=404, detail="기준(Baseline) 데이터를 찾을 수 없습니다.")
        
    background_tasks.add_task(perform_scan_task, baseline_id, db)
    return {"message": "백그라운드 스캔이 시작되었습니다.", "baseline_id": baseline_id}

@app.get("/scans/", response_model=List[schemas.ScanResult])
def list_scans(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return db.query(models.ScanResult).order_by(models.ScanResult.scanned_at.desc()).offset(skip).limit(limit).all()
