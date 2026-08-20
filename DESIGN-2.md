# matzip DESIGN.md (Design Guide)

## 1. 무드 (Mood)

**부드러운 미니멀** — 에어비앤비/Notion 감성

- 둥근 모서리 (border-radius 넉넉하게)
- 연한 그림자 (은은한 elevation, 진한 드롭섀도우 지양)
- 여백을 넉넉하게 활용한 깨끔한 레이아웃
- 각지고 딱딱한 느낌보다는 편안하고 친근한 인상

---

## 2. 컬러 (Color)

| 용도 | 컬러 | 설명 |
|---|---|---|
| 포인트 컬러 (Primary) | `#FF8C69` 계열 | 부드러운 코럴/살구색. 은은하고 따뜻한 톤, 버튼/강조 요소/포인트 아이콘에 사용 |
| 배경색 (Background) | `#FFFBF7` 계열 | 따뜻한 아이보리. 살짝 크림색이 섞인 배경으로 순백보다 따뜻한 인상 |
| 텍스트 (Text) | 다크 그레이/차콜 계열 | 순검정 대신 부드러운 다크톤 사용 권장 (예: `#333333` 내외) |
| 보조 요소 (Neutral) | 연한 그레이 계열 | 구분선, 비활성 요소 등에 사용 |

> 포인트 컬러와 배경색 모두 따뜻한 톤 계열로 통일해 전체적으로 일관된 무드를 유지

---

## 3. 타이포그래피 (Typography)

| 항목 | 내용 |
|---|---|
| 폰트 | Pretendard |
| 위계(Hierarchy) | 강한 대비 — 제목은 굵고 크게, 본문은 얇고 작게. 명확한 정보 위계 구분 |
| 본문 크기 | 16px 기준 (가독성 중심, 편안하게 읽히는 느낌) |
| 제목 크기 | 본문 대비 확실히 크고 굵게 (예: 24~28px, Bold~ExtraBold) |

---

## 4. 레퍼런스 (Reference)

**노션(Notion)** — 미니멀한 UI와 깔끔한 대시보드/차트 패널 구성

- 참고할 요소:
  - 여백을 넉넉히 쓰는 미니멀한 카드/리스트 UI
  - 사이드바·필터 버튼 등 절제된 인터랙션 요소
  - 대시보드 페이지의 차트 패널 구성 (도넛차트/워드클라우드를 카드 형태로 배치)
  - 모달/팝업의 절제된 그림자와 여백 사용
- matzip 적용 시 유의점:
  - 노션은 흑백 톤이 기본이므로, 포인트 컬러(코럴)와 배경(아이보리)은 matzip 고유 색을 그대로 유지
  - 노션의 카드/패널 구성 원칙은 **메인 화면의 지도+리스트 레이아웃**과 **대시보드 페이지**에 공통 적용
  - 로그인 모달 역시 노션의 절제된 모달 스타일(둥근 모서리, 옅은 그림자, 과하지 않은 버튼)을 참고

---

## 5. 화면 구성 — 랜딩페이지 (Landing Page)

서비스 소개용 첫 화면. 앱 내부(지도+리스트 메인화면)와는 별개로, 프로젝트를 처음 접하는 사람에게 보여주는 마케팅 성격의 페이지.

| 섹션 | 내용 |
|---|---|
| 히어로 | 서비스 이름 + 한 줄 소개 + 검색창 또는 시작 버튼. 3초 안에 무슨 서비스인지 알게 함 |
| 인기 맛집 카드 | 맛집 카드 3~6개를 가짜 데이터로 배치 (다음 단계에서 실제 데이터로 교체 예정) |
| 최근 리뷰 | 별점과 리뷰 한 줄이 흐르는 섹션. 살아있는 서비스처럼 보이게 하는 장치 |
| 서비스 특징 | AI 요약·감성분석·대시보드 등 앞으로 나올 기능 미리 소개. "Coming Soon" 뱃지 활용 가능 |
| 푸터 | 만든 사람, GitHub 링크, 프로젝트 허브로 돌아가는 링크 |

