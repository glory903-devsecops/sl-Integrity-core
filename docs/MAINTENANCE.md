# Recording & Asset Troubleshooting Guide

GitHub 저장소 상에서 시연 영상(WebP, GIF)이나 이미지가 정상적으로 표시되지 않거나, 이전 버전이 계속 노출되는 문제를 해결하기 위한 기술 가이드입니다.

---

## 🔍 문제 원인 분석 (Root Causes)

1.  **GitHub Camo Cache**: GitHub은 보안과 성능을 위해 이미지를 프록시(`camo.githubusercontent.com`)를 통해 캐싱합니다. 이 캐시가 갱신되지 않으면 파일이 업데이트되어도 브라우저에는 옛날 버전이 보입니다.
2.  **대용량 파일 제한**: 50MB 이상의 GIF/WebP 파일은 GitHub Preview에서 렌더링되지 않을 수 있습니다.
3.  **잘못된 상대 경로**: `docs/` 폴더 내부에서 루트의 이미지를 참조할 때 경로가 어긋나면 깨진 이미지 아이콘이 나타납니다.

---

## ✅ 해결 방안 (Solutions)

### 1. 캐시 무효화 (Cache Busting)
README나 Markdown 파일에서 이미지 경로 뒤에 쿼리 스트링을 추가하여 GitHub Camo 서버가 새 이미지를 강제로 가져오게 합니다.
- **Before**: `![demo](docs/demo.webp)`
- **After**: `![demo](docs/demo.webp?v=20240404)`

### 2. GitHub 이슈/토론 업로드 활용 (추천)
가장 안정적인 방법은 GitHub Issue나 Discussion 창에 파일을 드래그 앤 드롭한 뒤 생성된 `user-images.githubusercontent.com` 링크를 사용하는 것입니다. 
- 이 링크는 GitHub 인프라 상에서 직접 서빙되므로 캐싱 문제가 거의 없으며 속도가 매우 빠릅니다.

### 3. Git LFS (Large File Storage) 확인
영상 파일이 크다면 반드시 LFS가 설치되고 추적되고 있는지 확인하세요.
```bash
git lfs status
git lfs track "*.webp"
```

---

## 📽️ 시연 영상 경로 표준안 (Standard URL Format)
프로젝트 루트 기준의 절대 경로 방식이나 GitHub CDN 링크를 권장합니다.
- `https://github.com/[USER]/[REPO]/blob/main/[PATH]?raw=true`

---
*에스엘(SL) 프로젝트의 시연 영상은 위의 '캐시 무효화' 전략을 적용하여 README에 삽입되었습니다.*
