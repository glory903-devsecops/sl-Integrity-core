# SL-Integrity-Core: Technical Detection Policies

본 문서는 SL-Integrity-Core 엔진의 무결성 탐지 메커니즘, 알고리즘 선택 기준, 그리고 각 보안 정책의 동작 원리를 상술합니다.

---

## 🏛️ 탐지 엔진 아키텍처 (Detection Architecture)

SDF(Software Defined Factory) 환경에서 무결성 엔진은 세 가지 핵심 계층으로 동작합니다:
1.  **Baseline Snapshots**: 자산이 최초 등록될 때 생성되는 원본 해시값의 기준점.
2.  **Hashing Engine**: 정책에 설정된 주기 및 알고리즘에 따라 대상 자산을 재계산하는 연산 로직.
3.  **Integrity Evaluator**: 계산된 현재 해시와 Baseline을 비교하여 일치 여부 및 위협 수준을 판별.

---

## 🛡️ 무결성 검증 알고리즘 (Integrity Algorithms)

자산의 특성에 따라 최적의 알고리즘을 선택하여 보안성과 효율성을 동시에 확보합니다.

| 알고리즘 | 보안 수준 | 용도 (Recommended Use Case) | 특징 |
| :------- | :------- | :-------------------------- | :--- |
| **SHA-256** | **Critical** | OS 커늘, 주요 시스템 임계 파일 | 충돌 저항성이 매우 높으며 국가 표준급 보안성 보장. |
| **SHA-512** | **Full** | PLC 펌웨어, R&D 핵심 코드 | 가장 높은 보안 강도를 요구하는 복잡한 대용량 바이너리 보호. |
| **MD5** | **Medium** | MES 설정 데이터, 로그 파일 백업 | 연산 속도가 매우 빠르며 대규모 텍스트 기반 차분 검출에 유리. |

---

## 📑 주요 보안 정책 명세 (Key Security Policies)

### 1. 핵심 OS 바이너리 보호 (Core OS Binary Protection)
- **대상**: `/bin`, `/sbin`, `/lib` 및 커널 모듈
- **작동 방식**: 커널 수준의 이벤트와 연동된 **실시간(Real-time)** 스캔.
- **알고리즘**: SHA-256
- **위협 판별**: 비인가된 파일 변경 시 즉시 **Critical** 등급 경보 발생 및 프로세스 차단 준비.

### 2. 공정 설정 파일 백업 (Process Config Backup)
- **대상**: MES 서버 설정 데이터, 설비 파라미터 파일 (`.xml`, `.config`)
- **작동 방식**: **매시간(Hourly)** 실행되는 **차분 스캔(Diff Scan)**.
- **알고리즘**: MD5 (빠른 연산 최우선)
- **위threat**: 관리자가 유지보수를 위해 '일시정지'할 수 있는 유연한 정책.

### 3. PLC 펌웨어 베이스라인 (PLC Firmware Baseline)
- **대상**: 제어 단말용 바이너리 및 하위 설비 펌웨어
- **작동 방식**: **6시간 주기**의 **전수 메타데이터 검증**.
- **알고리즘**: SHA-512
- **특징**: 제조 현장에서의 물리적 변조나 비인가 펌웨어 주입을 탐지.

---

## 🧠 SDF Integrity Index (무결성 지수) 산출 로직

대시보드에서 시각화되는 시스템 건강도(SDF Index)는 다음 수식을 따릅니다:

```text
Score = [ (Healthy Assets / Total Assets) * 0.7 ] + [ (Recent 24H Scan Status) * 0.3 ]
```
> [!IMPORTANT]
> 무결성 위배(Critical)가 1건이라도 발견될 경우, 지수는 즉시 50% 이하로 하락하여 관리자에게 시각적 강력 경보를 트리거합니다.

---

## 🚦 운영 안내 (Operational Guide)

- **Active (활성화)**: 모든 스캔 및 탐지 로직이 정상 작동하며 위협 감지 시 즉시 보고.
- **Paused (일시정지)**: 정기 점검, 패치 업데이트 시 오탐지를 방지하기 위한 수동 대기 상태.
- **Alert Handling**: 위협 감지 시 Baseline으로의 **자동 복구(Auto-Restoration)** 또는 **관리자 수동 승인** 절차 필요.

---
*본 기술 문서는 에스엘(SL)의 보안 가이드라인과 국제 보안 표준을 준수하여 작성되었습니다.*
