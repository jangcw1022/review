import type { ReactNode } from "react";

export type StatusType = "loading" | "empty" | "error" | "notice";

const ICONS: Record<StatusType, string> = {
  loading: "⏳",
  empty: "🔍",
  error: "⚠️",
  notice: "💬",
};

const TITLES: Record<StatusType, string> = {
  loading: "검색하고 있어요",
  empty: "검색 결과가 없어요",
  error: "문제가 발생했어요",
  notice: "안내",
};

export default function StatusPanel({
  message,
  type,
  icon,
  title,
  onRetry,
  action,
}: {
  message: string;
  type: StatusType;
  icon?: string;
  title?: string;
  onRetry?: () => void;
  action?: ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto flex flex-col items-center text-center bg-white rounded-xl2 ring-1 ring-black/5 px-6 py-16 tablet:py-20 mb-6">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl mb-5">
        {icon ?? ICONS[type]}
      </div>
      <h3 className="text-lg tablet:text-xl font-bold mb-2">{title ?? TITLES[type]}</h3>
      <p className="text-sm text-ink/55 max-w-sm leading-relaxed">{message}</p>
      {action ? (
        <div className="mt-6">{action}</div>
      ) : (
        (type === "empty" || type === "error") &&
        onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 active:scale-95 transition-all"
          >
            다시 시도
          </button>
        )
      )}
    </div>
  );
}
