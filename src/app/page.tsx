import Header from "@/components/Header";
import HeroSearchForm from "@/components/HeroSearchForm";
import PopularPlaces from "@/components/PopularPlaces";

const RECENT_REVIEWS = [
  { initial: "연", name: "연남동 소금구이집", rating: "★★★★★", note: "고기 두께부터 다름. 재방문 100%." },
  { initial: "망", name: "망원동 파스타공방", rating: "★★★★☆", note: "트러플 크림 파스타 인생 맛집 등극." },
  { initial: "을", name: "을지로 다찌 이자카야", rating: "★★★★★", note: "혼밥하기 딱 좋은 카운터석, 사시미 신선함 인정." },
  { initial: "성", name: "성수동 마라공방", rating: "★★★☆☆", note: "매운맛 3단계 도전했다가 물만 세 잔 마심." },
  { initial: "한", name: "한남동 브런치 라운지", rating: "★★★★★", note: "통창 자리 예약은 필수. 뷰 맛집이자 맛 맛집." },
  { initial: "홍", name: "홍대 감성 포차", rating: "★★★★☆", note: "친구들이랑 시끌벅적하게 놀기 좋은 곳, 가성비 최고." },
];

const FEATURES = [
  {
    emoji: "🍽️",
    title: "오늘 뭐 먹지",
    description: "카테고리와 태그 조건만 고르면, 내가 담아둔 맛집 중에서 오늘의 후보를 골라드려요.",
  },
  {
    emoji: "✨",
    title: "AI 리뷰 요약",
    description: "여러 사람의 방문기록을 AI가 한 줄로 요약해서, 다 읽지 않아도 핵심만 빠르게 파악할 수 있어요.",
  },
  {
    emoji: "💬",
    title: "AI 감성분석",
    description: "방문기록의 한줄메모를 긍정/부정으로 분류해서, 전반적인 반응을 한눈에 보여드려요.",
  },
  {
    emoji: "📊",
    title: "대시보드",
    description: "내가 담은 맛집의 카테고리 비율과 가볼 곳/가본 곳 현황을 도넛차트와 워드클라우드로 확인해요.",
  },
];

export default function Home() {
  return (
    <>
      <Header current="home" />

      {/* Hero */}
      <section className="min-h-[85vh] tablet:min-h-[90vh] flex flex-col items-center justify-center text-center px-5 py-20 tablet:px-6 tablet:py-28">
        <span className="inline-block bg-primary/10 text-primary font-semibold text-xs tablet:text-sm px-4 py-1.5 rounded-full mb-7">
          오늘 뭐 먹지, 이제 고민 끝
        </span>
        <h1 className="text-4xl tablet:text-6xl desktop:text-7xl font-extrabold tracking-tight leading-[1.12] mb-6">
          가볼 곳을 담고,
          <br className="tablet:hidden" />
          <span className="text-primary">가본 곳</span>을 기록하다
        </h1>
        <p className="text-base tablet:text-lg text-ink/60 max-w-xl mb-11 leading-relaxed">
          지도 위에 나만의 맛집 리스트를 만들고, 방문 후엔 짧은 기록을 남겨보세요.
          오늘 뭘 먹을지 고민될 땐 matzip이 골라드릴게요.
        </p>

        <HeroSearchForm />

        <a
          href="#popular"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink/45 hover:text-primary transition-colors"
        >
          matzip 둘러보기
          <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-y-0.5">
            ↓
          </span>
        </a>
      </section>

      {/* 인기 맛집 카드 */}
      <section id="popular" className="px-5 py-20 tablet:px-6 tablet:py-28 desktop:py-32 max-w-6xl desktop:max-w-7xl mx-auto">
        <div className="text-center mb-12 tablet:mb-16">
          <h2 className="text-2xl tablet:text-3xl desktop:text-4xl font-extrabold tracking-tight mb-3">
            지금 인기 맛집 TOP 5
          </h2>
          <p className="text-ink/55 text-sm tablet:text-base">matzip 사용자들이 &quot;가볼 곳&quot;으로 가장 많이 담아둔 곳이에요</p>
        </div>

        <PopularPlaces />
      </section>

      {/* 최근 리뷰 */}
      <section className="px-5 py-20 tablet:px-6 tablet:py-28 desktop:py-32 bg-primary/5">
        <div className="max-w-6xl desktop:max-w-7xl mx-auto">
          <div className="text-center mb-12 tablet:mb-16">
            <h2 className="text-2xl tablet:text-3xl desktop:text-4xl font-extrabold tracking-tight mb-3">
              방금 올라온 방문기록
            </h2>
            <p className="text-ink/55 text-sm tablet:text-base">matzip 사용자들의 생생한 한 줄 기록이에요</p>
          </div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6 tablet:gap-7">
            {RECENT_REVIEWS.map((review) => (
              <div
                key={review.name}
                className="bg-white rounded-xl2 shadow-soft ring-1 ring-black/5 p-6 hover:shadow-soft-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                    {review.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{review.name}</p>
                    <p className="text-primary text-xs tracking-wide">{review.rating}</p>
                  </div>
                </div>
                <p className="text-sm text-ink/65 leading-relaxed">&quot;{review.note}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 서비스 특징 */}
      <section className="px-5 py-20 tablet:px-6 tablet:py-28 desktop:py-32 max-w-6xl desktop:max-w-7xl mx-auto">
        <div className="text-center mb-12 tablet:mb-16">
          <h2 className="text-2xl tablet:text-3xl desktop:text-4xl font-extrabold tracking-tight mb-3">
            matzip이 곧 보여줄 것들
          </h2>
          <p className="text-ink/55 text-sm tablet:text-base">더 똑똑하게 맛집을 관리할 수 있는 기능들을 준비하고 있어요</p>
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-6 tablet:gap-7">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl2 p-6 tablet:p-7 ring-1 ring-black/5 bg-white hover:shadow-soft-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  {feature.emoji}
                </div>
                <span className="text-xs font-semibold text-ink/40 bg-black/5 px-2.5 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
              <h3 className="font-bold text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-ink/55 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="px-5 py-12 tablet:px-6 tablet:py-14 border-t border-black/5">
        <div className="max-w-6xl desktop:max-w-7xl mx-auto flex flex-col tablet:flex-row items-center justify-between gap-6">
          <div className="text-center tablet:text-left">
            <p className="font-extrabold text-primary text-lg mb-1">matzip</p>
            <p className="text-sm text-ink/45">made by 장채원</p>
          </div>

          <div className="flex items-center gap-6 text-sm text-ink/60">
            <a
              href="https://github.com/jangcw1022/review"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <a href="mailto:jangcw1022@gmail.com" className="hover:text-primary transition-colors">
              이메일
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              맨 위로
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
