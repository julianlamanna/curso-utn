import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export const SortHeader = ({
  label,
  field,
  sortBy,
  order,
  setSortBy,
  setOrder,
  dark,
}) => {
  const isActive = sortBy === field;
  const Icon = !isActive ? ArrowUpDown : order === "asc" ? ArrowUp : ArrowDown;

  const onClick = () => {
    if (isActive) setOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-1 px-3 py-2 -mx-3 -my-2 rounded ${
        dark
          ? "hover:bg-zinc-800 text-zinc-300"
          : "hover:bg-zinc-100 text-zinc-600"
      }`}
    >
      <span className="font-medium">{label}</span>
      <Icon size={14} className={isActive ? "text-amber-600" : "opacity-60"} />
    </button>
  );
};
