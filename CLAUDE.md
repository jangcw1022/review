# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

A Next.js app (TypeScript, App Router, `src/` dir, Tailwind CSS v4, ESLint) has been scaffolded at the repo root via `create-next-app` — run with `npm run dev`. It is still an empty default scaffold; none of the real matzip screens/features have been ported into it yet.

The repo also still has three **static, standalone prototype pages** at the root, kept only as reference/prototypes and NOT part of the Next.js app (Next.js doesn't route to them):
- `index.html` — landing page (Tailwind CDN, self-contained)
- `search.html` — 카카오맵 키워드/카테고리 검색 프로토타입 (동작하려면 파일 상단에 본인 카카오 REST API 키를 넣어야 함)
- `browse.html` — 시/도 → 시/군/구 → 카테고리 지역별 둘러보기 프로토타입

None of these three have any backend, persistence (no localStorage/Supabase), auth, AI, or map SDK wired up — see `PRD.md` for what's still to build. When implementing a real feature, build it inside the Next.js app (`src/app`), using these HTML files as design/behavior reference rather than editing them further.

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
