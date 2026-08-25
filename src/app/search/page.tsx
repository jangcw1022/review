import Header from "@/components/Header";
import ApiKeyBanner from "@/components/ApiKeyBanner";
import SearchClient from "./SearchClient";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string }>;
}) {
  const { keyword } = await searchParams;
  const hasApiKey = Boolean(process.env.KAKAO_REST_API_KEY);

  return (
    <>
      {!hasApiKey && <ApiKeyBanner />}
      <Header current="search" />
      <SearchClient hasApiKey={hasApiKey} initialKeyword={keyword} />
    </>
  );
}
