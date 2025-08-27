import React, { memo } from "react";

export const IconButton = memo(function IconButton({
  title,
  onClick,
  disabled,
  children,
  className = "",
  dark,
  type = "button",
}) {
  return (
    <button
      type={type}
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium shadow-sm transition hover:cursor-pointer ${
        dark
          ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          : "bg-white text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-200"
      } ${className}`}
    >
      {children}
    </button>
  );
});
