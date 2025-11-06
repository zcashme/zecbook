import React, { useState } from "react";
import JoinModal from "./JoinModal";

export default function JoinButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold shadow-md transition-all duration-300 z-[50] animate-joinPulse hover:shadow-[0_0_12px_rgba(34,197,94,0.7)] hover:bg-green-500"
        title="Join"
      >
        <span className="text-base leading-none">+</span>
        <span>Join</span>
      </button>
      <JoinModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}