import { useState, useEffect } from "react";
import { validateZcashAddress, getZcashAddressHint } from "../utils/zcashAddressUtils";

export default function ZcashAddressInput({ value, onChange, label, id = "zcash-address", brand = "zcash", hideLabel = false }) {
  const [help, setHelp] = useState(getZcashAddressHint(value, brand));
  const isValid = validateZcashAddress(value).valid;

  useEffect(() => {
    setHelp(getZcashAddressHint(value, brand));
  }, [value, brand]);

  const displayLabel = label ?? (brand === "zecbook" ? "Zecbook Address" : "Zcash Address");

  return (
    <div>
      {!hideLabel && (
        <label htmlFor={id} className="block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)] mb-1">
          {displayLabel}
        </label>
      )}
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="zs1... or u1..."
        className={`w-full rounded-2xl border px-3 py-2 text-sm font-mono outline-none bg-transparent border-[var(--input-border)] ${
          isValid ? "focus:border-[var(--input-focus-border)]" : "border-red-400 focus:border-red-500"
        }`}
        autoComplete="off"
      />
      <p className={`mt-1 text-xs ${isValid ? "text-green-600" : "text-[var(--text-muted)]"}`}>{help}</p>
    </div>
  );
}

