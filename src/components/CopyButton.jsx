import { useState } from "react";

export default function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center justify-center gap-1 border rounded-xl px-3 py-1.5 h-8 text-sm transition-all duration-200 sm:basis-[48%] ${
        copied
          ? "border-[var(--copy-button-copied-border)] text-[var(--copy-button-copied-text)] bg-[var(--copy-button-copied-bg)]"
          : "border-[var(--copy-button-border)] hover:border-[var(--copy-button-hover-border)] text-[var(--copy-button-text)]"
      }`}
    >
      <span className="text-base">{copied ? "✓" : "⧉"}</span>
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
