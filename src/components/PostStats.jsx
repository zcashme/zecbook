// src/components/PostStats.jsx
import { useMemo } from "react";

/**
 * PostStats: Statistics panel for Timeline
 * Simplified version ready for backend integration
 * Matches zcash.me stats panel design
 */
export default function PostStats({ posts }) {
  // Compute stats from posts
  const stats = useMemo(() => {
    const total = posts.length;
    const featured = posts.filter((p) => p.featured).length;
    const verified = posts.filter((p) => (p.verifiedCount ?? 0) > 0).length;
    const ranked = posts.filter((p) => (p.rankScore ?? 0) > 0).length;
    const unverified = total - verified;

    // By author
    const authorCounts = posts.reduce((acc, p) => {
      acc[p.authorName] = (acc[p.authorName] || 0) + 1;
      return acc;
    }, {});
    const topAuthors = Object.entries(authorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // By month
    const byMonth = posts.reduce((acc, p) => {
      const month = p.createdAt?.slice(0, 7) || "Unknown";
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      featured,
      verified,
      ranked,
      unverified,
      topAuthors,
      byMonth: Object.entries(byMonth).sort(([a], [b]) => b.localeCompare(a)),
    };
  }, [posts]);

  return (
    <div className="mb-4 text-left font-mono text-xs text-[var(--profile-text)]">
      {/* Overview Section */}
      <div className="mb-3 border border-[var(--post-detail-border)] rounded-lg p-3 bg-[var(--post-detail-bg)]">
        <p className="font-semibold text-[var(--profile-text-dark)] mb-2">
          📊 Timeline Overview
        </p>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex justify-between">
            <span>Total Posts:</span>
            <span className="font-semibold">{stats.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Featured:</span>
            <span className="font-semibold text-yellow-700">{stats.featured}</span>
          </div>
          <div className="flex justify-between">
            <span>Verified:</span>
            <span className="font-semibold text-green-700">{stats.verified}</span>
          </div>
          <div className="flex justify-between">
            <span>Ranked:</span>
            <span className="font-semibold text-orange-700">{stats.ranked}</span>
          </div>
        </div>
      </div>

      {/* Top Authors Section */}
      <div className="mb-3 border border-[var(--post-detail-border)] rounded-lg p-3 bg-[var(--post-detail-bg)]">
        <p className="font-semibold text-[var(--profile-text-dark)] mb-2">
          🔥 Top Contributors
        </p>

        <div className="space-y-1">
          {stats.topAuthors.map(([author, count], idx) => (
            <div key={author} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-[var(--profile-text-muted)]">#{idx + 1}</span>
                <span className="font-medium">{author}</span>
              </div>
              <span className="text-[var(--profile-text)] font-semibold">
                {count} {count === 1 ? "post" : "posts"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Distribution */}
      <div className="border border-[var(--post-detail-border)] rounded-lg p-3 bg-[var(--post-detail-bg)]">
        <p className="font-semibold text-[var(--profile-text-dark)] mb-2">
          📅 Posts by Month
        </p>

        <div className="space-y-1">
          {stats.byMonth.slice(0, 5).map(([month, count]) => (
            <div key={month} className="flex items-center justify-between text-[11px]">
              <span>{month}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
                <span className="font-semibold w-6 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backend Integration Note */}
      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg text-[10px] text-blue-800">
        <p className="font-semibold mb-1">💡 Backend Integration Ready</p>
        <p>
          This component is calculating stats from mock data. Once connected to Supabase:
        </p>
        <ul className="mt-1 ml-4 list-disc space-y-0.5">
          <li>Replace <code className="bg-blue-100 px-1 rounded">posts</code> array with database query results</li>
          <li>Add time-range filters (daily, weekly, monthly)</li>
          <li>Enable chart visualizations like zcash.me</li>
        </ul>
      </div>
    </div>
  );
}

