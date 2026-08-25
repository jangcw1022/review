import { NextRequest, NextResponse } from "next/server";
import { summarizeReviews } from "@/lib/gemini";
import { fetchCachedSummary, fetchPlaceReviewMemos, upsertCachedSummary } from "@/lib/placeSummary";

const MIN_REVIEWS_FOR_SUMMARY = 3;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json({ status: "error", message: "placeId가 필요해요." }, { status: 400 });
  }

  let memos: string[];
  try {
    memos = await fetchPlaceReviewMemos(placeId);
  } catch (err) {
    console.error("[api/summarize] 방문기록 조회 실패:", err);
    return NextResponse.json(
      { status: "error", message: "방문기록을 불러오지 못했어요." },
      { status: 500 }
    );
  }

  if (memos.length < MIN_REVIEWS_FOR_SUMMARY) {
    return NextResponse.json({ status: "insufficient", reviewCount: memos.length });
  }

  // 캐시된 요약이 있고 그 이후로 방문기록 수가 그대로면 Gemini를 다시 부르지
  // 않고 캐시를 그대로 반환한다 — 새 방문기록이 추가된 경우에만 재계산.
  let cached = null;
  try {
    cached = await fetchCachedSummary(placeId);
  } catch (err) {
    console.error("[api/summarize] 캐시 조회 실패 (재계산으로 진행):", err);
  }

  if (cached && cached.review_count === memos.length) {
    return NextResponse.json({
      status: "ok",
      summary: cached.summary,
      positiveRatio: cached.positive_ratio,
      reviewCount: cached.review_count,
    });
  }

  try {
    const { summary, sentiments } = await summarizeReviews(memos);
    const positiveCount = sentiments.filter((s) => s === "positive").length;
    const positiveRatio = Math.round((positiveCount / sentiments.length) * 100);

    await upsertCachedSummary(placeId, summary, positiveRatio, memos.length);

    return NextResponse.json({ status: "ok", summary, positiveRatio, reviewCount: memos.length });
  } catch (err) {
    console.error("[api/summarize] Gemini 호출 실패:", err);
    return NextResponse.json(
      { status: "error", message: "AI 요약을 불러오지 못했어요. 잠시 후 다시 시도해주세요." },
      { status: 502 }
    );
  }
}
