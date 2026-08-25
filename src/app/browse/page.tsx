import Header from "@/components/Header";
import ApiKeyBanner from "@/components/ApiKeyBanner";
import BrowseClient from "./BrowseClient";

export const dynamic = "force-dynamic";

export default function BrowsePage() {
  const hasApiKey = Boolean(process.env.KAKAO_REST_API_KEY);

  return (
    <>
      {!hasApiKey && <ApiKeyBanner />}
      <Header current="browse" />
      <BrowseClient hasApiKey={hasApiKey} />
    </>
  );
}
