# sl-integrity-core (무결성 핵심 관제 시스템)

## 🏢 개요 (Overview)
본 플랫폼은 **에스엘(SL)**과 같은 제조업의 **SDF(Software Defined Factory)** 구현을 위해 설계된 **엔터프라이즈급 자산 무결성 관제 솔루션**입니다. 

스마트 팩토리 환경에서 분산된 수천 개의 공장 노드(PLC, PC, Edge Device) 내 소프트웨어, 설정 파일, 물류 데이터가 인가되지 않은 수단으로 변조되지 않았음을 수학적으로 증명(Hashing)하고 실시간으로 모니터링합니다. 

> [!NOTE]
> 본 프로젝트는 에스엘 공장혁신팀의 비전과 SDF 전략에 깊은 영감을 받아 제작되었으며, 작성자는 해당 비전을 실현하는 일원이 되고자 하는 열정으로 본 솔루션을 개발하였습니다. (작성자는 현재 에스엘 소속이 아니며, 입사를 희망하는 지원자입니다.)

---

## 🖥️ 통합 관제 대시보드 (Enterprise Dashboard)
![Dashboard Verification](C:\Users\glory\.gemini\antigravity\brain\29b1f3ae-5261-4c96-9da8-100f2687e282\dashboard_stats_and_table_1774950802830.png)

### 📊 대규모 자산 하이라이트 (Scalability Test Result)
- **자산 수량**: **3,000개** 이상의 가상 SDF 노드 등록 및 관제 성공
- **처리 방식**: FastAPI Background Tasks를 활용한 비동기 병렬 스캔 알고리즘 적용
- **UI/UX**: Glassmorphism 디자인 기반의 다크 모드 인터페이스, Chart.js를 통한 실시간 무결성 분포 시각화

---

## 🛡️ 핵심 기능 (Core Features)

1.  **[Step 1] 기준점 등록 (Baseline Registration)**
    - 신뢰할 수 있는 초기 상태(Golden Image)의 폴더 전체를 시스템에 등록합니다.
    - `dirhash` 엔진이 폴더 구조 전체의 '디지털 지문(SHA-256)'을 생성하여 Oracle DB에 영구 기록합니다.
2.  **[Step 2] 고속 비동기 스캔 (High-Speed Automated Auditing)**
    - 수천 개의 노드를 주기적으로 순회하며 현재 상태의 해시를 재계산합니다.
    - 대규모 데이터 처리 시에도 현장 생산 시스템에 부하를 주지 않도록 최적화된 리소스 관리를 수행합니다.
3.  **[Step 3] 실시간 탐지 및 경보 (Real-time Detection & UI Feedback)**
    - 기준점과 현재 상태가 단 1바이트라도 다를 경우 `CRITICAL` 경고를 즉시 발생시킵니다.
    - 변조 발생 시각, 경로, 상태 변화를 대시보드에서 실시간으로 확인할 수 있습니다.

---

## 📂 기술 스택 (Tech Stack)

- **Backend**: Python 3.10+, FastAPI, SQLAlchemy 2.0, Pydantic v2
- **Database**: SQLite (Local Dev) / Oracle DB (Enterprise Production Ready)
- **Frontend**: Vanilla HTML5, CSS3 (Advanced Glassmorphism), JavaScript (ES6+), Chart.js
- **Environment**: Windows/Linux 호환 (Windows venv 최적화 완료)

---

## 🏗️ 실행 방법 (Quick Start)

### 1. 가상환경 및 의존성 설정
```powershell
# Windows 환경
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 2. 서버 실행
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. 대시보드 접속
- **Dashboard**: [http://localhost:8000/](http://localhost:8000/)
- **API Swagger**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📜 라이브러리 출처 및 감사
본 플랫폼의 핵심 해싱 엔진은 [@andhus](https://github.com/andhus)님의 [dirhash-python](https://github.com/andhus/dirhash-python) 기술을 바탕으로 개발되었습니다. 훌륭한 오픈소스 기술을 제공해주신 개발자님께 감사드립니다.
