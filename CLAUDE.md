# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

A Next.js app (TypeScript, App Router, `src/` dir, Tailwind CSS v4, ESLint) lives at the repo root via `create-next-app` — run with `npm run dev`. The three prototype screens have been ported into it 1:1 (same markup/Tailwind classes, same DESIGN-2.md look):

- `src/app/page.tsx` — landing page (was `index.html`)
- `src/app/search/page.tsx` + `SearchClient.tsx` — 카카오맵 키워드/카테고리 검색 (was `search.html`)
- `src/app/browse/page.tsx` + `BrowseClient.tsx` — 시/도 → 시/군/구 → 카테고리 지역별 둘러보기 (was `browse.html`)

Shared pieces: `src/components/` (`Header`, `PlaceCard`, `StatusPanel`, `ApiKeyBanner`, `HeroSearchForm`), `src/lib/` (`kakao.ts`, `regions.ts`, `fetchPlaces.ts`). All three pages share one `Header` with nav links between `/`, `/search`, `/browse`.

The Kakao REST API call now runs server-side in `src/app/api/search/route.ts`, reading `KAKAO_REST_API_KEY` from `process.env` (set it in `.env.local`, which is gitignored — see `.env.local.example`). Client pages call `/api/search` instead of `dapi.kakao.com` directly, so the key is never exposed to the browser. `/search` and `/browse` are both `force-dynamic` so a key added/rotated in the deploy environment takes effect without a full rebuild.

The original `index.html`, `search.html`, `browse.html` at the repo root are now **stale duplicates** left over from before the migration — the Next.js app in `src/app` is the real, current implementation. Prefer deleting the root HTML files next time they'd cause confusion; don't edit them going forward.

Still not wired up anywhere: Supabase (DB + Auth), persistence for "가볼 곳" saves (the save button is still visual-only, per-card React state with no backend write), Kakao Map SDK (only the REST search API is used, no actual map view), Gemini API, and the dashboard — see `PRD.md`.

## What matzip is (from PRD.md)

matzip is a planned map-based restaurant-tracking web app: users save places they want to try ("가볼 곳"), convert them to "가본 곳" with a short visit note after actually going, and get "오늘 뭐 먹지" (what to eat today) recommendations filtered by category/tag from their own saved list. Planned stack per `PRD.md`: Next.js, Supabase (DB + Auth), Kakao Map API (place search/map), Google Gemini API (AI review summary + sentiment analysis on visit notes), Tailwind CSS, Vercel deploy, free-tier only. Full feature spec, screen flow, and data model are in `PRD.md` — read it before implementing any real feature rather than re-deriving requirements from scratch.

## Design system (from DESIGN.md / DESIGN-2.md)

`DESIGN-2.md` is the current design doc — it's `DESIGN.md` plus an added landing-page section (`diff` shows `DESIGN-2.md` is a strict superset). Treat `DESIGN-2.md` as authoritative; `DESIGN.md` is kept only for the earlier history.

- Mood: soft minimal (Airbnb/Notion-like) — generous `border-radius`, light shadows, generous whitespace, no hard edges or heavy drop shadows.
- Primary color: `#FF8C69` (coral/apricot) — buttons, accents.
- Background: `#FFFBF7` (warm ivory).
- Text: dark charcoal (`#333333`-ish), not pure black.
- Font: Pretendard, strong size/weight contrast between headings and body (body ~16px).
- Reference: Notion-style card/panel layout for lists and (future) dashboard.
- Landing page section order is fixed: 히어로 → 인기 맛집 카드 → 최근 리뷰 → 서비스 특징 → 푸터. `index.html` implements exactly this structure — keep new sections consistent with it (see `tailwind.config` inline in `index.html` for the registered `primary`/`cream`/`ink` color tokens and `xl2` radius).

## Remote

`origin` points to `https://github.com/jangcw1022/review.git` (branch `main`).

## 반응형
- 모바일 (375)
- 태블릿 (768)
- 데스크톱 (1440)
으로 브레이크포인트 설정
