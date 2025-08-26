import { motion, AnimatePresence } from "framer-motion";

export const Modal = ({ open, onClose, children, title, dark }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`rounded-lg shadow-xl p-8 w-full max-w-4xl ${
              dark ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"
            }`}
            initial={{ scale: 0.9, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-2xl hover:text-red-500 transition"
                type="button"
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>

            {/* Contenido (form) */}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
