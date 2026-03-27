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
    
    # 에스엘(SL) 실제 산업 현장 데이터 시뮬레이션 설정
    plants = ["Jinryang-Main", "Gyeongju-1", "Asan-Smart", "Alabama-US", "Chongqing-China"]
    products = [
        ("HL-LCU", "Headlamp Lighting Control Unit Firmware"),
        ("SBW-Main", "Shift-By-Wire Main Controller logic"),
        ("RL-Animation", "Rear Lamp Dynamic Animation Config"),
        ("AFLS-Sensor", "Adaptive Front-Lighting System Sensor Calibration"),
        ("GS-Module", "Gear Shifter Module Firmware")
    ]
    lines = ["Line-A", "Line-B", "Line-Testing", "Assy-Line-1"]

    # 1. 대규모 기준(Baseline) 생성 (1,000개)
    print("🏭 에스엘 글로벌 공장 자산(Baselines) 생성 중...")
    baselines = []
    for i in range(1, 1001):
        plant = random.choice(plants)
        prod_type, prod_desc = random.choice(products)
        line = random.choice(lines)
        
        baseline = models.Baseline(
            name=f"SL-{plant}-{prod_type}-{i:03d}",
            path=f"/factory/{plant}/{line}/{prod_type}/v{random.randint(1,5)}.{random.randint(0,9)}",
            description=f"{plant} 공장 {line}의 {prod_desc} (정식 배포본 v{random.randint(1,5)})",
            current_hash=f"hash_value_{random.getrandbits(128):032x}",
            last_scanned_at=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, 30))
        )
        baselines.append(baseline)
    
    db.add_all(baselines)
    db.commit()

    # 2. 대규모 스캔 이력(Scan Results) 생성 (10,000개)
    print("📊 10,000개의 산업 현장 무결성 감사 기록 생성 중...")
    db_baselines = db.query(models.Baseline).all()
    baseline_list = [(b.id, b.path) for b in db_baselines]
    
    scan_results = []
    for _ in range(10000):
        b_id, b_path = random.choice(baseline_list)
        is_consistent = random.random() > 0.03  # 97% 정상, 3% 변조 감지 (현장감 있게 낮은 확률)
        
        # 변조 사유 시뮬레이션
        details = "✅ 정기 무결성 검증 통과 (표준 상태)"
        if not is_consistent:
            failure_reasons = [
                "⚠️ 인가되지 않은 펌웨어 업데이트 감지",
                "🚫 설정 파일(config.bin) 임의 수정 발생",
                "❗ 이전 버전 롤백 시도 감지",
                "❌ 악성 코드 의심 파일 포함"
            ]
            details = random.choice(failure_reasons)

        scan = models.ScanResult(
            baseline_id=b_id,
            scanned_path=b_path,
            scanned_hash=f"hash_{random.getrandbits(128):032x}",
            is_consistent=is_consistent,
            details=details,
            scanned_at=datetime.datetime.utcnow() - datetime.timedelta(hours=random.randint(1, 2000))
        )
        scan_results.append(scan)
        
        if len(scan_results) >= 2000:
            db.add_all(scan_results)
            db.commit()
            scan_results = []

    db.add_all(scan_results)
    db.commit()
    print("✅ SL 최적화 시뮬레이션 데이터 구축 완료!")
    print(f"- 위치: {', '.join(plants)}")
    print(f"- 생성된 데이터: Baseline 1,000개 / Audit Logs 10,000개")

if __name__ == "__main__":
    seed_data()
