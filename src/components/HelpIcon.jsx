import { useState } from "react";

function HelpIcon({ text }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative inline-block text-[var(--profile-text)]"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}
    >
      <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold border border-[var(--help-icon-border)] rounded-full text-[var(--help-icon-text)] cursor-pointer hover:bg-[var(--help-icon-hover-bg)] select-none">
        ?
      </span>
      {show && (
        <div className="absolute right-0 mt-1 w-60 text-xs bg-white border border-[var(--help-tooltip-border)] rounded-lg shadow-lg p-2 text-[var(--help-tooltip-text)] z-50">
          {text}
        </div>
      )}
    </div>
  );
}

export default HelpIcon;
