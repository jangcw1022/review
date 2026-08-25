import Link from "next/link";

const NAV_LINKS = {
  home: { href: "/", label: "← 홈으로" },
  search: { href: "/search", label: "검색" },
  browse: { href: "/browse", label: "지역별 둘러보기" },
} as const;

type PageKey = keyof typeof NAV_LINKS;

const NAV_ORDER: Record<PageKey, PageKey[]> = {
  home: ["search", "browse"],
  search: ["browse", "home"],
  browse: ["search", "home"],
};

export default function Header({ current }: { current: PageKey }) {
  return (
    <header className="px-5 py-6 tablet:px-6 max-w-6xl desktop:max-w-7xl mx-auto flex items-center justify-between">
      <Link href="/" className="font-extrabold text-primary text-lg tablet:text-xl">
        matzip
      </Link>
      <nav className="flex items-center gap-4 tablet:gap-6 text-sm">
        {NAV_ORDER[current].map((key) => (
          <Link
            key={key}
            href={NAV_LINKS[key].href}
            className="text-ink/50 hover:text-primary transition-colors"
          >
            {NAV_LINKS[key].label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
