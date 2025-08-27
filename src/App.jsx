import React, { useState, useEffect, useMemo, memo, forwardRef } from "react";
import "./index.css";
import { DataControls } from "./DataControls";
import { FileDropZone } from "./FileDropZone";
import {
  Moon,
  Sun,
  Upload,
  Plus,
  Save,
  Trash2,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  FilePlus2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Logo } from "./components/Logo";
import { Modal } from "./components/Modal";
import { Typewriter } from "./components/Typewriter";
import { AnimatePresence, motion } from "framer-motion";

/* =========================================================================
   UI Reusables
   ========================================================================= */
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

/* =========================================================================
   Header de columna con orden dinámico
   ========================================================================= */
const SortHeader = ({
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

/* =========================================================================
   Form del Modal (crear ítem)
   ========================================================================= */
const CreateItemForm = React.memo(function CreateItemForm({
  dark,
  values,
  setValues,
  submitting,
  onSubmit,
  onCancel,
}) {
  const firstRef = React.useRef(null);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!values.nombre || !values.precio || !values.stock) {
      setLocalError("⚠️ Debe llenar todos los campos.");
      return;
    }
    setLocalError("");
    onSubmit();
  };

  const invalidNombre = !!localError && !values.nombre;
  const invalidPrecio = !!localError && !values.precio;
  const invalidStock = !!localError && !values.stock;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        <TextInput
          ref={firstRef}
          placeholder="Nombre"
          value={values.nombre}
          onChange={(e) => setValues({ ...values, nombre: e.target.value })}
          dark={dark}
          className={invalidNombre ? "border-red-500 focus:ring-red-400" : ""}
        />
        <TextInput
          type="number"
          placeholder="Precio"
          value={values.precio}
          onChange={(e) => setValues({ ...values, precio: e.target.value })}
          dark={dark}
          className={invalidPrecio ? "border-red-500 focus:ring-red-400" : ""}
        />
        <TextInput
          type="number"
          placeholder="Stock"
          value={values.stock}
          onChange={(e) => setValues({ ...values, stock: e.target.value })}
          dark={dark}
          className={invalidStock ? "border-red-500 focus:ring-red-400" : ""}
        />
      </div>

      {localError && (
        <div className="mt-3 text-sm text-red-600 dark:text-red-400">
          {localError}
        </div>
      )}

      <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2">
        <IconButton
          title="Cancelar"
          onClick={onCancel}
          dark={dark}
          className={
            dark
              ? "bg-transparent border border-zinc-600 text-zinc-300 hover:bg-zinc-800"
              : "bg-transparent border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
          }
        >
          Cancelar
        </IconButton>

        <IconButton
          title="Crear"
          type="submit"
          disabled={submitting}
          dark={dark}
          className="w-full sm:w-auto"
        >
          <Plus size={18} /> {submitting ? "Creando…" : "Crear"}
        </IconButton>
      </div>
    </form>
  );
});

/* =========================================================================
   App
   ========================================================================= */
