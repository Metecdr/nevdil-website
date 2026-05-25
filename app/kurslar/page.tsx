import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kurslar | Nev-Dil Yabancı Dil Kursu",
  description:
    "Nev-Dil'in eğitim programları: YDS Hazırlık, İş İngilizcesi, Junior Grupları, İlkokul ve daha fazlası. Nevşehir'in öncü İngilizce kursu.",
};

const courses = [
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
    badge: null,
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
    badge: "Popüler",
    popular: true,
  },
  {
    icon: "🎒",
    tag: "Ortaokul & Lise",
    level: "Junior Grupları",
    desc: "Ortaokul ve lise öğrencilerine yönelik eğlenceli ve verimli İngilizce grupları. Okul müfredatını destekler.",
    features: [
      "Okul müfredatıyla uyumlu",
      "Sınav odaklı çalışma",
      "Küçük ve dinamik gruplar",
      "Ödev ve takip desteği",
    ],
    badge: null,
    popular: false,
  },
  {
    icon: "🌟",
    tag: "İlkokul",
    level: "İlkokul Grupları",
    desc: "1.–4. sınıf öğrencileri için oyun ve aktivite temelli İngilizce eğitimi. Erken yaşta güçlü temel.",
    features: [
      "Oyun temelli öğrenme",
      "Şarkı, hikaye ve etkinlikler",
      "Seviye uygun içerik",
      "Küçük ve neşeli gruplar",
    ],
    badge: null,
    popular: false,
  },
];

export default function KurslarPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-24 pb-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
            Eğitim Programları
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mt-3 mb-4">
            Kurslarımız
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            İlkokuldan yetişkine, sınav hazırlıktan iş İngilizcesine — her ihtiyaca
            uygun programımız var.
          </p>
        </div>
      </section>

      {/* Kurslar Grid */}
      <section className="bg-black pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((c) => (
              <div
                key={c.level}
                className={`relative bg-gray-950 rounded-2xl p-8 transition-all hover:-translate-y-1 ${
                  c.popular
                    ? "border-2 border-yellow-400"
                    : "border border-gray-800 hover:border-yellow-400/50"
                }`}
              >
                {c.badge && (
                  <span className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">
                    {c.badge}
                  </span>
                )}
                <div className="text-4xl mb-4">{c.icon}</div>
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
                  {c.tag}
                </span>
                <h3 className="text-white text-2xl font-black mt-1.5 mb-3">
                  {c.level}
                </h3>
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

      {/* CTA */}
      <section className="bg-yellow-400 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-black mb-3">
            Hangi Programa Uyduğunuzu Bilmiyor musunuz?
          </h2>
          <p className="text-black/60 mb-8">
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
