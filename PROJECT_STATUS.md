# 밥집지도 — 진행 상황 인수인계

> 2026-08-21 기준. 새 프로젝트 폴더로 옮길 때 이 문서를 루트에 두고 Claude Code에 먼저 읽히면 됨.

---

## 1. 프로젝트 개요

시/도 → 시/군/구 → 음식 카테고리 순으로 조건을 좁혀 식당 목록을 보여주는 웹 서비스.

- **스택**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Vercel
- **v1 범위**: 목록 전용 (지도 뷰는 v2로 이연 결정)
- **DB/Auth**: v1 미사용

---

## 2. 데이터 소스 — 확정 사항

### 2.1 메인 API: KCISA API_CNV_063 ✅ 확정

**"한국문화정보원_전국 시티투어 코스와 함께하는 맛집 정보"** (문화공공데이터광장)

```
URL: https://api.kcisa.kr/openapi/API_CNV_063/request
파라미터: serviceKey, areaNm(시군구명), clNm(식당분류명), numOfRows, pageNo
```

**중요**: 이 API는 `areaNm`(지역)과 `clNm`(카테고리) 필터를 **모두 지원**한다.
PRD가 설계한 3단 드릴다운이 그대로 구현 가능.

> ⚠️ 아직 실제 호출로 응답 구조를 검증하지 않았음. **최우선 과제.**
> 특히 `areaNm`이 시도명("서울")을 받는지 시군구명("종로구")을 받는지 확인 필요.
> 공식 문서 예시는 `areaNm=서울&clNm=한식` 형태였음.

### 2.2 폐기된 경로 (다시 시도하지 말 것)

| API | 폐기 사유 |
|---|---|
| KCISA **API_TOU_052** (전국 세계음식점) | 우리 키의 인증 대상이 아님 → 401. 게이트웨이는 정상(0.1초 응답) |
| data.go.kr 전국일반음식점표준데이터 | REST API가 아니라 210만 건 CSV 통째 다운로드 방식 |
| 한국관광공사 TourAPI | API_CNV_063이 필터를 지원하는 게 확인되어 불필요해짐 |

### 2.3 보조 API: Google Places (New) — 리뷰 기능, **미해결**

- 상태: `reviews` 배열이 계속 비어서 옴. 원인 미확정
- 결론: **v2로 미룰 것.** PRD 원래 범위에 없던 기능이고, 메인 목록도 아직 안 뜨는 상태

---

## 3. 환경 변수

```bash
# .env.local (gitignore됨)
NEXT_PUBLIC_KAKAO_MAP_KEY=<카카오 JavaScript 키>   # 이것만 NEXT_PUBLIC_ 허용
KCISA_API_KEY=<UUID 형식 서비스키>
KCISA_API_URL=https://api.kcisa.kr/openapi/API_CNV_063/request
GOOGLE_PLACES_API_KEY=<서버 전용, NEXT_PUBLIC_ 절대 금지>
```

`.env.local.example`에도 값 없이 같은 키 목록을 유지할 것.

> 환경변수 수정 후에는 **dev 서버 재시작 필수** (Ctrl+C → `npm run dev`).
> 저장만으로는 반영되지 않음.

### 3.1 카카오맵 설정 (완료)

- developers.kakao.com에서 카카오맵 **사용 설정 ON** 완료
- **플랫폼 키 > JavaScript 키** 사용 (REST API 키 아님)
- **JavaScript SDK 도메인**에 `http://localhost:3000` 등록 완료
- 배포 후 `https://<vercel주소>` 추가 등록 필요

---

## 4. Google Places API — 학습한 규칙

나중에 v2에서 리뷰를 붙일 때 참고.

### 4.1 엔드포인트

| 엔드포인트 | 메서드 | 용도 |
|---|---|---|
| `/v1/places:searchText` | POST | 자연어 검색 |
| `/v1/places:searchNearby` | POST | 좌표+반경 검색 |
| `/v1/places/{place_id}` | GET | 상세 (리뷰 포함) |
| `/v1/places:autocomplete` | POST | 자동완성 |

### 4.2 핵심 규칙

**`X-Goog-FieldMask` 헤더 필수.** 생략하면 에러. 필드마다 과금 티어(SKU)가 다르므로 필요한 것만 요청.

**접두사 규칙 — 자주 실수하는 부분**
- Search 계열: `places.id`, `places.displayName` (배열이므로 `places.` 접두사)
- Details: `reviews`, `rating` (단일 객체이므로 접두사 없음)

