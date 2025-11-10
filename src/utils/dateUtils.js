// src/utils/dateUtils.js
// Unified date utilities using UTC timezone

/**
 * Format ISO date string to human-readable format using UTC
 * @param {string} iso - ISO 8601 date string (e.g., "2025-11-03T08:30:00.000Z")
 * @returns {string} Formatted date (e.g., "Nov 3, 2025")
 */
export function formatDateUTC(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      timeZone: "UTC"  // Force UTC timezone
    });
  } catch {
    return iso;
  }
}

/**
 * Extract date portion from ISO string (YYYY-MM-DD) in UTC
 * @param {string} iso - ISO 8601 date string
 * @returns {string} Date string (e.g., "2025-11-03")
 */
export function getDateKeyUTC(iso) {
  try {
    const d = new Date(iso);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return iso?.slice(0, 10) || "Unknown";
  }
}

