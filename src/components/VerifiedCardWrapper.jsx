import { motion } from "framer-motion";

export default function VerifiedCardWrapper({
  verifiedCount = 0, // ✅ still accepts prop from ProfileCard (now mapped to verified_links_count)
  featured = false, // 🟡 new flag
  onClick,
  className = "",
  children,
}) {
  // Base style tiers
  const baseStyle =
    "rounded-2xl p-3 border transition-all cursor-pointer shadow-sm backdrop-blur-sm";

  let tierStyle;

  if (featured) {
    // 🌟 Featured glow takes priority
    tierStyle =
      "border-[var(--card-border-featured)] bg-[var(--card-bg-featured)] hover:bg-[var(--card-bg-featured-hover)] hover:shadow-[var(--card-shadow-featured-hover)]";
  } else if (verifiedCount >= 3) {
    tierStyle =
      "border-[var(--card-border-verified-3)] bg-gradient-to-r from-[var(--card-bg-verified-3-start)] via-[var(--card-bg-verified-3-via)] to-[var(--card-bg-verified-3-end)] relative overflow-hidden";
  } else if (verifiedCount === 2) {
    tierStyle =
      "border-[var(--card-border-verified-2)] bg-[var(--card-bg-verified-2)] hover:bg-[var(--card-bg-verified-2-hover)] hover:shadow-[var(--card-shadow-verified-2-hover)]";
  } else if (verifiedCount === 1) {
    tierStyle =
      "border-[var(--card-border-verified-1)] bg-[var(--card-bg-verified-1)] hover:bg-[var(--card-bg-verified-1-hover)] hover:shadow-[var(--card-shadow-verified-1-hover)]";
  } else {
    tierStyle =
      "border-[var(--card-border-unverified)] bg-[var(--card-bg-unverified)] hover:bg-[var(--card-bg-unverified-hover)] hover:shadow-[var(--card-shadow-unverified-hover)]";
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      onClick={onClick}
      className={`${baseStyle} ${tierStyle} ${className}`}
    >
      {/* Animated gradient shimmer for top-tier verified */}
      {verifiedCount >= 3 && !featured && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--card-shimmer-from)] via-[var(--card-shimmer-via)] to-[var(--card-shimmer-to)] blur-md"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
            zIndex: 0,
          }}
        />
      )}

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
