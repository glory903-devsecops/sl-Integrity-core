# SL-Integrity-Core (무결성 핵심 관제 시스템)

![Dashboard Mockup](file:///C:/Users/glory/.gemini/antigravity/brain/29b1f3ae-5261-4c96-9da8-100f2687e282/integrity_dashboard_mockup_1774965721256.png)

## 📌 개요
본 플랫폼은 **에스엘(SL)**과 같은 글로벌 제조업의 **SDF(Software Defined Factory)** 구현을 위해 설계된 엔터프라이즈급 자산 무결성 관제 솔루션입니다. 

스마트 팩토리의 수많은 제어 단말과 서버 자산에 대한 보안 위협을 실시간으로 탐지하며, 인가되지 않은 파일 변경이나 악성 코드에 의한 변조를 해시 알고리즘 기반으로 즉각 포착합니다. 단순한 모니터링을 넘어, 제조 공정의 영속성과 신뢰성을 보장하는 핵심 보안 인프라로서의 가치를 제안합니다.

## 🚀 Key Technical Values (기술적 차별점)

### 1. Clean Architecture & SOLID Design
단순한 스크립트 형태를 벗어나, 유지보수와 확장이 용이한 **Clean Architecture** 구조로 설계되었습니다.
- **Domain Layer**: 비즈니스 규칙을 순수 파이썬 엔티티로 정의하여 외부 프레임워크와의 의존성을 분리했습니다.
- **Use Case Layer**: 무결성 검사 로직을 독립적인 유스케이스로 구현하여 테스트 용이성을 극대화했습니다.
- **Infrastructure Layer**: SQLAlchemy를 통한 Repository 패턴 적용으로 SQLite부터 Oracle DB까지 유연한 데이터 계층 전환이 가능합니다.

### 2. High-Performance Scaling (3,000+ Assets)
제조 현장의 대규모 자산을 수용하기 위해 최적화된 비동기(Asynchronous) 스캔 로직을 구현했습니다.
- **Batch Processing**: 2,000개 이상의 자산 등록 및 동시 무결성 검증 시에도 안정적인 성능을 유지함을 검증 완료했습니다.
- **Efficient Hashing**: `dirhash` 라이브러리를 활용한 디렉토리 단위 해싱으로 검사 속도와 정확도를 동시에 확보했습니다.

### 3. Professional UI/UX (React + Tailwind CSS)
제조 현장의 관리자가 한눈에 시스템 상태를 파악할 수 있도록 데이터 시각화 중심의 대시보드를 제공합니다.
- **Real-time Status**: Chart.js를 이용한 시스템 건강도 시각화 및 실시간 상태 업데이트.
- **Modern Tech Stack**: Vite + React 18 + Tailwind CSS 기반의 고성능 SPA(Single Page Application).
- **Enterprise Aesthetic**: SL Corp의 브랜드 아이덴티티와 어울리는 Deep Navy 톤의 프리미엄 다크 모드 UI.

## 🛠 Tech Stack
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, Pydantic v2
- **Frontend**: React, Tailwind CSS, Lucide Icons, Chart.js
- **Database**: SQLite (Development) / Scalable to Enterprise DB
- **Tools**: Pytest, Vite

## 📊 Verification
- **Unit Tests**: 핵심 유스케이스 및 해싱 로직에 대한 100% 테스트 통과.
- **Scaling Test**: 3,000개 더미 자산 생성 및 무결성 변조 탐지 시나리오 성공적 수행.

---
*본 프로젝트는 에스엘(SL)의 SDF 비전에 영감을 받아 제작된 기술 데모이며, 제조 보안 전문가로서의 역량을 증명하기 위해 설계되었습니다.*
