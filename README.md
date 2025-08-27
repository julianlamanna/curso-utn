# 📂 CSV Manager

Pequeño gestor de CSV con **React + Vite + Tailwind + Framer Motion**.  
Permite importar, listar, editar y exportar registros, con soporte dark/light.

---

## 🚀 Features

- 📥 **Importar CSV** con drag & drop.
- 📝 **CRUD completo**:
  - Crear desde modal con validaciones.
  - Editar inline en tabla o cards (mobile).
  - Eliminar individual o **eliminar todos** con fallback seguro.
- ⬇️ **Exportar CSV** en un clic.
- 🌙 **Dark / Light mode** con toggle.
- 🔄 **Paginación, orden y refresco** dinámico.
- ⚡ **Toasts animados** para feedback de acciones.

---

## 📱 Responsive

- **Mobile (`md:hidden`)**:  
  Cada fila se muestra como card con inputs apilados en grilla simple, botones al final y accesos táctiles cómodos.

- **Desktop (`md:block`)**:  
  Tabla con encabezados clicables para ordenar, edición inline y acciones por fila.

---

## 🧯 Validaciones & UX

### En el modal de “Crear ítem”:

- Si falta algún dato: mensaje en rojo y borde rojo en inputs.
- Si el nombre ya existe: **toast rojo** con “Ya existe un registro con ese nombre”.
- Botón Cancelar con estilo suave (borde + hover).

### En el listado:

- Estados claros de **cargando** y **sin resultados**.
- Errores de red o validación aparecen en **toast** o en el alert superior.
- “Borrar todos” con confirmación y estrategia de fallback para que nunca quede basura.

---

## 🎨 Detalles de UI

- **Dark/Light**: `darkMode` aplica clases a contenedores, inputs y botones.
- **Typewriter**: título animado con cursor parpadeando y velocidad ajustable.
- **Modal**: apertura/cierre con escala y fade usando Framer Motion.
- **Toasts**: suaves con fade y slide, colores verde/rojo según resultado.

---

## 🛠️ Stack

- React 18
- Vite
- TailwindCSS
- Lucide Icons
- Framer Motion

---

## 📄 Licencia

Libre uso para proyectos chicos, demos o internas.
