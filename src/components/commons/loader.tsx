import React from "react";

export default function Loader({ textLoading }: { textLoading?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <span className="w-10 h-10 mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
      <span className="text-lg text-primary font-semibold tracking-wide animate-pulse-purple">
        {textLoading || "Cargando..."}
      </span>
    </div>
  );
}
