// src/components/CategoryChips.jsx
import React from "react";

/**
 * FilterChip: Reusable filter button component
 * Matches zcash.me pill-style design
 */
function FilterChip({ icon, label, count, active, onClick, variant = "default" }) {
  const variantClasses = {
    featured: active
      ? "bg-yellow-400 text-yellow-900 border-yellow-500"
      : "bg-transparent text-yellow-700 border-yellow-400 hover:bg-yellow-50",
    ranked: active
      ? "bg-orange-500 text-white border-orange-500"
      : "bg-transparent text-orange-700 border-orange-400 hover:bg-orange-50",
    verified: active
      ? "bg-green-600 text-white border-green-600"
      : "bg-transparent text-green-700 border-green-400 hover:bg-green-50",
    all: active
      ? "bg-blue-600 text-white border-blue-600"
      : "bg-transparent text-blue-700 border-blue-400 hover:bg-blue-50",
    default: active
      ? "bg-gray-700 text-white border-gray-700"
      : "bg-transparent text-gray-700 border-gray-400 hover:bg-gray-50",
  };

  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all transform active:scale-95 ${variantClasses[variant]}`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
      {count !== undefined && ` (${count})`}
    </button>
  );
}

export default function CategoryChips({ counts, filters, setFilter, resetFilters, onShowStats, onFeedback, showStats }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <FilterChip
        icon="⭐"
        label="Featured"
        count={counts.featured}
        active={filters.featured}
        variant="featured"
        onClick={() => {
          setFilter("featured", !filters.featured);
          setFilter("all", false);
        }}
      />

      <FilterChip
        icon="🔥"
        label="Top Rank"
        count={counts.ranked}
        active={filters.ranked}
        variant="ranked"
        onClick={() => {
          setFilter("ranked", !filters.ranked);
          setFilter("all", false);
        }}
      />

      <FilterChip
        icon="✅"
        label="Verified"
        count={counts.verified}
        active={filters.verified}
        variant="verified"
        onClick={() => {
          setFilter("verified", !filters.verified);
          setFilter("all", false);
        }}
      />

      <FilterChip
        icon="🔵"
        label="All"
        count={counts.total}
        active={filters.all}
        variant="all"
        onClick={resetFilters}
      />

      {/* Stats & Feedback */}
      <FilterChip
        icon="📊"
        label="Show stats"
        active={showStats}
        variant="default"
        onClick={onShowStats}
      />
      
      <FilterChip
        icon="💬"
        label="Feedback"
        variant="default"
        onClick={onFeedback}
      />
    </div>
  );
}

// Export FilterChip for reuse in other components
export { FilterChip };