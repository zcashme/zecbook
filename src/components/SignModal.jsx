// src/components/SignModal.jsx
import React, { useState } from "react";

/**
 * SignModal: Simple modal for signing messages with wallet
 * Mock implementation for now - can be connected to actual wallet later
 */
export default function SignModal({ isOpen, onClose, messageToSign, author }) {
  const [signature, setSignature] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [signedSuccessfully, setSignedSuccessfully] = useState(false);

  if (!isOpen) return null;

  const handleSign = async () => {
    setIsSigning(true);
    
    // Mock signing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock signature (in real implementation, this would call wallet API)
    const mockSignature = `sig_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    setSignature(mockSignature);
    setSignedSuccessfully(true);
    setIsSigning(false);
  };

  const handleCopySignature = async () => {
    try {
      await navigator.clipboard.writeText(signature);
      alert("Signature copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy signature:", err);
    }
  };

  const handleClose = () => {
    setSignature("");
    setSignedSuccessfully(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--profile-text-dark)]">Sign Message</h2>
          <button
            onClick={handleClose}
            className="text-[var(--profile-text)] hover:text-[var(--button-delete)]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {!signedSuccessfully ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--profile-label)] mb-2">
                Message to sign from {author}:
              </label>
              <div className="p-3 bg-[var(--post-detail-body-bg)] border border-[var(--post-detail-body-border)] rounded-lg">
                <p className="text-sm text-[var(--profile-text)] break-words">
                  {messageToSign}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-[var(--profile-text-muted)] mb-2">
                ⚠️ Demo mode: This will generate a mock signature. In production, this would connect to your Zcash wallet.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSign}
                disabled={isSigning}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isSigning
                    ? "bg-gray-300 text-gray-500 cursor-wait"
                    : "bg-[var(--link)] text-white hover:opacity-90"
                }`}
              >
                {isSigning ? "Signing..." : "🖊️ Sign with Wallet"}
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border border-[var(--control-border)] text-[var(--profile-text)] hover:bg-[var(--control-bg-hover)]"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✅</span>
                <p className="text-[var(--button-success)] font-semibold">
                  Message signed successfully!
                </p>
              </div>
              <label className="block text-sm font-medium text-[var(--profile-label)] mb-2">
                Signature:
              </label>
              <div className="p-3 bg-[var(--status-verified-bg)] border border-[var(--status-verified-border)] rounded-lg">
                <p className="text-xs font-mono text-[var(--profile-text-dark)] break-all">
                  {signature}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopySignature}
                className="flex-1 px-4 py-2 rounded-lg border border-[var(--button-success)] text-[var(--button-success)] hover:bg-[var(--status-verified-bg)]"
              >
                📋 Copy Signature
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg bg-[var(--link)] text-white hover:opacity-90"
              >
                Done
              </button>
            </div>

            <p className="mt-3 text-xs text-[var(--profile-text-muted)]">
              💡 Tip: You can now paste this signature to verify your identity.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

