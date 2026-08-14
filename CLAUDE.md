# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

This repo currently contains only a **static marketing landing page** (`index.html`) for a product called **matzip** that has not been built yet. There is no app code, no `package.json`, no build step — `index.html` is a single self-contained file styled with the Tailwind CDN (`<script src="https://cdn.tailwindcss.com">`), so it's viewed by opening it directly in a browser (`open index.html`). There is no test suite and no lint config.

The planned full product (map + Supabase + Next.js, see below) does not exist yet in this repo — don't assume any of that stack is wired up.

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
