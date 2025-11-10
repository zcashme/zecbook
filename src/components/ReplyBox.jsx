// src/components/ReplyBox.jsx
import React, { useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function toBase64Url(str = "") {
  try {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch {
    return "";
  }
}

function byteCount(text = "") {
  try {
    const raw = new TextEncoder().encode(text).length;
    const encoded = Math.ceil((raw / 3) * 4);
    const remaining = 512 - encoded;
    return { raw, encoded, remaining };
  } catch {
    return { raw: text.length, encoded: text.length, remaining: 512 - text.length };
  }
}

export default function ReplyBox({
  replyAddress = "",
  author = "",
  messageToSign = "",
  suggestions = [],
}) {
  const [mode, setMode] = useState("reply"); // reply | sign
  const [recipient, setRecipient] = useState(author || "");
  const [replyMemo, setReplyMemo] = useState("");
  const [signMemo, setSignMemo] = useState(messageToSign || "");
  const [replyAmount, setReplyAmount] = useState("");
  const [signAmount, setSignAmount] = useState("0.001");
  const [copied, setCopied] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFullUri, setShowFullUri] = useState(false);

  const memo = mode === "sign" ? signMemo : replyMemo;
  const amount = mode === "sign" ? signAmount : replyAmount;
  const memoBytes = useMemo(() => byteCount(memo), [memo]);
  const filteredSuggestions = useMemo(() => {
    if (!Array.isArray(suggestions) || !suggestions.length) return [];
    const query = recipient.trim().toLowerCase();
    if (!query) return suggestions.slice(0, 10);
    return suggestions
      .filter((entry) => (entry || "").toString().toLowerCase().includes(query))
      .slice(0, 10);
  }, [recipient, suggestions]);

  const uri = useMemo(() => {
    const params = new URLSearchParams();
    params.set("address", replyAddress || "u1example...mock");
    if (amount && Number(amount) > 0) {
      params.set("amount", Number(amount).toFixed(3));
    }
    const memoPayload = memo.trim()
      ? memo.trim()
      : mode === "sign"
      ? "verify:{}"
      : "note:{}";
    params.set("memo", toBase64Url(memoPayload));
    return `zcash:?${params.toString()}`;
  }, [replyAddress, amount, memo, mode]);

  const resetSignState = () => {
    setShowCodeInput(false);
    setCodeSubmitted(false);
    setCodeValue("");
  };

  const shouldShowQR =
    Boolean(uri) &&
    (mode === "sign" ||
      memo.trim().length > 0 ||
      (amount && Number(amount) > 0));

  const copyURI = async () => {
    try {
      await navigator.clipboard.writeText(uri);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="mt-4">
      {/* Mode pills */}
      <div className="relative flex items-center justify-center mb-4">
        <span
          className="absolute inset-x-0 h-px bg-black"
          style={{ top: "50%" }}
          aria-hidden="true"
        ></span>
        <div className="relative z-10 inline-flex border border-gray-300 rounded-full overflow-hidden text-sm shadow-sm bg-white">
          <button
            className={`px-3 py-1 font-medium transition-colors ${
              mode === "reply"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => {
              setMode("reply");
              setCopied(false);
              setShowFullUri(false);
            }}
          >
            ✎ Reply
          </button>
          <button
            className={`px-3 py-1 font-medium transition-colors ${
              mode === "sign"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => {
              setMode("sign");
              setCopied(false);
              resetSignState();
              setShowFullUri(false);
            }}
          >
            ⛊ Sign
          </button>
        </div>
      </div>

      {/* Input fields */}
      {mode === "sign" ? (
        <div className="mt-3 space-y-3">
          <div className="border rounded-lg px-3 py-2 text-sm bg-white/70 text-gray-700">
            <span className="font-semibold flex items-center justify-center gap-2 text-center w-full">
              Request One-Time Passcode
              <div className="relative group inline-block">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 text-[10px] font-bold hover:text-blue-600 hover:border-blue-600 cursor-pointer bg-transparent">
                  ?
                </span>
                <div className="absolute right-0 top-5 hidden group-hover:block w-56 text-xs bg-white border border-gray-300 rounded-lg shadow-lg p-2 text-gray-700 z-50">
                  You will receive four emojis in a message to your Zcash address.
                </div>
              </div>
            </span>
            <div className="truncate text-gray-500 text-xs mt-1 text-center">
              Use this mode to verify the address or approve changes.
            </div>
          </div>

          <div className="relative group">
            <pre
              className="border border-gray-300 rounded-xl px-4 py-3 text-sm w-full bg-white/70 text-gray-800 font-mono whitespace-pre-wrap break-words text-left shadow-sm"
              style={{ minHeight: "6rem" }}
            >
              {signMemo || "(waiting for message…)"}
            </pre>
            <p className="text-xs text-gray-400 mt-1 italic text-center">
              (Do not modify before sending! Include ≥0.001 ZEC)
            </p>
          </div>

          <input
            type="text"
            placeholder="0.0010 ZEC (required)"
            value={signAmount}
            onChange={(e) => setSignAmount(e.target.value.replace(/[^\d.]/g, ""))}
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-white/70"
          />

          {showCodeInput && (
            <div className="w-full animate-fadeIn">
              <label className="block text-sm text-gray-700 mb-1">One-Time Passcode</label>
              <input
                type="text"
                placeholder="Enter the code you received"
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                The code is unique to you and your update.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <div className="relative">
            <label className="block text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              To
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient name"
              className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-white/70"
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Sending to <span className="font-mono">{replyAddress}</span>
            </p>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 max-h-40 overflow-y-auto rounded-xl border border-black/20 bg-white shadow-lg">
                {filteredSuggestions.map((entry) => {
                  const label =
                    typeof entry === "string"
                      ? entry
                      : entry?.name || entry?.label || "";
                  const secondary =
                    typeof entry === "object" ? entry?.hint || entry?.address : "";
                  return (
                    <div
                      key={`${label}-${secondary}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setRecipient(label);
                        setShowSuggestions(false);
                      }}
                      className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                    >
                      <span>{label}</span>
                      {secondary && (
                        <span className="ml-auto text-xs text-gray-400 font-mono truncate">
                          {secondary}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Memo
            </label>
            <textarea
              rows={2}
              placeholder="Memo (optional)"
              value={replyMemo}
              onChange={(e) => setReplyMemo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-white/70 resize-none"
            />
            <p
              className={`text-xs text-right mt-1 ${
                memoBytes.remaining < 0 ? "text-red-600" : "text-[var(--text-muted)]"
              }`}
            >
              {memoBytes.remaining >= 0
                ? `+${memoBytes.remaining} bytes`
                : `-${Math.abs(memoBytes.remaining)} over 512`}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Amount
            </label>
            <input
              type="text"
              placeholder="0.0000 ZEC (optional)"
              value={replyAmount}
              onChange={(e) => setReplyAmount(e.target.value.replace(/[^\d.]/g, ""))}
              className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-white/70"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className={`px-3 py-2 rounded-lg border border-[var(--control-border)] bg-[var(--control-bg)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)] ${
            copied ? "border-green-500 text-green-600 bg-green-50" : ""
          }`}
          onClick={copyURI}
        >
          {copied ? "✓ Copied" : "📋 Copy URI"}
        </button>

        <a
          className="px-3 py-2 rounded-lg border border-[var(--control-border)] bg-[var(--control-bg)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)]"
          href={uri}
          target="_blank"
          rel="noreferrer"
        >
          🔗 Open in Wallet
        </a>

        {mode === "sign" && (
          <button
            className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
              codeSubmitted
                ? "border-green-500 text-green-600 bg-green-50"
                : showCodeInput
                ? codeValue.trim()
                  ? "border-blue-500 text-blue-700 bg-blue-50"
                  : "border-gray-300 text-gray-400 cursor-not-allowed opacity-60"
                : "border-[var(--control-border)] bg-[var(--control-bg)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)]"
            }`}
            onClick={() => {
              if (!showCodeInput) {
                setShowCodeInput(true);
              } else if (codeValue.trim()) {
                setCodeSubmitted(true);
                setTimeout(() => {
                  resetSignState();
                }, 1500);
              }
            }}
            disabled={showCodeInput && !codeValue.trim()}
          >
            {codeSubmitted
              ? "Submitted!"
              : showCodeInput
              ? "Verify Code ➤"
              : "I Sent It!"}
          </button>
        )}
      </div>

      {shouldShowQR && (
        <div className="flex flex-col items-center gap-3 mt-6">
          <QRCodeCanvas
            value={uri}
            size={220}
            includeMargin={true}
            bgColor="transparent"
            fgColor="#000000"
          />
          {showFullUri ? (
            <>
              <a
                href={uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all text-sm"
              >
                {uri}
              </a>
              <button
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setShowFullUri(false)}
              >
                Hide URI
              </button>
            </>
          ) : (
            <button
              className="text-xs text-blue-600 hover:underline"
              onClick={() => setShowFullUri(true)}
            >
              Show URI
            </button>
          )}
        </div>
      )}
    </div>
  );
}