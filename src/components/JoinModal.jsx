import React, { useEffect, useMemo, useState } from "react";
import ZcashAddressInput from "./ZcashAddressInput";
import ProfileEditor from "./ProfileEditor";
import { useFeedback } from "../store";

// Constants aligned with ZecbookFeedback.jsx
const SIGNIN_ADDR =
  "u1qzt502u9fwh67s7an0e202c35mm0h534jaa648t4p2r6mhf30guxjjqwlkmvthahnz5myz2ev7neff5pmveh54xszv9njcmu5g2eent82ucpd3lwyzkmyrn6rytwsqefk475hl5tl4tu8yehc0z8w9fcf4zg6r03sq7lldx0uxph7c0lclnlc4qjwhu2v52dkvuntxr8tmpug3jntvm";
const MIN_SIGNIN_AMOUNT = 0.001;

// Lightweight copy of buildZecbookEditMemo used for compact memo payloads
function buildCompactEditMemo(profile = {}, zid = "?", addr = "") {
  const fieldMap = { name: "n", bio: "b", profile_image_url: "i", links: "l" };
  const clean = Object.fromEntries(
    Object.entries(profile).filter(([_, v]) => {
      if (Array.isArray(v)) return v.some((x) => x && x.trim() !== "");
      return v !== "" && v !== null && v !== undefined;
    })
  );
  const includeAddress = "address" in clean && clean.address.trim() !== "";
  const compactPairs = Object.entries(clean)
    .filter(([k]) => k !== "address")
    .map(([key, value]) => {
      const shortKey = fieldMap[key] || key;
      if (Array.isArray(value)) {
        return `${shortKey}:[${value
          .filter((x) => x && x.trim() !== "")
          .map((x) => `"${x}"`)
          .join(",")}]`;
      }
      return `${shortKey}:"${value}"`;
    });
  const payload =
    compactPairs.length > 0 || includeAddress
      ? `{z:${zid}${includeAddress ? `,a:"${clean.address.trim()}"` : ""}${compactPairs.length ? `,${compactPairs.join(",")}` : ""}}`
      : `{z:${zid}}`;
  return payload;
}

// Platforms & preview base
const LINK_OPTIONS = [
  "X (Twitter)",
  "GitHub",
  "Instagram",
  "Reddit",
  "LinkedIn",
  "Discord",
  "TikTok",
  "Bluesky",
  "Mastodon",
  "Snapchat",
  "Other (custom URL)",
];
const PLATFORM_BASE = {
  "X (Twitter)": "https://x.com/",
  "GitHub": "https://github.com/",
  "Instagram": "https://instagram.com/",
  "Reddit": "https://reddit.com/u/",
  "LinkedIn": "https://linkedin.com/in/",
  "Discord": "https://discord.com/users/",
  "TikTok": "https://tiktok.com/@",
  "Bluesky": "https://bsky.app/profile/",
  "Mastodon": "https://mastodon.social/@",
  "Snapchat": "https://snapchat.com/add/",
};

function previewFor(platform, value) {
  if (platform === "Other (custom URL)") return value || "https://example.com";
  const base = PLATFORM_BASE[platform] || "https://example.com/";
  const v = value || (platform === "TikTok" ? "your_username" : "your_username");
  return `${base}${v}`;
}

// Backend placeholders (reserved interfaces)
async function apiCreateJoinSession(address) {
  // TODO: integrate Supabase or backend service
  return { sessionId: crypto.randomUUID(), address };
}
async function apiSubmitProfile(sessionId, profile) {
  // TODO: persist draft profile to backend
  return { ok: true, sessionId };
}
async function apiVerifyOtp(sessionId, code) {
  // TODO: verify the OTP sent via memo or backend
  return { ok: true, sessionId, verified: true };
}

