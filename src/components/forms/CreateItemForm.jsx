import React, { useEffect, useState } from "react";
import { IconButton } from "../ui/IconButton";
import { TextInput } from "../ui/TextInput";
import { Plus } from "lucide-react";

export const CreateItemForm = React.memo(function CreateItemForm({
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
