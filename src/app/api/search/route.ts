import { NextRequest, NextResponse } from "next/server";

const KEYWORD_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";
const CATEGORY_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/category.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const endpoint = searchParams.get("endpoint") === "category" ? CATEGORY_SEARCH_URL : KEYWORD_SEARCH_URL;
  const categoryGroupCode = searchParams.get("categoryGroupCode") || "FD6";

  if (!query) {
    return NextResponse.json({ error: "MISSING_QUERY", message: "검색어가 필요해요." }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "NO_API_KEY", message: "카카오 REST API 키가 설정되지 않았어요." },
      { status: 500 }
    );
  }

  const url = new URL(endpoint);
  url.searchParams.set("query", query);
  url.searchParams.set("category_group_code", categoryGroupCode);

  const kakaoResponse = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });

  if (!kakaoResponse.ok) {
    if (kakaoResponse.status === 401) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "인증 실패 — API 키를 확인해주세요" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "UPSTREAM_ERROR", message: `HTTP ${kakaoResponse.status}` },
      { status: 502 }
    );
  }

  const data = await kakaoResponse.json();
  return NextResponse.json({ documents: data.documents });
}
