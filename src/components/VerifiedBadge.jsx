import React, { useState, useEffect } from "react";
import CheckIcon from "../assets/CheckIcon";
import useTouchDevice from "../lib/useTouchDevice";
import { badgeBaseClasses, clampChecks, expandClass } from "../lib/badgeHelpers";

export default function VerifiedBadge({
  verified = true,
  verifiedCount = 1,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  // Detect touch-capable devices (shared hook)
  const isTouchDevice = useTouchDevice();

  // Auto-close timeout handler
  useEffect(() => {
    let timer;
    if (isTouchDevice && open) {
      timer = setTimeout(() => setOpen(false), 2000); // Auto-collapse after 2s
    }
    return () => clearTimeout(timer);
  }, [open, isTouchDevice]);

  const baseClasses = badgeBaseClasses;

  const checksToShow = clampChecks(verifiedCount);

  const renderChecks = (color) => (
    <span className="relative flex -space-x-1">
      {[...Array(checksToShow)].map((_, i) => (
        <CheckIcon
          key={i}
          className={`h-3.5 w-3.5 ${color} drop-shadow-sm`}
          style={{ zIndex: 3 - i }}
        />
      ))}
    </span>
  );

if (verified) {
  // ✅ Verified or partially verified
  if (compact) {
    // Minimal display: just the green checks, no animation or label
    const checksToShow = clampChecks(verifiedCount);
    return (
      <span className="inline-flex items-center gap-0.5">
        {[...Array(checksToShow)].map((_, i) => (
          <CheckIcon
            key={i}
            className="h-3.5 w-3.5 text-[var(--verified-icon)] drop-shadow-sm"
            style={{ zIndex: 3 - i }}
          />
        ))}
      </span>
    );
  }

  // Default full mode
  return (
    <span
      onTouchStart={(e) => {
        e.stopPropagation();
        if (isTouchDevice) {
          setOpen(true); // Open on tap
        }
      }}
      className={`${baseClasses} group inline-flex items-center justify-center rounded-full border text-xs font-medium transition-all duration-300
      text-[var(--verified-badge-text)] bg-gradient-to-r from-[var(--verified-badge-bg-start)] to-[var(--verified-badge-bg-end)] border-[var(--verified-badge-border)] shadow-sm px-[0.2rem] hover:px-[0.5rem] py-[0.1rem]`}
      style={{ fontFamily: "inherit" }}
    >
      <div className="flex items-center justify-center gap-0 group-hover:gap-1 transition-[gap] duration-300">
        {renderChecks("text-[var(--verified-icon)]")}
        <span className={expandClass(open, 70)}>
          Verified
        </span>
      </div>
    </span>
  );
}

  // ⚪ Unverified state
  return (
    <span
      onTouchStart={(e) => {
        e.stopPropagation();
        if (isTouchDevice) {
          setOpen(true);
        }
      }}
      className={`${baseClasses} group inline-flex items-center justify-center rounded-full border text-xs font-medium transition-all duration-300
      text-[var(--unverified-badge-text)] bg-[var(--unverified-badge-bg)] border-[var(--unverified-badge-border)] shadow-sm px-[0.2rem] hover:px-[0.5rem] py-[0.1rem]`}
      style={{ fontFamily: "inherit" }}
    >
      <div className="flex items-center justify-center gap-0 group-hover:gap-1 transition-[gap] duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-[var(--unverified-icon)]"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5h2v6H9V5zm0 8h2v2H9v-2z" />
        </svg>
        <span className={expandClass(open, 80)}>
          Unverified
        </span>
      </div>
    </span>
  );
}
