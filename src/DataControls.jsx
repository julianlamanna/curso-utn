// src/DataControls.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DataControls({
  page,
  setPage,
  limit,
  setLimit,
  total,
  darkMode,
}) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 1)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const wrap = darkMode
    ? "mt-4 rounded-sm border border-zinc-800 bg-zinc-900 p-4"
    : "mt-4 rounded-sm border border-zinc-200 bg-white p-4";

  const labelClass = darkMode
    ? "text-amber-600 font-semibold"
    : "text-yellow-600 font-semibold";
  const selectClass = darkMode
    ? "rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-zinc-100"
    : "rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-800";

  const pagerBtn = (enabled) =>
    `inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
      darkMode
        ? enabled
          ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
          : "bg-zinc-900 text-zinc-500"
        : enabled
        ? "bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-50"
        : "bg-white text-zinc-400 border border-zinc-200"
    }`;

  return (
    <div className={wrap}>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        {/* Mostrar (page size) */}
        <div className="flex items-center gap-2">
          <span className={labelClass}>Mostrar:</span>
          <select
            value={limit}
            onChange={(e) => {
              setPage(1); // reset a página 1 al cambiar tamaño
              setLimit(Number(e.target.value));
            }}
            className={selectClass}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span
            className={
              darkMode ? "text-zinc-400 text-sm" : "text-zinc-500 text-sm"
            }
          >
            por página
          </span>
        </div>

        {/* Paginador */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => canPrev && setPage(page - 1)}
            disabled={!canPrev}
            className={pagerBtn(canPrev)}
          >
            <ChevronLeft size={16} />
          </button>

          <div
            className={
              darkMode
                ? "rounded-md bg-yellow-500/10 px-3 py-2 text-amber-600 text-sm font-semibold"
                : "rounded-md bg-yellow-100 px-3 py-2 text-yellow-700 text-sm font-semibold"
            }
          >
            Página {page} / {totalPages}
          </div>

          <button
            type="button"
            onClick={() => canNext && setPage(page + 1)}
            disabled={!canNext}
            className={pagerBtn(canNext)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
