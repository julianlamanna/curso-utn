import { Paperclip } from "lucide-react";
import React, { useRef, useState } from "react";

export const FileDropZone = ({ onFile, dark = false }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? dark
              ? "border-amber-500 bg-zinc-800"
              : "border-amber-700 bg-indigo-50"
            : dark
            ? "border-zinc-700 bg-zinc-900"
            : "border-gray-300 bg-white"
        }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <input
        type="file"
        accept=".csv"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files[0])}
      />
      <div className="flex flex-col items-center gap-2">
        <span className={dark ? "text-amber-600" : "text-amber-700"}>
          <Paperclip />
        </span>
        <span
          className={`font-semibold ${
            dark ? "text-zinc-200" : "text-gray-700"
          }`}
        >
          ¡Dropeá tu <b>CSV</b> acá!
        </span>
      </div>
    </div>
  );
};
