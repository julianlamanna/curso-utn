import { motion } from "framer-motion";

export const Typewriter = ({ text, speed = 0.12, className = "" }) => {
  const duration = Math.max(0.5, text.length * speed);

  return (
    <div className={`inline-flex ${className}`}>
      {/* Texto con efecto máquina de escribir */}
      <motion.span
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration, ease: "linear" }}
        style={{
          display: "inline-block",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </motion.span>

      {/* Cursor parpadeante */}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{
          duration: 1.2, // más lento el parpadeo
          repeat: Infinity,
        }}
        className="ml-[2px] font-bold"
      >
        |
      </motion.span>
    </div>
  );
};