export const App = () => {
  // Config
  const API_BASE = useMemo(
    () =>
      (import.meta.env && import.meta.env.VITE_API_URL) ||
      "http://localhost:3001",
    []
  );

  // State
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [total, setTotal] = useState(0);

  const canDownload = !loading && total > 0;

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Modal crear
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
  });

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/data?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`
      );
      if (!res.ok) throw new Error("No se pudo obtener la data");
      const json = await res.json();
      setRows(json.data || []);
      setTotal(json.total || 0);
    } catch (e) {
      setError(e.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, sortBy, order, API_BASE]);

  // Actions
  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        let msg = "No se pudo importar el archivo";
        try {
          const j = await res.json();
          msg = j.error || msg;
        } catch {}
        throw new Error(msg);
      }
      setFile(null);
      await fetchData();
    } catch (e) {
      setError(e.message || "Error de red al subir el archivo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate = async (payload) => {
    setIsSubmitting(true);
    setError(null);
    if (!payload.nombre || !payload.precio || !payload.stock) {
      setError("Completá todos los campos para crear el ítem.");
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        const msg =
          json?.errors?.map((e) => e.msg).join(", ") ||
          "No se pudo crear el ítem";
        throw new Error(msg);
      }
      setCreateForm({ nombre: "", precio: "", stock: "" });
      setOpenCreate(false);
      await fetchData();
      showToast("Registro creado correctamente", "success");
    } catch (e) {
      setError(e.message || "Error al crear");
      showToast("Error al crear registro", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ⚠️ Usar SIEMPRE el ID real
  const handleUpdate = async (_i, row) => {
    try {
      await fetch(`${API_BASE}/data/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      await fetchData();
    } catch {
      setError("No se pudo guardar el cambio");
    }
  };

  const handleDelete = async (row, i) => {
    try {
      const target = row?.id != null ? row.id : i; // fallback a índice
      await fetch(`${API_BASE}/data/${target}`, { method: "DELETE" });
      await fetchData();
    } catch {
      setError("No se pudo eliminar");
    }
  };

  // Helper: obtener TODOS los IDs (pagina por página)
  const fetchAllIds = async () => {
    const ids = [];
    let p = 1;
    const lim = Math.max(50, limit); // pedir de a 50 mínimo
    while (true) {
      const res = await fetch(
        `${API_BASE}/data?page=${p}&limit=${lim}&sortBy=${sortBy}&order=${order}`
      );
      if (!res.ok) break;
      const json = await res.json();
      const data = json.data || [];
      ids.push(...data.map((r) => r.id));
      const totalRemote = json.total || 0;
      if (ids.length >= totalRemote || data.length === 0) break;
      p += 1;
    }
    return ids;
  };

  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const handleDeleteAll = async () => {
    if (isDeletingAll || total <= 0) return;

    const ok = window.confirm("¿Seguro que querés borrar TODOS los registros?");
    if (!ok) return;

    setIsDeletingAll(true);
    setError(null);

    // helper para traer TODOS los IDs en caso de necesitarlos
    const fetchAllIds = async () => {
      const ids = [];
      let p = 1;
      const lim = Math.max(100, limit);
      while (true) {
        const res = await fetch(
          `${API_BASE}/data?page=${p}&limit=${lim}&sortBy=${sortBy}&order=${order}`
        );
        if (!res.ok) break;
        const json = await res.json();
        const data = json.data || [];
        ids.push(...data.map((r) => r.id).filter((v) => v != null));
        const totalRemote = json.total || 0;
        if (ids.length >= totalRemote || data.length === 0) break;
        p += 1;
      }
      return ids;
    };

    // helper final: borrar por índice descendente (0..n-1) si la API indexa por posición
    const deleteByDescendingIndex = async () => {
      // obtengo un total fresco por las dudas
      const res = await fetch(`${API_BASE}/data?page=1&limit=1`);
      const json = res.ok ? await res.json() : { total };
      const n = json?.total ?? total ?? 0;
      for (let idx = n - 1; idx >= 0; idx--) {
        await fetch(`${API_BASE}/data/${idx}`, { method: "DELETE" });
      }
    };

    try {
      // 1) intento masivo directo
      let res = await fetch(`${API_BASE}/data`, { method: "DELETE" });

      if (!res.ok) {
        // 2) intento masivo alternativo con IDs
        const ids = await fetchAllIds();

        if (ids.length) {
          const bulk = await fetch(`${API_BASE}/data/bulk-delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
          });

          // 3) si falla el bulk, borro uno a uno por ID
          if (!bulk.ok) {
            for (const id of ids) {
              await fetch(`${API_BASE}/data/${id}`, { method: "DELETE" });
            }
          }
        } else {
          // si no tengo IDs válidos, voy directo a índice
          await deleteByDescendingIndex();
        }

        // chequeo si aún quedan (por si la API no borró todo)
        const check = await fetch(`${API_BASE}/data?page=1&limit=1`);
        const left = check.ok ? (await check.json()).total || 0 : 0;
        if (left > 0) {
          // 4) remate por índice descendente
          await deleteByDescendingIndex();
        }
      }

      await fetchData();
      showToast("Se borraron todos los registros", "success");
    } catch (e) {
      setError(e.message || "No se pudieron borrar todos los registros");
      showToast("Error al borrar todos", "error");
    } finally {
      setIsDeletingAll(false);
    }
  };

  const downloadCSV = () => {
    if (total <= 0) return;
    window.location.href = `${API_BASE}/export`;
  };

  const showPaginator = total > limit;

  // Render
  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-zinc-950 text-zinc-100"
          : "min-h-screen bg-zinc-100 text-zinc-900"
      }
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === "success"
                ? darkMode
                  ? "bg-green-800 text-green-100"
                  : "bg-green-100 text-green-800"
                : darkMode
                ? "bg-red-800 text-red-100"
                : "bg-red-100 text-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <XCircle size={18} />
            )}
            <span className="font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-[220px]">
            <Logo
              primaryColor={darkMode ? "#a1a1aa" : "#828282"}
              secondaryColor={darkMode ? "#fff" : "#323232"}
            />
            <h1 className="mt-2 text-lg sm:text-xl font-bold">
              <Typewriter text="Gestor de CSV" speed={0.15} />
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <IconButton
              title={darkMode ? "Tema oscuro activo" : "Cambiar a tema oscuro"}
              onClick={() => setDarkMode((v) => !v)}
              dark={darkMode}
            >
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
              <span className="sr-only">Alternar tema</span>
            </IconButton>
            <IconButton
              title="Actualizar"
              onClick={fetchData}
              disabled={loading}
              dark={darkMode}
            >
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Actualizar</span>
            </IconButton>
          </div>
        </header>

        {/* Alertas */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Importar */}
        <section
          className={
            darkMode
              ? "rounded-sm border border-zinc-800 bg-zinc-900 p-6"
              : "rounded-sm border border-zinc-200 bg-white p-6"
          }
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-full flex-1">
              <FileDropZone onFile={setFile} dark={darkMode} />
              {file && (
                <span className="mt-2 block text-xs text-zinc-500">
                  {file.name}
                </span>
              )}
            </div>
            <IconButton
              title="Importar CSV"
              onClick={handleUpload}
              disabled={isUploading || !file}
              className="w-full md:w-auto"
              dark={darkMode}
            >
              <Upload size={18} />
              {isUploading ? "Importando…" : "Importar CSV"}
            </IconButton>
          </div>
        </section>

        {/* Ítems */}
        <section
          className={
            darkMode
              ? "rounded-sm border border-zinc-800 bg-zinc-900 p-6"
              : "rounded-sm border border-zinc-200 bg-white p-6"
          }
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Ítems</h2>
            <div className="flex items-center gap-2">
              <IconButton
                title="Crear Registro"
                onClick={() => setOpenCreate(true)}
                dark={darkMode}
              >
                <FilePlus2 size={18} />{" "}
                <span className="hidden sm:inline">Crear Registro</span>
              </IconButton>

              <IconButton
                title="Download"
                onClick={downloadCSV}
                disabled={!canDownload}
                dark={darkMode}
              >
                <Download size={18} />
                <span className="hidden sm:inline">Download</span>
              </IconButton>

              {canDownload && (
                <IconButton
                  title="Borrar todos"
                  onClick={handleDeleteAll}
                  disabled={isDeletingAll}
                  dark={darkMode}
                  className={
                    darkMode
                      ? "border border-red-700 bg-red-900/30 text-red-200 hover:bg-red-900/50"
                      : "border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                  }
                >
                  <Trash2 size={18} />
                  <span className="hidden sm:inline">
                    {isDeletingAll ? "Borrando…" : "Borrar todos"}
                  </span>
                </IconButton>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table
              className={`min-w-full rounded-lg border text-sm ${
                darkMode
                  ? "divide-zinc-800 border-zinc-800 bg-zinc-900 text-zinc-100"
                  : "divide-zinc-200 border-zinc-200 bg-white text-zinc-900"
              }`}
            >
              <thead>
                <tr>
                  <th
                    className={
                      darkMode
                        ? "px-3 py-2 text-left font-medium bg-zinc-950/40 text-zinc-300"
                        : "px-3 py-2 text-left font-medium bg-zinc-50 text-zinc-600"
                    }
                  >
                    <SortHeader
                      label="ID"
                      field="id"
                      sortBy={sortBy}
                      order={order}
                      setSortBy={setSortBy}
                      setOrder={setOrder}
                      dark={darkMode}
                    />
                  </th>
                  <th
                    className={
                      darkMode
                        ? "px-3 py-2 text-left font-medium bg-zinc-950/40 text-zinc-300"
                        : "px-3 py-2 text-left font-medium bg-zinc-50 text-zinc-600"
                    }
                  >
                    <SortHeader
                      label="Nombre"
                      field="nombre"
                      sortBy={sortBy}
                      order={order}
                      setSortBy={setSortBy}
                      setOrder={setOrder}
                      dark={darkMode}
                    />
                  </th>
                  <th
                    className={
                      darkMode
                        ? "px-3 py-2 text-left font-medium bg-zinc-950/40 text-zinc-300"
                        : "px-3 py-2 text-left font-medium bg-zinc-50 text-zinc-600"
                    }
                  >
                    <SortHeader
                      label="Precio"
                      field="precio"
                      sortBy={sortBy}
                      order={order}
                      setSortBy={setSortBy}
                      setOrder={setOrder}
                      dark={darkMode}
                    />
                  </th>
                  <th
                    className={
                      darkMode
                        ? "px-3 py-2 text-left font-medium bg-zinc-950/40 text-zinc-300"
                        : "px-3 py-2 text-left font-medium bg-zinc-50 text-zinc-600"
                    }
                  >
                    Stock
                  </th>
                  <th
                    className={
                      darkMode
                        ? "px-3 py-2 text-left font-medium bg-zinc-950/40 text-zinc-300"
                        : "px-3 py-2 text-left font-medium bg-zinc-50 text-zinc-600"
                    }
                  />
                </tr>
              </thead>

              <tbody
                className={
                  darkMode
                    ? "divide-y divide-zinc-800"
                    : "divide-y divide-zinc-100"
                }
              >
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-zinc-500"
                    >
                      Cargando…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-zinc-500"
                    >
                      Sin resultados
                    </td>
                  </tr>
                ) : (
                  rows.map((row, i) => (
                    <tr
                      key={row?.id ?? i}
                      className="hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5"
                    >
                      {/* ID ahora es solo lectura */}
                      <td className="px-3 py-2 w-[10rem]">
                        <TextInput
                          value={row.id}
                          readOnly
                          placeholder="ID"
                          dark={darkMode}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <TextInput
                          value={row.nombre}
                          onChange={(e) => {
                            const updated = [...rows];
                            updated[i].nombre = e.target.value;
                            setRows(updated);
                          }}
                          placeholder="Nombre"
                          dark={darkMode}
                        />
                      </td>
                      <td className="px-3 py-2 w-[8rem]">
                        <TextInput
                          type="number"
                          value={row.precio}
                          onChange={(e) => {
                            const updated = [...rows];
                            updated[i].precio = e.target.value;
                            setRows(updated);
                          }}
                          placeholder="Precio"
                          dark={darkMode}
                        />
                      </td>
                      <td className="px-3 py-2 w-[7rem]">
                        <TextInput
                          type="number"
                          value={row.stock}
                          onChange={(e) => {
                            const updated = [...rows];
                            updated[i].stock = e.target.value;
                            setRows(updated);
                          }}
                          placeholder="Stock"
                          dark={darkMode}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <IconButton
                            title="Guardar"
                            onClick={() => handleUpdate(i, row)}
                            dark={darkMode}
                          >
                            <Save size={16} />
                            <span className="hidden sm:inline">Guardar</span>
                          </IconButton>
                          <IconButton
                            title="Eliminar"
                            onClick={() => handleDelete(row, i)}
                            dark={darkMode}
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Borrar</span>
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Vista mobile en cards */}
          <div className="md:hidden space-y-3 mt-4">
            {loading ? (
              <div className="text-center text-zinc-500 py-6">Cargando…</div>
            ) : rows.length === 0 ? (
              <div className="text-center text-zinc-500 py-6">
                Sin resultados
              </div>
            ) : (
              rows.map((row, i) => (
                <div
                  key={row?.id ?? i}
                  className={`rounded-lg border p-4 ${
                    darkMode
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-white border-zinc-200"
                  }`}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">ID</div>
                      <TextInput value={row.id} readOnly dark={darkMode} />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Precio</div>
                      <TextInput
                        type="number"
                        value={row.precio}
                        onChange={(e) => {
                          const updated = [...rows];
                          updated[i].precio = e.target.value;
                          setRows(updated);
                        }}
                        placeholder="Precio"
                        dark={darkMode}
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-zinc-500 mb-1">Nombre</div>
                      <TextInput
                        value={row.nombre}
                        onChange={(e) => {
                          const updated = [...rows];
                          updated[i].nombre = e.target.value;
                          setRows(updated);
                        }}
                        placeholder="Nombre"
                        dark={darkMode}
                      />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Stock</div>
                      <TextInput
                        type="number"
                        value={row.stock}
                        onChange={(e) => {
                          const updated = [...rows];
                          updated[i].stock = e.target.value;
                          setRows(updated);
                        }}
                        placeholder="Stock"
                        dark={darkMode}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <IconButton
                      title="Guardar"
                      onClick={() => handleUpdate(i, row)}
                      dark={darkMode}
                      className="text-xs"
                    >
                      <Save size={16} />
                      Guardar
                    </IconButton>
                    <IconButton
                      title="Eliminar"
                      onClick={() => handleDelete(row)}
                      dark={darkMode}
                      className="text-xs"
                    >
                      <Trash2 size={16} />
                      Borrar
                    </IconButton>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Paginador */}
          {showPaginator && (
            <div className="mt-4">
              <DataControls
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                total={total}
                darkMode={darkMode}
              />
            </div>
          )}
        </section>

        {/* Modal: Crear nuevo ítem */}
        <Modal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          title="Crear nuevo ítem"
          dark={darkMode}
        >
          <CreateItemForm
            dark={darkMode}
            values={createForm}
            setValues={setCreateForm}
            submitting={isSubmitting}
            onSubmit={() => handleCreate(createForm)}
            onCancel={() => setOpenCreate(false)}
          />
        </Modal>
      </div>
    </div>
  );
};
