import os
import shutil
import tempfile
from app.core import hashing, database
from app import models, schemas
from sqlalchemy.orm import Session

def test_full_workflow():
    print("🔍 [1/4] 무결성 해싱 엔진 테스트 시작...")
    
    # 1. 임시 테스트 디렉토리 생성
    with tempfile.TemporaryDirectory() as tmpdir:
        test_file = os.path.join(tmpdir, "config.txt")
        with open(test_file, "w") as f:
            f.write("SL Factory Ver 1.0")
        
        # 초기 해시 계산
        original_hash = hashing.calculate_integrity_hash(tmpdir)
        print(f"✅ 초기 해시 생성 완료: {original_hash}")
        
        # 파일 변조 시뮬레이션
        with open(test_file, "a") as f:
            f.write("\nUnauthorized Change!")
        
        tampered_hash = hashing.calculate_integrity_hash(tmpdir)
        print(f"⚠️ 변조 후 해시: {tampered_hash}")
        
        if original_hash != tampered_hash:
            print("✨ 성공: 시스템이 파일의 미세한 변경(변조)을 성공적으로 감지했습니다.")
        else:
            print("❌ 실패: 변조 감지에 실패했습니다.")
            return False

    print("\n📦 [2/4] 데이터베이스 연동 테스트 시작 (SQLite Fallback)...")
    # 테이블 생성 보장
    models.Base.metadata.create_all(bind=database.engine)
    db = next(database.get_db())
    
    # 3. 기준(Baseline) 등록 테스트
    new_baseline = models.Baseline(
        name="테스트 모듈",
        path="/test/path",
        current_hash="original_hash_123",
        description="자동화 테스트용"
    )
    db.add(new_baseline)
    db.commit()
    db.refresh(new_baseline)
    print(f"✅ Baseline DB 등록 성공 (ID: {new_baseline.id})")

    # 4. 스캔 이력 기록 테스트
    new_scan = models.ScanResult(
        baseline_id=new_baseline.id,
        scanned_path="/test/path",
        scanned_hash="tampered_hash_456",
        is_consistent=False,
        details="테스트 중 인위적 변조 발생"
    )
    db.add(new_scan)
    db.commit()
    print("✅ 스캔 이력(Audit Log) DB 기록 성공")

    print("\n🎉 [모든 테스트 통과] 플랫폼 핵심 로직이 정상 작동함을 확인했습니다.")
    return True

if __name__ == "__main__":
    try:
        success = test_full_workflow()
        if not success:
            exit(1)
    except Exception as e:
        print(f"❌ 테스트 중 오류 발생: {e}")
        exit(1)
