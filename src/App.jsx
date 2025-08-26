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
} from "lucide-react";
import { Logo } from "./components/Logo";
import { Modal } from "./components/Modal";
import { Typewriter } from "./components/Typewriter";

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
          ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 disabled:opacity-50"
          : "bg-white text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 border border-zinc-200"
      } ${className}`}
    >
      {children}
    </button>
  );
});

export const TextInput = memo(
  forwardRef(function TextInput(
    { value, onChange, type = "text", placeholder, className = "", dark },
    ref
  ) {
    return (
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
          dark
            ? "bg-zinc-900 border-zinc-700 text-zinc-100 focus:ring-indigo-500"
            : "bg-white border-zinc-300 text-zinc-900 focus:ring-indigo-300"
        } ${className}`}
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
    } catch (e) {
      setError(e.message || "Error al crear");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (i, row) => {
    try {
      await fetch(`${API_BASE}/data/${i}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      await fetchData();
    } catch {
      setError("No se pudo guardar el cambio");
    }
  };

  const handleDelete = async (i) => {
    try {
      await fetch(`${API_BASE}/data/${i}`, { method: "DELETE" });
      await fetchData();
    } catch {
      setError("No se pudo eliminar");
    }
  };

  const downloadCSV = () => {
    window.location.href = `${API_BASE}/export`;
  };

  const showPaginator = total > limit; // oculto si no supera una página

  // Render
  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-zinc-950 text-zinc-100"
          : "min-h-screen bg-zinc-100 text-zinc-900"
      }
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
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
                dark={darkMode}
              >
                <Download size={18} />
                <span className="hidden sm:inline">Download</span>
              </IconButton>
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
                <div className="md:hidden space-y-3">
                  {loading ? (
                    <div className="text-center text-zinc-500 py-6">
                      Cargando…
                    </div>
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
                        {/* Campos */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">ID</div>
                            <TextInput
                              value={row.id}
                              onChange={(e) => {
                                const updated = [...rows];
                                updated[i].id = e.target.value;
                                setRows(updated);
                              }}
                              placeholder="ID"
                              dark={darkMode}
                            />
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">
                              Precio
                            </div>
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
                            <div className="text-xs text-zinc-500 mb-1">
                              Nombre
                            </div>
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
                            <div className="text-xs text-zinc-500 mb-1">
                              Stock
                            </div>
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

                        {/* Botones */}
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
                            onClick={() => handleDelete(i)}
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
              </tbody>
            </table>
          </div>

          {/* Paginador abajo (oculto si no hay más de una página) */}
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
