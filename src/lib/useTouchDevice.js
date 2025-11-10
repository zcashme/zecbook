// src/lib/useTouchDevice.js
import { useEffect, useState } from "react";

export default function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const hasTouch =
          "ontouchstart" in window ||
          (navigator && Number(navigator.maxTouchPoints) > 0);
        setIsTouch(Boolean(hasTouch));
      }
    } catch {
      setIsTouch(false);
    }
  }, []);

  return isTouch;
}