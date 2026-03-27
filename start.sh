#!/bin/bash
# 에스엘(SL) SDF-IP 플랫폼 빠른 시작 스크립트 (Mac/Linux용)

echo "🚀 SL SDF-IP 플랫폼 시작 중..."

# 1. 가상환경 확인 및 생성
if [ ! -d "venv" ]; then
    echo "📦 가상환경(venv)이 없습니다. 새롭게 생성합니다..."
    python3 -m venv venv
fi

# 2. 가상환경 활성화
echo "🔌 가상환경 활성화 중..."
source venv/bin/activate

# 3. 필수 패키지 설치 및 업데이트
echo "📥 필요한 패키지를 확인하고 설치합니다..."
python3 -m pip install --upgrade pip
pip install -r requirements.txt

# 4. 서버 실행 (경로 한글 및 공백 문제 방지를 위해 PYTHONPATH 설정)
echo "🌐 서버를 시작합니다... (http://127.0.0.1:8000/docs)"
export PYTHONPATH=$PYTHONPATH:.
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