> 랜딩페이지도 위 1~4번(무드/컬러/타이포/레퍼런스)을 동일하게 적용. 특히 "인기 맛집 카드"·"최근 리뷰" 섹션은 부드러운 미니멀 카드 스타일(둥근 모서리, 연한 그림자)로, "서비스 특징" 섹션은 노션 스타일의 절제된 아이콘+텍스트 카드로 구성

---

| 구분 | 결정사항 |
|---|---|
| 무드 | 부드러운 미니멀 (둥근 모서리, 연한 그림자) |
| 포인트 컬러 | 코럴/살구색 `#FF8C69` |
| 배경색 | 아이보리 `#FFFBF7` |
| 폰트 | Pretendard, 강한 대비 위계, 본문 16px |
| 레퍼런스 | 노션(Notion) — 미니멀 카드/리스트 UI, 대시보드 차트 패널 구성 |
| 랜딩페이지 | 히어로 / 인기맛집카드 / 최근리뷰 / 서비스특징 / 푸터, 5섹션 구조 |

---

## 6. 맛집담기 페이지 디자인 가이드 (search.html)

키워드/카테고리로 맛집을 검색하고 카드 리스트로 결과를 보여주는 페이지(`search.html`, Kakao Map API 연동 예정)에 적용할 구체적인 스타일 스펙. `index.html`에서 확립한 부드러운 미니멀 톤(코럴/아이보리/Pretendard, `xl2` 라운드, `soft`/`soft-md`/`soft-lg` 그림자 토큰)을 그대로 이어받아 사용한다. 이 절은 향후 라운드에서 `search.html`을 리스타일링할 때 참고할 스펙이며, 지금 이 문서를 작성하는 시점에는 `search.html` 코드 자체를 건드리지 않는다.

### 6.1 공통 토큰 재사용

- 컬러: `primary` (`#FF8C69`), `cream` (`#FFFBF7`), `ink` (`#333333`) — `index.html`의 `tailwind.config`와 동일하게 등록되어 있어야 함.
- 라운드: 카드/패널은 `rounded-xl2`, 칩/뱃지/입력창은 `rounded-full`.
- 그림자: `shadow-soft`(기본), `shadow-soft-md`(hover), `shadow-soft-lg`(강조/드래그 카드) — `index.html`에 추가된 `boxShadow` 토큰을 `search.html`의 `tailwind.config`에도 동일하게 등록해서 재사용한다.
- 폰트: Pretendard, 본문 16px 기준(`text-base`), 굵기 대비로 위계 표현.

### 6.2 검색바 (Search Bar)

- 페이지 상단 고정형 헤더 안에 배치. 컨테이너: `bg-white rounded-full shadow-soft ring-1 ring-black/5 p-2 flex items-center gap-2`.
- 인풋: `flex-1 bg-transparent outline-none px-4 py-2.5 text-sm tablet:text-base placeholder:text-ink/40`.
- 포커스 상태: `focus-within:ring-2 focus-within:ring-primary/40 transition-shadow` (히어로 검색창과 동일 패턴).
- 검색 버튼: `bg-primary text-white font-semibold px-5 tablet:px-7 py-2.5 rounded-full hover:bg-primary/90 active:scale-95 transition-all`.
- 모바일(375)에서는 검색바를 상단에 `sticky top-0 z-10 bg-cream/90 backdrop-blur px-5 py-3` 래퍼로 감싸 스크롤 시에도 노출.

### 6.3 카테고리 필터 칩 (Category Chips)

- 가로 스크롤 가능한 칩 그룹: `flex gap-2 overflow-x-auto px-5 tablet:px-0 pb-2` (모바일에서 스냅 스크롤, `snap-x snap-mandatory` + 각 칩에 `snap-start` 권장).
- 비선택 칩: `shrink-0 text-sm font-medium text-ink/60 bg-white ring-1 ring-black/10 px-4 py-2 rounded-full hover:bg-black/5 transition-colors`.
- 선택된 칩: `shrink-0 text-sm font-semibold text-white bg-primary px-4 py-2 rounded-full shadow-soft`.
- 태블릿 이상에서는 줄바꿈 허용: `tablet:flex-wrap tablet:overflow-visible`.
- 칩 목록 예: 전체 / 한식 / 중식 / 일식 / 양식 / 카페 / 술집 등 — `index.html` 인기 맛집 카드의 카테고리 뱃지 텍스트와 동일 어휘 사용.

