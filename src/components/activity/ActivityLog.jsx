// src/components/activity/ActivityLog.jsx
import React, { useMemo } from "react";
import { Trash2, Clock, Activity } from "lucide-react";
import { IconButton } from "../ui/IconButton";

const actionLabel = (a) => {
  switch (a) {
    case "create":
      return "Creación";
    case "update":
      return "Actualización";
    case "delete":
      return "Eliminación";
    case "delete_all":
      return "Eliminación masiva";
    case "upload":
      return "Importación CSV";
    default:
      return a;
  }
};

const badgeColors = (dark, a) => {
  const base = dark
    ? {
        create: "bg-emerald-900/40 text-emerald-200 border-emerald-800",
        update: "bg-blue-900/40 text-blue-200 border-blue-800",
        delete: "bg-red-900/40 text-red-200 border-red-800",
        delete_all: "bg-red-900/70 text-red-100 border-red-800",
        upload: "bg-violet-900/40 text-violet-200 border-violet-800",
        default: "bg-zinc-800 text-zinc-200 border-zinc-700",
      }
    : {
        create: "bg-emerald-50 text-emerald-700 border-emerald-200",
        update: "bg-blue-50 text-blue-700 border-blue-200",
        delete: "bg-red-50 text-red-700 border-red-200",
        delete_all: "bg-red-100 text-red-800 border-red-200",
        upload: "bg-violet-50 text-violet-700 border-violet-200",
        default: "bg-zinc-50 text-zinc-700 border-zinc-200",
      };
  return base[a] || base.default;
};

export function ActivityLog({ items = [], onClear, dark = false }) {
  const empty = !items || items.length === 0;

  const grouped = useMemo(() => {
    // agrupo por fecha (YYYY-MM-DD) para headers lindos
    const map = new Map();
    for (const it of items) {
      const d = new Date(it.ts);
      const key = isNaN(d) ? "Desconocida" : d.toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    }
    // orden por fecha descendente
    return Array.from(map.entries()).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [items]);

  return (
    <section
      className={
        dark
          ? "rounded-sm border border-zinc-800 bg-zinc-900 p-6"
          : "rounded-sm border border-zinc-200 bg-white p-6"
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity size={18} />
          Historial de actividad
        </h2>

        <IconButton
          title="Limpiar historial"
          onClick={onClear}
          dark={dark}
          disabled={empty}
          className={
            dark
              ? "border border-zinc-700 bg-transparent hover:bg-zinc-800"
              : "border border-zinc-300 bg-transparent hover:bg-zinc-100"
          }
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Limpiar</span>
        </IconButton>
      </div>

      {empty ? (
        <div
          className={
            dark
              ? "text-sm text-zinc-400 italic"
              : "text-sm text-zinc-500 italic"
          }
        >
          No hay actividad aún.
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, rows]) => (
            <div key={date} className="space-y-3">
              <div
                className={
                  dark
                    ? "text-xs font-medium text-zinc-400"
                    : "text-xs font-medium text-zinc-500"
                }
              >
                {date}
              </div>

              <ul className="space-y-2">
                {rows.map((it) => (
                  <li
                    key={it.id}
                    className={
                      dark
                        ? "rounded-lg border border-zinc-800 bg-zinc-950/30 px-3 py-2"
                        : "rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2"
                    }
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${badgeColors(
                          dark,
                          it.action
                        )}`}
                      >
                        {actionLabel(it.action)}
                      </span>

                      {it.detail && (
                        <span
                          className={
                            dark
                              ? "text-sm text-zinc-200"
                              : "text-sm text-zinc-800"
                          }
                        >
                          {it.detail}
                        </span>
                      )}

                      <span
                        className={
                          dark
                            ? "ml-auto inline-flex items-center gap-1 text-xs text-zinc-400"
                            : "ml-auto inline-flex items-center gap-1 text-xs text-zinc-500"
                        }
                        title={new Date(it.ts).toLocaleString()}
                      >
                        <Clock size={12} />
                        {new Date(it.ts).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
