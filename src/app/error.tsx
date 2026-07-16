"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle size={36} />
      </div>
      <h1 className="font-display text-2xl font-extrabold text-stone-800">
        Un problème est survenu / وقع مشكل / Something went wrong
      </h1>
      <button
        onClick={() => reset()}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 font-semibold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors"
      >
        <RotateCcw size={16} /> Réessayer / إعادة المحاولة / Retry
      </button>
    </div>
  );
}