export default function JoinModal({ isOpen, onClose }) {
  const { pendingEdits } = useFeedback();
  const [step, setStep] = useState(1); // 1 Name, 2 Address, 3 Referred, 4 Links, 5 Review
  const [address, setAddress] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [nameText, setNameText] = useState("");
  const [referrer, setReferrer] = useState("");
  const [links, setLinks] = useState([{ platform: "X (Twitter)", value: "" }]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setAddress("");
      setSessionId(null);
      setCopied(false);
      setNameText("");
      setReferrer("");
      setLinks([{ platform: "X (Twitter)", value: "" }]);
    }
  }, [isOpen]);

  const isValidAddress = useMemo(() => {
    return typeof address === "string" && /^(u1|zs1|t1|tm)/.test(address);
  }, [address]);
  const isValidName = useMemo(() => nameText.trim().length > 0, [nameText]);

  const profileForMemo = useMemo(() => {
    const linkArray = links
      .map((l) => {
        const v = (l.value || "").trim();
        if (!v) return null;
        if (l.platform === "Other (custom URL)") return `url:${v}`;
        return `${l.platform}:${v}`;
      })
      .filter(Boolean);
    return { name: nameText.trim(), address, links: linkArray };
  }, [nameText, address, links]);

  const memoText = useMemo(() => {
    return buildCompactEditMemo(profileForMemo, "?", address);
  }, [profileForMemo, address]);

  const uri = useMemo(() => {
    const params = new URLSearchParams();
    params.set("address", SIGNIN_ADDR);
    params.set("amount", MIN_SIGNIN_AMOUNT.toFixed(3));
    // base64url encode
    const base64url = (str) => {
      const b64 = typeof window === "undefined"
        ? Buffer.from(str, "utf-8").toString("base64")
        : btoa(unescape(encodeURIComponent(str)));
      return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    };
    params.set("memo", base64url(memoText));
    return `zecbook:?${params.toString()}`;
  }, [memoText]);

  const handleNextFromAddress = async () => {
    const res = await apiCreateJoinSession(address);
    setSessionId(res.sessionId);
    setStep(3);
  };

  const handleFinalizeAddName = async () => {
    await apiSubmitProfile(sessionId || "local", { ...profileForMemo, referrer });
    onClose();
  };

  const handleCopyUri = async () => {
    try {
      await navigator.clipboard.writeText(uri);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const handleOpenWallet = () => {
    window.open(uri, "_blank");
  };

  // Links helpers
  const addLinkRow = () => setLinks((rows) => [...rows, { platform: "X (Twitter)", value: "" }]);
  const removeLinkRow = (idx) => setLinks((rows) => rows.filter((_, i) => i !== idx));
  const changePlatform = (idx, platform) => setLinks((rows) => rows.map((r, i) => (i === idx ? { ...r, platform } : r)));
  const changeValue = (idx, value) => setLinks((rows) => rows.map((r, i) => (i === idx ? { ...r, value } : r)));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-[92%] max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold">+
            </span>
            <h3 className="font-semibold">Zecbook is better with friends</h3>
          </div>
          <button className="text-[var(--text-muted)] hover:text-[var(--link)]" onClick={onClose} aria-label="Close">Close</button>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          {step === 1 && (
            <div className="space-y-3">
              <label htmlFor="join-name" className="block text-sm font-semibold text-[var(--control-text)]">PROFILE NAME</label>
              <input
                id="join-name"
                type="text"
                value={nameText}
                onChange={(e) => setNameText(e.target.value.replace(/\s+/g, "_"))}
                placeholder="Enter name"
                className="w-full px-3 py-2 rounded-xl border border-[var(--input-border)] bg-[var(--control-bg)] text-[var(--control-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
              />
              <p className="text-xs text-[var(--text-muted)]">Use letters, numbers, underscores, or emojis. Spaces become underscores.</p>
              <div className="flex items-center justify-end gap-2">
                <button className="px-3 py-2 text-sm rounded-xl border border-[var(--control-border)] bg-[var(--control-bg)] text-[var(--control-text)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)] hover:text-[var(--control-text-hover)]" onClick={onClose}>Cancel</button>
                <button
                  className={`px-3 py-2 text-sm rounded-xl border border-[var(--control-border)] bg-[var(--control-bg)] ${isValidName ? "text-[var(--link)] hover:text-[var(--link-hover)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)]" : "text-[var(--text-muted)] cursor-not-allowed"}`}
                  onClick={() => setStep(2)}
                  disabled={!isValidName}
                >Next →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[var(--control-text)]">ZECBOOK ADDRESS</label>
              <ZcashAddressInput value={address} onChange={setAddress} id="join-addr" brand="zecbook" hideLabel />
              <div className="flex items-center justify-between">
                <button className="px-3 py-2 text-sm rounded-xl border border-[var(--control-border)] bg-[var(--control-bg)] text-[var(--control-text)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)] hover:text-[var(--control-text-hover)]" onClick={() => setStep(1)}>Back</button>
                <button
                  className={`px-3 py-2 text-sm rounded-xl border border-[var(--control-border)] bg-[var(--control-bg)] ${isValidAddress ? "text-[var(--link)] hover:text-[var(--link-hover)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)]" : "text-[var(--text-muted)] cursor-not-allowed"}`}
                  onClick={handleNextFromAddress}
                  disabled={!isValidAddress}
                >Next →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <label htmlFor="join-ref" className="block text-sm font-semibold text-[var(--control-text)]">REFERRED BY ZECBOOK.COM/</label>
              <input
                id="join-ref"
                type="text"
                value={referrer}
                onChange={(e) => setReferrer(e.target.value)}
                placeholder="Type to search (optional)..."
                className="w-full px-3 py-2 rounded-xl border border-[var(--input-border)] bg-[var(--control-bg)] text-[var(--control-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
              />
              <p className="text-xs text-[var(--text-muted)]">Optional. Helps us rank referrals.</p>
              <div className="flex items-center justify-between">
                <button className="px-3 py-2 text-sm rounded-xl border border-[var(--control-border)] bg-[var(--control-bg)] text-[var(--control-text)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)] hover:text-[var(--control-text-hover)]" onClick={() => setStep(2)}>Back</button>
                <button className="px-3 py-2 text-sm rounded-xl border border-[var(--control-border)] bg-[var(--control-bg)] text-[var(--link)] hover:text-[var(--link-hover)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)]" onClick={() => setStep(4)}>Next →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[var(--control-text)]">PROFILE LINKS</label>

              {links.map((row, idx) => (
                <div key={idx} className="rounded-xl border border-[var(--control-border)] bg-[var(--control-bg)] p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={row.platform}
                      onChange={(e) => changePlatform(idx, e.target.value)}
                      className="px-3 py-2 rounded-xl border border-[var(--input-border)] bg-[var(--control-bg)] text-[var(--control-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                    >
                      {LINK_OPTIONS.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => changeValue(idx, e.target.value)}
                      placeholder={row.platform === "Other (custom URL)" ? "https://example.com" : "your_username"}
                      className="flex-1 px-3 py-2 rounded-xl border border-[var(--input-border)] bg-[var(--control-bg)] text-[var(--control-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                    />
                    {links.length > 1 && (
                      <button
                        className="text-sm text-red-600 hover:text-red-700"
                        onClick={() => removeLinkRow(idx)}
                        aria-label="Remove link"
                      >Remove link</button>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">Preview: {previewFor(row.platform, row.value)}</p>
                </div>
              ))}

              <button
                className="inline-flex items-center gap-2 text-[var(--link)] hover:text-[var(--link-hover)]"
                onClick={addLinkRow}
              >
                <span className="text-lg">+</span> Add another link
              </button>
              <p className="text-xs text-[var(--text-muted)]">Tip: You can add, remove and verify links from Edit Profile.</p>

              <div className="flex items-center justify-between">
                <button className="px-3 py-2 text-sm rounded-xl border border-[var(--control-border)] bg-[var(--control-bg)] text-[var(--control-text)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)] hover:text-[var(--control-text-hover)]" onClick={() => setStep(3)}>Back</button>
                <button className="px-3 py-2 text-sm rounded-xl border border-[var(--control-border)] bg-[var(--control-bg)] text-[var(--link)] hover:text-[var(--link-hover)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)]" onClick={() => setStep(5)}>Next →</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <p className="text-sm text-[var(--control-text)]">Review your details before adding your name.</p>
              <div className="rounded-xl border border-[var(--control-border)] px-3 py-2 bg-[var(--control-bg)] text-[var(--control-text)] space-y-1">
                <p><span className="font-semibold">Name:</span> {nameText || "(not set)"}</p>
                <p><span className="font-semibold">Zecbook Address:</span> <span className="font-mono break-all">{address || "(not set)"}</span></p>
                <p><span className="font-semibold">Referred by:</span> {referrer || "(optional)"}</p>
                <div>
                  <span className="font-semibold">Links:</span>
                  {links.length === 0 && <span> (none)</span>}
                  {links.map((l, i) => (
                    <p key={i}>• {l.platform}: {l.platform === "Other (custom URL)" ? (l.value || "(url)") : (l.value ? `@${l.value}` : "(username)")}</p>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button className="px-3 py-2 text-sm rounded-xl border border-[var(--control-border)] bg-[var(--control-bg)] text-[var(--control-text)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)] hover:text-[var(--control-text-hover)]" onClick={() => setStep(4)}>Back</button>
                <button className="px-3 py-2 text-sm rounded-xl border border-[var(--control-border)] bg-[var(--control-bg)] text-[var(--link)] hover:text-[var(--link-hover)] hover:border-[var(--control-border-hover)] hover:bg-[var(--control-bg-hover)]" onClick={handleFinalizeAddName}>Add Name</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}