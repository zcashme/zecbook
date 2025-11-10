import React from "react";

export default function TopBar({
  title = "Zecbook.com/",
  secondaryText = "",
  onTitleClick,
  showSearch = true,
  searchValue = "",
  searchPlaceholder = "",
  onSearchChange,
  onSearchClear,
  onSearchKeyDown,
  rightSlot = null,
  className = "",
}) {
  const handleTitleClick =
    onTitleClick ||
    (() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

  const handleSearchChange = (event) => {
    onSearchChange?.(event);
  };

  const handleClear = () => {
    onSearchClear?.();
  };

  return (
    <div
      className={`sticky top-0 z-[80] bg-[#f6efe6cc] backdrop-blur-sm border-b border-[#d9d0c5] ${className}`}
    >
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={handleTitleClick}
            className="font-bold text-lg text-blue-700 hover:text-blue-800 transition-colors whitespace-nowrap"
          >
            {title}
          </button>
          {secondaryText && (
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {secondaryText}
            </span>
          )}
          {showSearch && (
            <div className="relative flex-1 max-w-sm min-w-[160px]">
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={onSearchKeyDown}
                placeholder={searchPlaceholder}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-[#d9d0c5] bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {searchValue && onSearchClear && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-sm"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
        {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
      </div>
    </div>
  );
}

