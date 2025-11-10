import React, { useState } from "react";
import useTouchDevice from "../lib/useTouchDevice";
import { getPeriodScheme, expandClass } from "../lib/badgeHelpers";

export default function ReferRankBadgeMulti({ rank, period = "all", alwaysOpen = false }) {
  if (!rank || rank > 10) return null; // show only top 10

  const [open, setOpen] = useState(false);
  const isTouch = useTouchDevice();
  const scheme = getPeriodScheme(period, rank);

  return (
    <span
      onTouchStart={(e) => {
        e.stopPropagation();
        if (isTouch) setOpen((prev) => !prev);
      }}
      className={`group inline-flex items-center gap-1 rounded-full border text-xs font-medium shadow-sm select-none transition-all duration-300 hover:px-2.5 px-1.5 py-0.5 ${scheme.bg}`}
      title={`Ranked #${rank} on ${period} leaderboard`}
    >
      {scheme.emoji}
      <span className="font-semibold">#{rank}</span>
      <span className={expandClass(alwaysOpen || open, 80)}>
        {period === "all"
          ? " All-Time"
          : period === "weekly"
          ? " This Week"
          : " This Month"}
      </span>
    </span>
  );
}
