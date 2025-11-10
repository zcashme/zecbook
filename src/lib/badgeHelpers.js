// src/lib/badgeHelpers.js
// 共享徽章样式与工具方法，供 VerifiedBadge / ReferRankBadgeMulti 复用

export const badgeBaseClasses =
  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide select-none whitespace-nowrap align-middle";

export function clampChecks(count = 0) {
  const n = Number(count) || 0;
  return Math.min(Math.max(n, 1), 3);
}

export function expandClass(open, widthPx = 80) {
  const w = Math.max(10, widthPx);
  return [
    "overflow-hidden inline-block transition-all duration-300 ease-in-out whitespace-nowrap",
    open
      ? `max-w-[${w}px] opacity-100`
      : `max-w-0 opacity-0 group-hover:max-w-[${w}px] group-hover:opacity-100`,
  ].join(" ");
}

export function getPeriodScheme(period = "all", rank = 0) {
  const schemes = {
    all: {
      emoji: "🏆",
      bg: "bg-amber-100/80 border-amber-300 text-amber-800",
      label: `#${rank} All-Time`,
    },
    weekly: {
      emoji: "📅",
      bg: "bg-sky-100/80 border-sky-300 text-sky-800",
      label: `#${rank} This Week`,
    },
    monthly: {
      emoji: "🗓️",
      bg: "bg-violet-100/80 border-violet-300 text-violet-800",
      label: `#${rank} This Month`,
    },
    daily: {
      emoji: "⏱️",
      bg: "bg-orange-100/80 border-orange-300 text-orange-800",
      label: `#${rank} Today`,
    },
  };
  return schemes[period] || schemes.all;
}