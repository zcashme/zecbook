// src/components/CategoryChips.jsx
import React from "react";

export default function CategoryChips({ counts, filters, setFilter, resetFilters }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <button
        className={`px-2.5 py-1 rounded-full text-sm border ${filters.featured ? "bg-[var(--chip-featured-bg)] border-[var(--chip-featured-border)]" : "bg-[var(--chip-bg-default)] border-[var(--chip-border-default)]"}`}
        onClick={() => {
          setFilter("featured", !filters.featured);
          setFilter("all", false);
        }}
      >
        🌟 Featured ({counts.featured})
      </button>

      <button
        className={`px-2.5 py-1 rounded-full text-sm border ${filters.ranked ? "bg-[var(--chip-ranked-bg)] border-[var(--chip-ranked-border)]" : "bg-[var(--chip-bg-default)] border-[var(--chip-border-default)]"}`}
        onClick={() => {
          setFilter("ranked", !filters.ranked);
          setFilter("all", false);
        }}
      >
        🔝 Top Rank ({counts.ranked})
      </button>

      <button
        className={`px-2.5 py-1 rounded-full text-sm border ${filters.verified ? "bg-[var(--chip-verified-bg)] border-[var(--chip-verified-border)]" : "bg-[var(--chip-bg-default)] border-[var(--chip-border-default)]"}`}
        onClick={() => {
          setFilter("verified", !filters.verified);
          setFilter("all", false);
        }}
      >
        ✅ Verified ({counts.verified})
      </button>

      <button
        className={`px-2.5 py-1 rounded-full text-sm border ${filters.all ? "bg-[var(--chip-all-bg)] border-[var(--chip-all-border)]" : "bg-[var(--chip-bg-default)] border-[var(--chip-border-default)]"}`}
        onClick={resetFilters}
      >
        🔎 All ({counts.total})
      </button>

      {/* Placeholders for consistency with screenshots */}
      <button className="px-2.5 py-1 rounded-full text-sm border bg-[var(--chip-bg-default)] border-[var(--chip-border-default)]">📊 Show stats</button>
      <button className="px-2.5 py-1 rounded-full text-sm border bg-[var(--chip-bg-default)] border-[var(--chip-border-default)]">💬 Feedback</button>
    </div>
  );
}