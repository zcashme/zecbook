// src/pages/Feedback.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VerifiedCardWrapper from "../components/VerifiedCardWrapper";
import ReplyBox from "../components/ReplyBox";
import JoinButton from "../components/JoinButton";
import TopBar from "../components/TopBar";

// Default feedback address
const FEEDBACK_ADDRESS = "u1un9d4pscqnyfwd4vpn2ytc6562cvg3dczufp5lpfz74zd3ft70j6u5ggc60qsh8d6jq6ztjanafl5w6p6yltn2v45wpyg6v7uvcn7fcg";

/**
 * Feedback Page
 * Send feedback using the same interface as PostDetail
 */
export default function FeedbackPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <TopBar
        title="Zecbook.com/"
        secondaryText="share your feedback"
        onTitleClick={() => navigate("/")}
        showSearch
        searchValue={searchQuery}
        searchPlaceholder="search posts"
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
      <VerifiedCardWrapper verifiedCount={0} featured={false} className="w-full">
        <div className="flex items-start gap-3">
          <div className="h-16 w-16 rounded-full overflow-hidden border border-[var(--post-detail-border)] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl">
            💬
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Send Feedback</h2>
            </div>

            <p className="text-sm text-[var(--post-detail-meta)] mt-1">
              Share your thoughts, report issues, or suggest new features
            </p>

            {/* Feedback recipient address row */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={FEEDBACK_ADDRESS}
                className="flex-1 px-3 py-2 rounded-lg border border-[var(--post-detail-border)] bg-[var(--post-detail-body-bg)] text-xs font-mono"
              />
            </div>

            {/* Feedback instructions */}
            <div className="mt-3 rounded-lg bg-[var(--post-detail-body-bg)] border border-[var(--post-detail-body-border)] p-3">
              <h3 className="font-semibold mb-2">💡 How to send feedback:</h3>
              <ul className="text-sm text-[var(--post-detail-body-text)] space-y-1 list-disc list-inside">
                <li>Use the Reply box below to compose your message</li>
                <li>Include details about bugs, suggestions, or questions</li>
                <li>Optional: Add a small amount of ZEC to prioritize your feedback</li>
                <li>Click "Copy URI" or "Open in Wallet" to send</li>
              </ul>
            </div>
          </div>
        </div>
      </VerifiedCardWrapper>

      {/* Reply box with same interface as PostDetail */}
      <ReplyBox 
        replyAddress={FEEDBACK_ADDRESS}
        messageToSign="pro:{}"
        author="Zecbook Team"
        suggestions={[
          {
            name: "Zecbook Team",
            address: FEEDBACK_ADDRESS,
          },
        ]}
      />
    </div>
    </>
  );
}

