// src/components/PostCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import VerifiedBadge from "./VerifiedBadge";
import VerifiedCardWrapper from "./VerifiedCardWrapper";
import { formatDateUTC } from "../utils/dateUtils";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const avatarSrc = post.authorAvatar || "/blue_avatar_shield_transparent.png";

  return (
    <VerifiedCardWrapper
      verifiedCount={post.verifiedCount || 0}
      featured={Boolean(post.featured)}
      onClick={() => navigate(`/post/${post.id}`)}
      className="w-full"
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="h-12 w-12 rounded-full overflow-hidden border border-[var(--card-avatar-border)]">
          <img
            src={avatarSrc}
            alt={post.authorName}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title + badge */}
          <div className="flex items-center gap-2">
            <button className="text-[var(--card-title)] font-semibold truncate hover:underline" onClick={(e)=>{e.preventDefault();navigate(`/post/${post.id}`);}}>
              {post.title || post.body?.slice(0, 40) || "Untitled post"}
            </button>
            {post.verifiedCount > 0 && (
              <VerifiedBadge verifiedCount={post.verifiedCount} />
            )}
          </div>

          {/* Date (from transaction) */}
          <p className="text-sm text-[var(--card-meta)] font-medium">
            📅 {post.date || formatDateUTC(post.createdAt)}
          </p>

          {/* Memo preview */}
          {post.memo && (
            <p className="text-xs text-[var(--card-meta)] truncate mt-1">
              💬 {post.memo.slice(0, 80)}...
            </p>
          )}
        </div>
      </div>
    </VerifiedCardWrapper>
  );
}