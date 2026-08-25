export default function ApiKeyBanner() {
  return (
    <div className="bg-primary text-white text-xs tablet:text-sm text-center px-4 py-2.5">
      ⚠️ 카카오 REST API 키가 설정되지 않았어요. 프로젝트 루트의{" "}
      <code className="bg-white/20 px-1.5 py-0.5 rounded">.env.local</code> 파일에{" "}
      <code className="bg-white/20 px-1.5 py-0.5 rounded">KAKAO_REST_API_KEY</code> 값을{" "}
      <a
        href="https://developers.kakao.com/console/app"
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-semibold"
      >
        카카오 디벨로퍼스
      </a>
      에서 발급받은 본인의 무료 REST API 키로 설정해야 검색이 동작합니다.
    </div>
  );
}
