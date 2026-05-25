"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Nev-Dil Error]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-5">⚠️</div>
      <h1 className="text-3xl font-black text-white mb-3">Bir Hata Oluştu</h1>
      <p className="text-gray-500 mb-10 max-w-md">
        Beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={reset}
          className="bg-yellow-400 text-black font-bold px-7 py-3.5 rounded-full hover:bg-yellow-300 transition-all hover:scale-105"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="border border-yellow-400/50 text-yellow-400 font-bold px-7 py-3.5 rounded-full hover:bg-yellow-400/10 transition-all"
        >
          Ana Sayfa
        </Link>
      </div>
    </div>
  );
}