**`reviews`는 Place Details 전용 필드.** Text Search로는 오지 않음.
→ 2단계 호출 필요: searchText로 `id` 획득 → `/v1/places/{id}`로 리뷰 조회

### 4.3 미해결 이슈

Place Details로 정확히 호출해도 `reviews`가 빈 채로 옴. 확인 안 한 것:
- 응답에 `"reviews": []`인지, `reviews` 키 자체가 없는지 (원인이 갈림)
- Google 문서의 API Explorer에서 같은 요청이 되는지 (프로젝트 문제인지 판별)
- Cloud Console에서 레거시 "Places API"가 아닌 **"Places API (New)"**가 켜져 있는지
- `languageCode=ko`를 빼면 되는지

---

## 5. 설계 원칙 (프로젝트 전반)

1. **API 키는 전량 서버 사이드.** 클라이언트는 자체 `/api/*` Route Handler만 호출.
   예외는 카카오맵 JS 키뿐이며, 이는 도메인 등록으로 보호.

2. **캐시 키는 카테고리가 아니라 지역(시도+시군구) 단위.**
   같은 지역 내 카테고리 전환 시 외부 API를 재호출하지 않도록. 공공 API는 일일 호출 한도가 있음.

3. **에러 상태를 코드로 구분.**
   `INVALID_PARAM`(400) / `UPSTREAM_ERROR`(502) / `UPSTREAM_TIMEOUT`(504) / `QUOTA_EXCEEDED`(429)

4. **UI 상태 4종**: 초기 안내 / 로딩 스켈레톤 / 빈 결과 / 에러+재시도

5. **목 데이터를 쓰지 말 것.** 한 번 시도했으나 지역과 무관하게 같은 결과가 나와 혼란만 가중됐음.
   실제 API 검증을 우선할 것.

---

## 6. 삽질 기록 — 반복하지 말 것

| 증상 | 실제 원인 |
|---|---|
| KCISA 401 | 엔드포인트가 틀림 (API_TOU_052 ← 우리 키는 API_CNV_063용) |
| KCISA 타임아웃 | 해당 API 백엔드 일시 장애. 게이트웨이는 정상이었음 |
| 지도는 뜨는데 마커 없음 | 카카오 키만 있고 식당 데이터 API 미설정 |
| Places `reviews` 빈 배열 | Text Search로 요청했기 때문 (Details 전용 필드) |
| `claude mcp add` 무반응 | claude 세션 **안에서** 실행함. 셸 명령은 세션 밖에서 |
| MCP 서버가 `/mcp`에 안 보임 | 세션 도중 추가 → 재시작 필요. local 스코프는 해당 폴더 전용 |

---

## 7. 다음 할 일 (우선순위)

1. **[최우선] KCISA API_CNV_063 실제 호출 검증**
   ```bash
   curl "https://api.kcisa.kr/openapi/API_CNV_063/request?serviceKey=<키>&areaNm=서울&clNm=한식&numOfRows=10&pageNo=1"
   ```
   확인할 것: 응답 형식(JSON/XML), `areaNm`이 받는 값의 단위, 필드명, 좌표 유무, `totalCount`

2. 응답 구조에 맞춰 Route Handler와 정규화 로직 확정

3. 실제 응답의 업종 값에 맞춰 카테고리 매핑 테이블 수정
   (현재 UI는 한식/분식/치킨/동양식/서양식/패스트푸드/뷔페/퓨전. 실제 `clNm` 값과 대조 필요)

4. 지역 단위 캐싱 적용

5. Vercel 배포 + 카카오 도메인 추가 등록

6. (v2) Google Places 리뷰, 지도 뷰

---

## 8. Claude Code에 던질 첫 지시문

```
PROJECT_STATUS.md를 읽고 시작해줘.

1. curl로 KCISA API_CNV_063을 직접 호출해서 실제 응답 구조를 확인해줘.
   areaNm에 "서울"과 "종로구"를 각각 넣어서 어느 단위를 받는지도 비교해줘.
2. 응답 형식이 XML이면 파서가 필요한지 판단해줘.
3. 확인된 구조에 맞춰 /api/restaurants Route Handler와 정규화 로직을 짜줘.
4. 캐시는 시도+시군구 단위로 걸어서, 카테고리 전환 시 외부 호출이 나가지 않게 해줘.

코드를 짜기 전에 1~2번 결과를 먼저 보여주고 확인받아줘.
```
