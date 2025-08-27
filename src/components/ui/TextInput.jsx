import React, { memo, forwardRef } from "react";

export const TextInput = memo(
  forwardRef(function TextInput(
    {
      value,
      onChange,
      type = "text",
      placeholder,
      className = "",
      dark,
      readOnly = false,
    },
    ref
  ) {
    return (
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
          dark
            ? "bg-zinc-900 border-zinc-700 text-zinc-100 focus:ring-indigo-500"
            : "bg-white border-zinc-300 text-zinc-900 focus:ring-indigo-300"
        } ${readOnly ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
      />
    );
  })
);
