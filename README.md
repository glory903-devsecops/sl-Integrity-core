# 🛡️ SL-Integrity-Core (무결성 핵심 관제 시스템)

> **"Software Defined Factory(SDF)의 신뢰성을 보장하는 핵심 보안 엔진"**

<div align="center">
  <a href="https://glory903-devsecops.github.io/sl-Integrity-core" target="_blank">
    <img src="https://img.shields.io/badge/🚀%20LIVE%20DEMO-Launch%20Enterprise%20Dashboard-amber?style=for-the-badge&logo=react&logoColor=black" alt="Live Demo" height="40">
  </a>
  <p><i>클릭하여 에스엘(SL) 스마트 제조 자산 관제 대시보드를 즉시 체험하세요.</i></p>
</div>

<br/>

<img src="./docs/dashboard.png" alt="Dashboard Mockup" width="100%">

## 💻 프로젝트 개요 (Overview)
본 플랫폼은 **에스엘(SL)**과 같은 글로벌 제조업의 **SDF(Software Defined Factory)** 구현을 위해 설계된 엔어프라이즈급 자산 무결성 관제 솔루션입니다. 

스마트 팩토리의 수많은 제어 단말과 서버 자산에 대한 보안 위협을 실시간으로 탐지하며, 인가되지 않은 파일 변경이나 악성 코드에 의한 변조를 해시 알고리즘 기반으로 즉각 포착합니다. 단순한 모니터링을 넘어, 제조 공정의 영속성과 신뢰성을 보장하는 핵심 보안 인프라로서의 가치를 제안합니다.

## 🏛️ 주요 기능 및 워크플로우
1. **ERP 자산 등록**: '시스템 탐색기'를 통해 현장 자산을 손쉽게 등록하고 관리 부서를 지정합니다.
2. **무결성 엔진 제어**: 정책(SHA-256, MD5 등)을 실시간으로 수정하고 스캔 주기를 설정합니다.
3. **실시간 관제 대시보드**: 위변조 탐지 시 즉각적인 **Critical** 알람 및 시스템 건강도 지수 하락 시각화.

---

## 🚀 빠른 시작 (Quick Start)

### 1단계: 백엔드 서버 실행
```bash
# Python 가상환경 활성화 (Windows 기준)
> venv\Scripts\activate
> pip install -r requirements.txt
> uvicorn app.main:app --reload --port 8000
```

### 2단계: 프론트엔드 대시보드 실행
```bash
> cd frontend
> npm install
> npm run dev
```
브라우저에서 `http://localhost:5173`에 접속하여 프리미엄 대시보드를 로컬에서 확인하세요.

---

## 📘 기술 문서 및 개발자 가이드 (Technical Guides)

본 프로젝트는 향후 확장성과 유지보수를 위해 고도화된 설계를 따릅니다.

- **[Architecture Guide](docs/ARCHITECTURE.md)**: 클린 아키텍처 계층 구조 및 의존성 주입(DI) 방식 설명.
- **[Detection Policies](docs/POLICIES.md)**: 무결성 검증 알고리즘(SHA, MD5) 및 정책 동작 원리 명세.
- **[Breach Demo Scenario](docs/walkthrough.md)**: 실제 자산 변조 탐지 및 대응 시연 워크쓰루.

---

## 🛠️ Tech Stack
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, Pydantic v2
- **Frontend**: React 18, Vite 8, Tailwind CSS 3 (Industrial/Utilitarian Design)
- **Security Logic**: SHA-256 Directory Hashing Engine
- **Deployment**: GitHub Pages (Frontend), GitHub Actions (CI/CD)

---

## 📊 검증 (Verification)
- **Unit Tests**: `pytest`를 통한 핵심 유즈케이스 및 해싱 로직 100% 검증 통과.
- **Scaling Test**: 3,000개 이상의 자산에 대한 무결성 변조 실시간 탐지 성공.

---
*본 프로젝트는 에스엘(SL)의 SDF 비전에 영감을 받아 제작된 기술 데모이며, 제조 보안 전문가로서의 역량을 증명하기 위해 설계되었습니다.*

