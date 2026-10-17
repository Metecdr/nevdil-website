import Link from "next/link";
import Image from "next/image";
import AdminAccess from "@/components/AdminAccess";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-yellow-400/20 py-10 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {/* Logo & Desc */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Nev-Dil Logo"
                width={46}
                height={46}
                className="rounded-full"
              />
              <span className="flex items-center text-xl font-black tracking-tight">
                <span className="text-yellow-400">NEV</span>
                <span className="text-white font-light">-DİL</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Nevşehir&apos;de kaliteli İngilizce eğitimi. Geleceğinize yatırım yapın,
              dünyaya açılın.
            </p>
          </div>

          {/* Sayfalar */}
          <div>
            <h4 className="text-yellow-400 font-bold mb-4 text-xs uppercase tracking-widest">
              Sayfalar
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Ana Sayfa" },
                { href: "/hakkimizda", label: "Hakkımızda" },
                { href: "/kurslar", label: "Kurslar" },
                { href: "/iletisim", label: "İletişim" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-gray-500 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-yellow-400 font-bold mb-4 text-xs uppercase tracking-widest">
              İletişim
            </h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li className="leading-relaxed">📍 15 Temmuz Mah. 154. Sok. No:6B,<br className="hidden sm:block" /> 2000 Evler, Merkez/Nevşehir</li>
              <li>📞 0537 428 76 40</li>
              <li>🕐 Hft içi 09:00 – 20:00</li>
              <li className="pt-1">
                <a
                  href="https://www.instagram.com/nevdil_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-yellow-400 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @nevdil_
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative border-t border-yellow-400/10 mt-10 pt-6 text-center text-gray-700 text-xs">
          <span>© {new Date().getFullYear()} Nev-Dil Yabancı Dil Kursu. Tüm hakları saklıdır.</span>
          <span className="absolute -right-2 top-4">
            <AdminAccess />
          </span>
        </div>
      </div>
    </footer>
  );
}
