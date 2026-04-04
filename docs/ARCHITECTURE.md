# SL-Integrity-Core: Technical Architecture & Maintenance Guide

본 문서는 SL-Integrity-Core 시스템의 설계 원칙, 아키텍처 구조, 그리고 향후 유지보수를 위한 기술적 가이드라인을 제공합니다.

---

## 🏗️ 아키텍처 설계 원칙 (Design Principles)

본 프로젝트는 **Clean Architecture**와 **SOLID** 원칙을 준수하여 설계되었습니다. 이는 제조 현장의 다양한 요구사항 변화에도 비즈니스 로직을 보호하고, 하부 기술(DB, Hashing 알고리즘 등)을 유연하게 교체할 수 있도록 하기 위함입니다.

### **계층 구조 (Layered Structure)**

1.  **Domain Layer (`app/domain`)**:
    *   시스템의 핵심 비즈니스 엔티티(`Asset`, `ScanResult`)와 인터페이스(Protocols)가 정의됩니다.
    *   외부 프레임워크나 라이브러리에 의존하지 않는 순수 파이썬 코드로 구성됩니다.
2.  **Application Layer (`app/use_cases`)**:
    *   비즈니스 규칙을 구현하는 '유즈케이스' 계층입니다.
    *   `IntegrityUseCase`가 리포지토리와 해셔를 조립하여 무결성 검증 프로세스를 오케스트레이션합니다.
3.  **Infrastructure Layer (`app/infrastructure`, `app/db`)**:
    *   데이터베이스(SQLAlchemy), 외부 서비스(DirHash) 등 구체적인 구현체들이 위치합니다.
    *   도메인 계층의 인터페이스를 실제 기술로 구현합니다.
4.  **Presentation Layer (`app/api`, `frontend/`)**:
    *   사용자 접점인 FastAPI 엔드포인트와 React 기반의 대시보드입니다.

---

## 🛠️ 주요 기술적 특징 (Technical Features)

### **1. 의존성 주입 (Dependency Injection)**
`endpoints.py`에서 `get_integrity_service`를 통해 런타임에 필요한 구현체를 주입합니다.
- **장점**: 테스트 시 실제 파일 시스템이나 DB 대신 Mock 객체를 주입하여 안정적인 테스트가 가능합니다.

### **2. 전략 패턴 기반 해싱 (Strategy Pattern)**
`Hasher` 프로토콜을 통해 SHA-256 외에도 향후 다른 보안 알고리즘을 쉽게 추가할 수 있습니다.

### **3. 프론트엔드 3단계 워크플로우**
- **Dashboard**: 전체 관제 및 위변조 탐지.
- **ERP**: 자산 등록 및 시스템 탐색기를 통한 경로 수집.
- **Engine**: 정책 편집 및 실시간 로그 모니터링.

---

## 🚀 유지보수 및 확장 가이드 (Maintenance Guide)

### **새로운 자산 유형 추가 시**
1.  `app/domain/entities.py`에 필요한 필드 추가.
2.  `app/db/models.py`에 SQLAlchemy 매핑 업데이트.
3.  `alembic` 또는 `db.create_all()`을 통해 스키마 반영.

### **새로운 해싱 알고리즘 도입 시**
1.  `app/domain/protocols.py`의 `Hasher`를 상속받는 새로운 클래스를 `app/infrastructure/services/`에 작성.
2.  `endpoints.py`의 DI 설정에서 클래스 인스턴스만 교체.

### **테스트 실행 방법**
프로젝트 루트에서 다음 명령어를 실행하여 핵심 로직을 검증합니다.
```bash
pytest tests/
```

---

## 📈 향후 확장성 (Scalability)
- **분산 스캔**: 네트워크 부하 분산을 위해 `Celery` 등의 태스크 큐를 도입하여 비동기 대량 스캔 지원 가능.
- **알림 채널 확장**: `NotificationService` 인터페이스 추가를 통해 Slack, Email, SMS 알림 연동 용이.

---
*본 문서는 에스엘(SL) 스마트 제조 혁신을 위한 표준 아키텍처 가이드를 준수합니다.*
