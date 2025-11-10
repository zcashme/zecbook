// src/pages/PostDetail.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import VerifiedBadge from "../components/VerifiedBadge";
import VerifiedCardWrapper from "../components/VerifiedCardWrapper";
import ReplyBox from "../components/ReplyBox";
import CopyButton from "../components/CopyButton";
import shareIcon from "../assets/share.svg";
import JoinButton from "../components/JoinButton";
import TopBar from "../components/TopBar";
import { formatDateUTC } from "../utils/dateUtils";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allPosts } = usePosts();  // Use unfiltered posts
  const [searchQuery, setSearchQuery] = useState("");

  const post = allPosts.find((p) => p.id === id) || allPosts[0];

  if (!post) {
    return (
      <>
        <TopBar
          title="Zecbook.com/"
          secondaryText={`search ${allPosts.length} posts`}
          onTitleClick={() => navigate("/")}
          showSearch={false}
          rightSlot={<JoinButton />}
        />
        <div className="max-w-2xl mx-auto px-4 py-6">
          <p className="text-gray-600">Post not found.</p>
          <button className="mt-3 px-3 py-2 rounded-lg border" onClick={() => navigate("/")}>Back to timeline</button>
        </div>
      </>
    );
  }

  const avatarSrc = post.authorAvatar || "/blue_avatar_shield_transparent.png";

  return (
    <>
      <TopBar
        title="Zecbook.com/"
        secondaryText={`search ${allPosts.length} posts`}
        onTitleClick={() => navigate("/")}
        showSearch
        searchValue={searchQuery}
        searchPlaceholder={`search ${allPosts.length} posts`}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onSearchClear={() => {
          setSearchQuery("");
          navigate("/");
        }}
        onSearchKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const value = searchQuery.trim();
            navigate(value ? `/?q=${encodeURIComponent(value)}` : "/");
          }
        }}
        rightSlot={<JoinButton />}
      />
    <div className="max-w-2xl mx-auto px-4 py-6">
      <VerifiedCardWrapper verifiedCount={post.verifiedCount} featured={post.featured} className="w-full">
        <div className="flex items-start gap-3">
          <div className="h-16 w-16 rounded-full overflow-hidden border border-[var(--post-detail-border)]">
            <img
              src={avatarSrc}
              alt={post.authorName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{post.authorName}</h2>
                {post.verifiedCount > 0 && <VerifiedBadge verifiedCount={post.verifiedCount} />}
              </div>
              <button className="p-2 rounded-lg border border-[var(--post-detail-border)] hover:bg-[var(--post-detail-button-hover)]" title="Share">
                <img src={shareIcon} className="h-4 w-4" alt="share" />
              </button>
            </div>

            <p className="text-sm text-[var(--post-detail-meta)]">Joined {formatDateUTC(post.authorJoined)} · Last verified {post.verifiedCount > 0 ? "N/A" : "unknown"} · Good thru Dec 2025</p>

            {/* Transaction Date */}
            <div className="mt-3 rounded-lg bg-[var(--post-detail-body-bg)] border border-[var(--post-detail-body-border)] p-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-[var(--post-detail-body-text)]">📅 Date:</span>
                <span className="text-[var(--post-detail-body-text)]">{post.date || formatDateUTC(post.createdAt)}</span>
              </div>
            </div>

            {/* Reply address row */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={post.replyAddress || "u1example...mock"}
                className="flex-1 px-3 py-2 rounded-lg border border-[var(--post-detail-border)] bg-[var(--post-detail-body-bg)]"
              />
              <CopyButton text={post.replyAddress || "u1example...mock"} label="Copy" />
            </div>

            {/* Memo body */}
            <div className="mt-3 rounded-lg bg-[var(--post-detail-body-bg)] border border-[var(--post-detail-body-border)] p-3">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span>💬 Memo</span>
                {post.title && <span className="text-sm font-normal text-[var(--post-detail-meta)]">({post.title})</span>}
              </h3>
              <p className="leading-relaxed text-[var(--post-detail-body-text)] whitespace-pre-wrap">{post.memo || post.body}</p>
            </div>

            {/* Verified note */}
            {post.verifiedCount > 0 && (
              <div className="mt-3 text-[var(--post-detail-status-verified-text)] bg-[var(--post-detail-status-verified-bg)] border border-[var(--post-detail-status-verified-border)] rounded-lg px-3 py-2 text-sm">
                ✅ {post.authorName} appears to be verified. <a href="#" className="underline text-[var(--post-detail-link)]">More</a>
              </div>
            )}
          </div>
        </div>
      </VerifiedCardWrapper>

      {/* Reply box with Sign functionality */}
      <ReplyBox 
        replyAddress={post.replyAddress} 
        messageToSign={post.body}
        author={post.authorName}
        suggestions={[post.authorName]}
      />
    </div>
    </>
  );
}