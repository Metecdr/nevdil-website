import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kurslar | Nev-Dil Yabancı Dil Kursu",
  description:
    "Nev-Dil'in eğitim programları: YDS Hazırlık, İş İngilizcesi ve çocuk-gençlik grupları. Nevşehir'in öncü İngilizce kursu.",
};

const adultCourses = [
  {
    icon: "📚",
    tag: "Sınav Hazırlık",
    level: "YDS Grupları",
    desc: "Üniversite öğrencileri ve akademisyenler için Yabancı Dil Sınavı'na odaklı yoğun hazırlık programı.",
    features: [
      "Gramer ve kelime odaklı çalışma",
      "Çıkmış soru analizleri",
      "Deneme sınavları",
      "Küçük grup (maks. 8 kişi)",
    ],
    popular: false,
  },
  {
    icon: "💼",
    tag: "Yetişkin",
    level: "İş İngilizcesi",
    desc: "Profesyonel hayatta ihtiyaç duyduğunuz İngilizce. Toplantılar, e-postalar, sunum ve müzakere dili.",
    features: [
      "İş dünyasına özel içerik",
      "Konuşma ve yazışma pratiği",
      "Esnek ders saatleri",
      "Küçük grup (maks. 8 kişi)",
    ],
    popular: true,
  },
];

const childGroups = [
  { icon: "🧸", label: "Junior Grupları", age: "4–6 Yaş", color: "text-pink-400" },
  { icon: "🎒", label: "İlkokul Grupları", age: "1–4. Sınıf", color: "text-blue-400" },
  { icon: "📖", label: "Ortaokul Grupları", age: "5–7. Sınıf", color: "text-green-400" },
  { icon: "🎓", label: "Lise Grupları", age: "9–12. Sınıf", color: "text-purple-400" },
];

export default function KurslarPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-20 pb-10 md:pt-24 md:pb-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
            Eğitim Programları
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-3 mb-4">
            Kurslarımız
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Yetişkinlerden çocuklara, sınav hazırlıktan iş İngilizcesine — her ihtiyaca
            uygun programımız var.
          </p>
        </div>
      </section>

      {/* ── YETİŞKİN GRUPLARI ── */}
      <section className="bg-black pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-4">

          {/* Bölüm başlığı */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-yellow-400/20" />
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest whitespace-nowrap">
              Yetişkin & Sınav Hazırlık Grupları
            </span>
            <div className="h-px flex-1 bg-yellow-400/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {adultCourses.map((c) => (
              <div
                key={c.level}
                className={`relative bg-gray-950 rounded-2xl p-6 md:p-8 transition-all hover:-translate-y-1 ${
                  c.popular
                    ? "border-2 border-yellow-400"
                    : "border border-gray-800 hover:border-yellow-400/50"
                }`}
              >
                {c.popular && (
                  <span className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">
                    Popüler
                  </span>
                )}
                <div className="text-4xl mb-4">{c.icon}</div>
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
                  {c.tag}
                </span>
                <h3 className="text-white text-2xl font-black mt-1.5 mb-3">{c.level}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{c.desc}</p>
                <ul className="space-y-2.5 mb-8">
                  {c.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <span className="text-yellow-400 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/on-kayit"
                  className={`block text-center font-bold py-3.5 rounded-full text-sm transition-all hover:scale-105 ${
                    c.popular
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
                  }`}
                >
                  Ön Kayıt Yaptır
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÇOCUK GRUPLARI BANNER ── */}
      <section className="bg-gray-950 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">

          {/* Bölüm başlığı */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-yellow-400/20" />
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest whitespace-nowrap">
              Çocuk & Gençlik Grupları
            </span>
            <div className="h-px flex-1 bg-yellow-400/20" />
          </div>

          <div className="bg-black border border-yellow-400/25 rounded-2xl p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  4 Yaştan Liseye<br />
                  <span className="text-yellow-400">Özel Gruplar</span>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Her yaş grubuna ve sınıf seviyesine özel olarak tasarlanmış
                  programlarımızla çocuğunuz kendi yaşıtlarıyla birlikte öğrenir.
                  Oyun temelli, eğlenceli ve kalıcı.
                </p>
                <Link
                  href="/cocuk-gruplari"
                  className="inline-block bg-yellow-400 text-black font-bold px-8 py-3.5 rounded-full text-sm hover:bg-yellow-300 transition-all hover:scale-105"
                >
                  Çocuk Gruplarını İncele →
                </Link>
              </div>

              {/* Grup önizleme kartları */}
              <div className="grid grid-cols-2 gap-3">
                {childGroups.map((g) => (
                  <Link
                    key={g.label}
                    href="/cocuk-gruplari"
                    className="bg-gray-950 border border-gray-800 rounded-xl p-4 hover:border-yellow-400/40 transition-all group"
                  >
                    <div className="text-2xl mb-2">{g.icon}</div>
                    <div className={`text-xs font-bold mb-1 ${g.color}`}>{g.age}</div>
                    <div className="text-white text-sm font-semibold group-hover:text-yellow-400 transition-colors">
                      {g.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-yellow-400 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-black mb-3">
            Hangi Programa Uyduğunuzu Bilmiyor musunuz?
          </h2>
          <p className="text-black/60 text-sm md:text-base mb-7 md:mb-8">
            Bize ulaşın, seviye belirleme sınavıyla sizi doğru programa yerleştirelim.
          </p>
          <Link
            href="/on-kayit"
            className="inline-block bg-black text-yellow-400 font-bold px-8 py-4 rounded-full hover:bg-gray-900 transition-all hover:scale-105"
          >
            Bize Ulaşın →
          </Link>
        </div>
      </section>
    </>
  );
}
