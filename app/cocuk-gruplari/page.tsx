import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Çocuk Grupları | Nev-Dil Yabancı Dil Kursu",
  description:
    "Nev-Dil çocuk ve gençlik İngilizce grupları: 4–6 yaş Junior, İlkokul, Ortaokul ve Lise grupları. Nevşehir'de oyun temelli dil eğitimi.",
};

const groups = [
  {
    icon: "🧸",
    tag: "4–6 Yaş",
    title: "Junior Grupları",
    desc: "Erken yaşta İngilizce ile tanışmanın en eğlenceli yolu. VIP sınıf ortamında oyun ve aktivite temelli eğitim.",
    color: "border-pink-500/50",
    tagColor: "text-pink-400",
    features: [
      { icon: "👑", text: "VIP sınıf — maks. 6 kişi" },
      { icon: "💬", text: "Günlük konuşma diline yönelik İngilizce çalışmaları" },
      { icon: "🎮", text: "Oyunlarla eğlenceli aktiviteler" },
      { icon: "🌍", text: "Gerçek hayat çalışmaları" },
      { icon: "📦", text: "Materyal desteği" },
    ],
  },
  {
    icon: "🎒",
    tag: "1–4. Sınıf",
    title: "İlkokul Grupları",
    desc: "Her sınıf kendi yaşıtlarıyla birlikte öğrenir. 4 temel beceriyi eğlenceli yöntemlerle geliştiren yapılandırılmış program.",
    color: "border-blue-500/50",
    tagColor: "text-blue-400",
    features: [
      { icon: "🏫", text: "Her sınıf grubuna özel sınıflar (4. sınıf 4. sınıfla)" },
      { icon: "👥", text: "Maks. 10 kişilik grup" },
      { icon: "📝", text: "4 beceriye yönelik: konuşma, dinleme, okuma, yazma" },
      { icon: "🎯", text: "Oyunlarla etkili iletişim teknikleriyle dil eğitimi" },
      { icon: "📦", text: "Materyal desteği" },
    ],
  },
  {
    icon: "📖",
    tag: "5–7. Sınıf",
    title: "Ortaokul Grupları",
    desc: "Okul müfredatını destekler, sınav başarısını artırır. Akran grubu sınıflarıyla daha verimli ve motive edici öğrenme.",
    color: "border-green-500/50",
    tagColor: "text-green-400",
    features: [
      { icon: "🏫", text: "Her sınıf grubuna özel sınıflar (5. sınıf 5. sınıfla)" },
      { icon: "👥", text: "Maks. 10 kişilik grup" },
      { icon: "📝", text: "4 beceriye yönelik: konuşma, dinleme, okuma, yazma" },
      { icon: "🎯", text: "Oyunlarla etkili iletişim teknikleriyle dil eğitimi" },
      { icon: "📦", text: "Materyal desteği" },
    ],
  },
  {
    icon: "🎓",
    tag: "9–12. Sınıf",
    title: "Lise Grupları",
    desc: "A1'den B2'ye seviye grupları. Konuşma odaklı eğitimle gerçek İngilizce pratiği — üniversite ve iş hayatına hazırlık.",
    color: "border-purple-500/50",
    tagColor: "text-purple-400",
    features: [
      { icon: "📊", text: "A1, A2, B1, B2 — her seviyeye özel sınıf" },
      { icon: "🏫", text: "Her sınıf grubuna özel sınıflar (9. sınıf 9. sınıfla)" },
      { icon: "💬", text: "Konuşma temelli dil eğitimi" },
      { icon: "🎯", text: "Gerçek iletişim senaryolarıyla pratik" },
      { icon: "📦", text: "Materyal desteği" },
    ],
  },
];

export default function CocukGruplariPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-20 pb-10 md:pt-24 md:pb-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
            Çocuk & Gençlik Programları
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-3 mb-4">
            Çocuk Grupları
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            4 yaştan 12. sınıfa kadar her yaş grubuna özel sınıflar.
            Çocuğunuz kendi yaşıtlarıyla, kendi seviyesinde, eğlenerek öğrenir.
          </p>
        </div>
      </section>

      {/* Gruplar */}
      <section className="bg-black pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {groups.map((g) => (
              <div
                key={g.title}
                className={`relative bg-gray-950 rounded-2xl p-6 md:p-8 border ${g.color} hover:-translate-y-1 transition-all`}
              >
                <div className="text-4xl mb-4">{g.icon}</div>
                <span className={`text-xs font-bold uppercase tracking-widest ${g.tagColor}`}>
                  {g.tag}
                </span>
                <h3 className="text-white text-2xl font-black mt-1.5 mb-3">{g.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{g.desc}</p>

                <ul className="space-y-3 mb-8">
                  {g.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="text-lg leading-none mt-0.5">{f.icon}</span>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/on-kayit"
                  className="block text-center border border-yellow-400/50 text-yellow-400 font-bold py-3.5 rounded-full text-sm hover:bg-yellow-400/10 transition-all hover:scale-105"
                >
                  Ön Kayıt Yaptır
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neden akran grubu */}
      <section className="bg-gray-950 py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
              Yaklaşımımız
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">
              Neden Akran Grubu Sınıflar?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "🤝",
                title: "Aynı Seviye",
                desc: "Aynı sınıftaki öğrenciler aynı konuları bilir, aynı zorluklarla karşılaşır. Hiç kimse geride kalmaz.",
              },
              {
                icon: "🏃",
                title: "Doğru Tempo",
                desc: "Ders hızı grubun seviyesine göre ayarlanır. Ne çok hızlı ne çok yavaş — tam kararında ilerleme.",
              },
              {
                icon: "🎯",
                title: "Hedef Odaklı",
                desc: "Her yaş grubunun ihtiyacı farklıdır. Junior oyun öğrenir, lise konuşma pratiği yapar.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-black border border-yellow-400/15 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-yellow-400 font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-yellow-400 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-black mb-3">
            Çocuğunuz İçin Yer Ayırtın
          </h2>
          <p className="text-black/60 text-sm md:text-base mb-7">
            Kontenjanlar dolmadan ön kayıt yaptırın. Sizi arayıp doğru gruba yönlendirelim.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/on-kayit"
              className="bg-black text-yellow-400 font-bold px-8 py-4 rounded-full hover:bg-gray-900 transition-all hover:scale-105"
            >
              Ön Kayıt Yaptır →
            </Link>
            <Link
              href="/kurslar"
              className="border-2 border-black text-black font-bold px-8 py-4 rounded-full hover:bg-black/10 transition-all"
            >
              Yetişkin Kursları
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
