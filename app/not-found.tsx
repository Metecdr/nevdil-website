import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-9xl font-black text-yellow-400 leading-none mb-4 animate-fade-in-up">
        404
      </div>
      <h1 className="text-3xl font-black text-white mb-3 animate-fade-in-up delay-100">
        Sayfa Bulunamadı
      </h1>
      <p className="text-gray-500 mb-10 animate-fade-in-up delay-200">
        Aradığınız sayfa mevcut değil ya da taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="bg-yellow-400 text-black font-bold px-8 py-3.5 rounded-full hover:bg-yellow-300 transition-all hover:scale-105 animate-fade-in-up delay-300"
      >
        Ana Sayfaya Dön →
      </Link>
    </div>
  );
}
