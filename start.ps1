# 에스엘(SL) SDF-IP 플랫폼 빠른 시작 스크립트 (Windows PowerShell용)

Write-Host "🚀 SL SDF-IP 플랫폼 시작 중..." -ForegroundColor Cyan

# 1. 가상환경 확인 및 생성
if (-not (Test-Path "venv")) {
    Write-Host "📦 가상환경(venv)이 없습니다. 새롭게 생성합니다..." -ForegroundColor Yellow
    python3 -m venv venv
}

# 2. 가상환경 활성화
Write-Host "🔌 가상환경 활성화 중..." -ForegroundColor Cyan
. .\venv\Scripts\Activate.ps1

# 3. 필수 패키지 설치 및 업데이트
Write-Host "📥 필요한 패키지를 확인하고 설치합니다..." -ForegroundColor Cyan
python3 -m pip install --upgrade pip
pip install -r requirements.txt

# 4. 서버 실행
Write-Host "🌐 서버를 시작합니다... (http://127.0.0.1:8000/docs)" -ForegroundColor Green
$env:PYTHONPATH += ";."
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