### 6.4 결과 카드 (Result Card)

`index.html`의 "인기 맛집 카드"(`#popular`)에서 쓴 카드 해부를 그대로 확장한다.

- 카드 컨테이너: `group bg-white rounded-xl2 shadow-soft ring-1 ring-black/5 overflow-hidden hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300`.
- 상단 이미지/플레이스홀더 영역: `relative h-36 tablet:h-40 bg-gradient-to-br from-primary/25 via-primary/10 to-cream flex items-center justify-center text-4xl` (실제 이미지 붙기 전엔 카테고리 이모지, 이미지 연동 후엔 `object-cover`로 교체). 우상단에 카테고리 뱃지 오버레이: `absolute top-3 right-3 text-xs font-semibold text-primary bg-white/90 px-2.5 py-1 rounded-full shadow-soft`.
- 본문 영역: `p-6` 내부에 제목(`text-lg font-bold mb-1.5`) → 주소/거리 등 보조 정보(`text-sm text-ink/55 mb-1`, 위치 아이콘 + 텍스트) → 한줄 설명(`text-sm text-ink/55 mb-4 leading-relaxed`) → 태그 칩 로우(`flex gap-2 flex-wrap`, 칩은 `text-xs text-ink/50 bg-black/5 px-2.5 py-1 rounded-full`) 순으로 배치.
- "가볼 곳 담기" 액션 버튼(카드 우하단 또는 본문 하단 별도 줄): 1차 액션은 `bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-primary/90 active:scale-95 transition-all`, 이미 담은 상태는 `bg-primary/10 text-primary ring-1 ring-primary/30`로 톤을 낮춰 상태 구분.

### 6.5 그리드 & 간격 (브레이크포인트별)

- 모바일 (375, 기본): 리스트는 1열 (`grid-cols-1`), 카드 간격 `gap-5`, 좌우 패딩 `px-5`. 검색바+필터+리스트 전체 세로 스택.
- 태블릿 (768, `tablet:`): 2열 (`tablet:grid-cols-2`), 간격 `tablet:gap-6`, 좌우 패딩 `tablet:px-6`. 지도 병행 뷰를 도입한다면 좌측 리스트(약 55%) + 우측 지도(약 45%) 2단 레이아웃 고려.
- 데스크톱 (1440, `desktop:`): 3열 (`desktop:grid-cols-3`), 간격 `desktop:gap-7`, 컨테이너는 `max-w-6xl desktop:max-w-7xl mx-auto`로 `index.html`과 통일. 지도 병행 뷰는 리스트(약 480px 고정폭) + 지도(나머지 유동폭) 구조 권장.
- 섹션 상하 여백은 `index.html`과 동일한 리듬 사용: 모바일 `py-8` 내외(검색 결과 페이지는 랜딩보다 컴팩트해도 됨), 태블릿 `tablet:py-10`, 데스크톱 `desktop:py-12`.

### 6.6 빈 상태 / 에러 상태 (Empty / Error State)

- 공통 레이아웃: 카드 그리드 자리에 중앙 정렬 패널 하나로 대체 — `flex flex-col items-center justify-center text-center py-20 tablet:py-28 px-5`.
- 아이콘/이모지: `w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl mb-5` (빈 검색 결과는 🔍, 에러는 ⚠️ 사용).
- 제목: `text-lg tablet:text-xl font-bold mb-2`.
- 설명: `text-sm text-ink/55 max-w-sm leading-relaxed mb-6`.
- 검색 결과 없음 문구 예: "검색 결과가 없어요" / "다른 키워드나 카테고리로 다시 찾아볼까요?".
- 에러 문구 예: "맛집 정보를 불러오지 못했어요" / "잠시 후 다시 시도해주세요."
- 액션 버튼(재시도/필터 초기화): 인기 맛집 카드의 CTA 버튼과 동일하게 `bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors`.
- 절대 빨간색/느낌표 아이콘의 채도 높은 경고색을 쓰지 않는다 — 에러 상태도 코럴/아이보리 톤 안에서 절제되게 표현해 "부드러운 미니멀" 무드를 유지한다.
