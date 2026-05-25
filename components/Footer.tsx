import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-yellow-400/20 py-10 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {/* Logo & Desc */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
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
            </ul>
          </div>
        </div>

        <div className="border-t border-yellow-400/10 mt-10 pt-6 text-center text-gray-700 text-xs">
          © {new Date().getFullYear()} Nev-Dil Yabancı Dil Kursu. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
