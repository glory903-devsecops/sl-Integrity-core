import os
import random
import datetime
from sqlalchemy.orm import Session
from app.core import database
from app import models

def seed_data():
    # SQLite 사용 시 스키마 변경을 반영하기 위해 기존 DB 파일 삭제
    db_path = "factory_integrity.db"
    if os.path.exists(db_path):
        print(f"♻️ 기존 데이터베이스({db_path})를 초기화합니다...")
        os.remove(db_path)

    # 테이블 생성 보장 (최신 스키마 반영)
    models.Base.metadata.create_all(bind=database.engine)
    db = next(database.get_db())
    
    # 1. 기존 데이터 정리
    print("🧹 기존 데이터를 정리하는 중...")
    db.query(models.ScanResult).delete()
    db.query(models.Baseline).delete()
    db.commit()

    # 2. 대규모 기준(Baseline) 생성 (약 1,000개)
    print("🏭 1,000개의 공장 자산(Baselines) 생성 중...")
    baselines = []
    for i in range(1, 1001):
        baseline = models.Baseline(
            name=f"SDF-Module-{i:03d}",
            path=f"/factory/line-A/device-{i:03d}/software",
            description=f"공정 라인 A의 {i}번 장비 소프트웨어 패키지",
            current_hash=f"hash_value_{random.getrandbits(128):032x}",
            last_scanned_at=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, 30))
        )
        baselines.append(baseline)
    
    db.add_all(baselines)
    db.commit()

    # 3. 대규모 스캔 이력(Scan Results) 생성 (약 10,000개)
    print("📊 10,000개의 무결성 스캔 이력(Audit Logs) 생성 중...")
    db_baselines = db.query(models.Baseline).all()
    baseline_list = [(b.id, b.path) for b in db_baselines]
    
    scan_results = []
    for _ in range(10000):
        b_id, b_path = random.choice(baseline_list)
        is_consistent = random.random() > 0.05  # 95% 정상, 5% 위반
        
        scan = models.ScanResult(
            baseline_id=b_id,
            scanned_path=b_path,
            scanned_hash=f"hash_{random.getrandbits(128):032x}",
            is_consistent=is_consistent,
            details="정기 무결성 검사 수행 완료" if is_consistent else "⚠️ 파일 변조 감지: 인가되지 않은 수정 발생",
            scanned_at=datetime.datetime.utcnow() - datetime.timedelta(hours=random.randint(1, 1000))
        )
        scan_results.append(scan)
        
        if len(scan_results) >= 2000:
            db.add_all(scan_results)
            db.commit()
            scan_results = []

    db.add_all(scan_results)
    db.commit()
    print("✅ 시뮬레이션 데이터 구축 완료!")
    print(f"- 생성된 기준 데이터: {db.query(models.Baseline).count()}개")
    print(f"- 생성된 스캔 이력: {db.query(models.ScanResult).count()}개")

if __name__ == "__main__":
    seed_data()
