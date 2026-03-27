# [에스엘(SL) 합격 제안서] SDF 무결성 및 플랫폼 개발 과제 보고서

## 1. 과제 목표 (Objective)
- **SDF(Software Defined Factory)** 구현을 위한 핵심 IT 플랫폼 아키텍처 제시
- 공장 내 제조 소프트웨어, 설정값 및 물류 데이터의 무결성(Integrity) 보장 체계 구축
- Python, Oracle, FastAPI 등 최신 엔터프라이즈 기술 스택을 활용한 솔루션 개발 능력 증명

## 2. 해결 방안 (Solution Architecture)
본 프로젝트는 **SDF-IP (Software Defined Factory - Integrity Platform)**를 제안합니다.

### 🏢 아키텍처 설계
- **Core Engine**: `dirhash` 라이브러리를 고도화하여 대규모 디렉토리 트리의 해시값을 병렬로 계산.
- **Persistence Layer**: **Oracle (SL 표준 DB)** 연동을 위해 SQLAlchemy 2.0의 Modern Mapped Syntax 적용.
- **API Interface**: FastAPI를 활용한 고성능 REST API와 비동기 백그라운드 스캔(BackgroundTasks) 구현.

### 🛡 핵심 기능
- **Baseline Management**: 공장 내 기기 및 물류의 '골든 버전'을 등록하고 관리.
- **Audit Logging**: 모든 스캔 결과를 Oracle DB에 기록하여 무결성 위반 이력을 실시간 추적.
- **Logistics Integration**: SD/MM 모듈과 연계 가능한 데이터 패키지 검증 로직 포함.

## 3. 코드 하이라이트 (Code Highlights)
- **현신적인 DB 설계**: `app/models.py`에서 확인할 수 있는 SQLAlchemy 2.0 패턴은 에스엘의 복잡한 데이터 모델링을 유연하게 처리할 수 있음을 보여줍니다.
- **고성능 무결성 검증**: `app/core/hashing.py`는 다중 스레드를 활용해 수만 개의 파일을 단시간에 검증하도록 설계되었습니다.

## 4. MCP 고도화 도구 활용 결과
- **Context7**: 최신 오픈소스 문법 및 Oracle 연동 베스트 프랙티스 적용을 위한 지식 자산으로 활용.
- **TestSprite**: 시스템 기획(Standard PRD)부터 테스트 계획서 작성까지 자동화하여 개발의 생산성과 신뢰성을 확보.

## 5. 결론 및 기대 효과
제안된 SDF-IP는 에스엘 공장혁신팀의 IT 플랫폼 개발 직무에서 요구하는 **"SDF 구현을 위한 플랫폼 개발"** 및 **"물류 관제 시스템 개발"** 역량을 즉각적으로 발휘할 수 있는 실질적인 토대입니다.
