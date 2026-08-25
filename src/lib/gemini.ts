export type Sentiment = "positive" | "negative";

export interface SummarizeResult {
  summary: string;
  sentiments: Sentiment[];
}

// 리뷰마다 개별 호출하지 않고, 전체 방문기록을 한 번의 Gemini 호출에 배열로
// 넘겨 요약 + 리뷰별 감성분류를 동시에 받는다.
export async function summarizeReviews(memos: string[]): Promise<SummarizeResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았어요.");
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const numbered = memos.map((memo, i) => `${i + 1}. ${memo}`).join("\n");
  const prompt = `다음은 한 맛집에 대해 여러 사용자가 남긴 방문 후기(한줄 메모)입니다.

${numbered}

작업:
1) 모든 후기를 종합해서 한국어로 자연스러운 한 줄 요약(summary)을 작성하세요. 30자 내외로 간결하게 작성하세요.
2) 각 후기를 순서대로 긍정(positive) 또는 부정(negative)으로 분류하세요. 애매하면 더 가까운 쪽으로 판단하세요.

다음 JSON 형식으로만 응답하세요. 다른 설명이나 텍스트는 포함하지 마세요:
{"summary": "...", "sentiments": ["positive", "negative", ...]}

sentiments 배열의 길이는 반드시 후기 개수(${memos.length}개)와 정확히 같아야 합니다.`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini API 오류 (HTTP ${response.status}): ${body.slice(0, 200)}`);
  }

  const data = await response.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini 응답에서 텍스트를 찾을 수 없어요.");
  }

  let parsed: { summary?: unknown; sentiments?: unknown };
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini 응답이 올바른 JSON이 아니에요.");
  }

  if (
    typeof parsed.summary !== "string" ||
    !Array.isArray(parsed.sentiments) ||
    parsed.sentiments.length !== memos.length ||
    !parsed.sentiments.every((s) => s === "positive" || s === "negative")
  ) {
    throw new Error("Gemini 응답 형식이 예상과 달라요.");
  }

  return { summary: parsed.summary, sentiments: parsed.sentiments as Sentiment[] };
}
