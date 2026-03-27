from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import List
import datetime

from . import models, schemas
from .core import database, hashing

# FastAPI 초기화
app = FastAPI(
    title="SL Integrity-Core",
    description="에스엘(SL) 스마트 팩토리 무결성 관제 플랫폼",
    version="2.1.0"
)

# Static files mount
app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/static/index.html")

# 테이블 생성 (데모용)
models.Base.metadata.create_all(bind=database.engine)

@app.get("/api")
def read_root():
    return {"message": "에스엘(SL) SL-Integrity-Core API 센터", "status": "정상 작동 중"}

@app.post("/baselines/", response_model=schemas.Baseline)
def create_baseline(baseline: schemas.BaselineCreate, db: Session = Depends(database.get_db)):
    # 초기 해시 계산
    try:
        current_hash = hashing.calculate_integrity_hash(baseline.path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"해시 계산 실패: {str(e)}")
        
    db_baseline = models.Baseline(
        **baseline.dict(),
        current_hash=current_hash,
        is_consistent=True
    )
    db.add(db_baseline)
    db.commit()
    db.refresh(db_baseline)
    return db_baseline

@app.get("/baselines/", response_model=List[schemas.Baseline])
def list_baselines(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return db.query(models.Baseline).offset(skip).limit(limit).all()

def perform_scan_task(baseline_id: int):
    # 백그라운드 작업은 별도의 세션을 생성해야 함
    db = database.SessionLocal()
    try:
        baseline = db.query(models.Baseline).filter(models.Baseline.id == baseline_id).first()
        if not baseline:
            return
            
        new_hash = hashing.calculate_integrity_hash(baseline.path)
        is_consistent = (new_hash == baseline.current_hash)
        
        # 상세 결과 기록
        details = "✅ 정기 무결성 검증 통과(정상)" if is_consistent else "⚠️ 미인가된 파일 변경 감지(위험)"
        
        scan_result = models.ScanResult(
            baseline_id=baseline_id,
            scanned_path=baseline.path,
            scanned_hash=new_hash,
            is_consistent=is_consistent,
            details=details
        )
        
        # Baseline 상태 업데이트
        baseline.is_consistent = is_consistent
        baseline.last_scanned_at = datetime.datetime.utcnow()
        
        db.add(scan_result)
        db.commit()
    except Exception as e:
        print(f"Scan failed for baseline {baseline_id}: {e}")
    finally:
        db.close()

@app.post("/baselines/{baseline_id}/scan")
async def trigger_scan(baseline_id: int, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    baseline = db.query(models.Baseline).filter(models.Baseline.id == baseline_id).first()
    if not baseline:
        raise HTTPException(status_code=404, detail="자산을 찾을 수 없습니다.")
        
    background_tasks.add_task(perform_scan_task, baseline_id)
    return {"message": "무결성 스캔 작업이 백그라운드에서 예약되었습니다."}

@app.get("/scans/", response_model=List[schemas.ScanResult])
def list_scans(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return db.query(models.ScanResult).order_by(models.ScanResult.scanned_at.desc()).offset(skip).limit(limit).all()
