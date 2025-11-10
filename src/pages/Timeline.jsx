// src/pages/Timeline.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import PostCard from "../components/PostCard";
import CategoryChips from "../components/CategoryChips";
import PostStats from "../components/PostStats";
import JoinButton from "../components/JoinButton";
import TopBar from "../components/TopBar";
import { formatDateUTC } from "../utils/dateUtils";

export default function TimelinePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { posts, groupedByDate, dates, counts, search, setSearch, filters, setFilter, resetFilters, loading } = usePosts();
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    if (q !== search) {
      setSearch(q);
      resetFilters();
    }
  }, [location.search, resetFilters, search, setSearch]);

  return (
    <>
      <TopBar
        title="Zecbook.com/"
        secondaryText={`search ${counts.total} posts`}
        onTitleClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        showSearch
        searchValue={search}
        searchPlaceholder={`search ${counts.total} posts`}
        onSearchChange={(e) => setSearch(e.target.value)}
        onSearchClear={() => setSearch("")}
        rightSlot={<JoinButton />}
      />

    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Filter chips */}
      <CategoryChips
        counts={counts}
        filters={filters}
        setFilter={setFilter}
        resetFilters={resetFilters}
        onShowStats={() => setShowStats(!showStats)}
        onFeedback={() => navigate("/feedback")}
        showStats={showStats}
      />

      {/* Stats panel (collapsible) */}
      {showStats && <PostStats posts={posts} />}

      {loading && <p className="text-[var(--timeline-loading)]">Loading...</p>}

      {/* Results count */}
      {!loading && posts.length > 0 && (
        <p className="text-xs text-[var(--profile-text-muted)] mb-3">
          Showing {posts.length} of {counts.total} posts · Sorted by date (newest first)
        </p>
      )}

      {/* Timeline - Grouped by date */}
      <div className="space-y-6">
        {dates.map((date) => (
          <div key={date}>
            {/* Date header */}
            <div className="sticky top-0 z-10 bg-[var(--color-background)] py-2 mb-3">
              <h2 className="text-lg font-semibold text-[var(--timeline-section-header)]">
                {formatDateUTC(date)}
              </h2>
            </div>
            
            {/* Posts for this date */}
            <div className="space-y-3">
              {(groupedByDate[date] || []).map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        ))}

        {posts.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-[var(--timeline-no-results)] mb-2">No posts match your filters.</p>
            <button
              onClick={resetFilters}
              className="text-blue-700 hover:underline text-sm"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}