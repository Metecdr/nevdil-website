import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı | Nev-Dil",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-yellow-400 text-8xl font-black mb-4 leading-none">
          404
        </div>
        <h1 className="text-white text-2xl font-black mb-3">
          Sayfa Bulunamadı
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Aradığınız sayfa mevcut değil ya da taşınmış olabilir.
        </p>
        <Link
          href="/"
          className="inline-block bg-yellow-400 text-black font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition-all hover:scale-105"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
