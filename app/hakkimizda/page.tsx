import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkımızda | Nev-Dil Yabancı Dil Kursu",
  description:
    "Nev-Dil'in hikayesi, misyonu ve uzman öğretmen kadrosu hakkında bilgi edinin.",
};

const values = [
  {
    icon: "🎯",
    title: "Hedef Odaklı",
    desc: "Her öğrencinin hedefine göre kişiselleştirilmiş eğitim planı hazırlanır.",
  },
  {
    icon: "👥",
    title: "Küçük Gruplar",
    desc: "Maksimum 8 kişilik sınıflarla her öğrenciye bireysel ilgi garantisi.",
  },
  {
    icon: "📚",
    title: "Modern Metodlar",
    desc: "Güncel materyaller ve interaktif derslerle hızlı ve kalıcı öğrenme.",
  },
];

const teachers = [
  {
    name: "Ad Soyad",
    role: "Kurucu & Baş Öğretmen",
    exp: "10+ yıl deneyim",
    icon: "👨‍🏫",
  },
  {
    name: "Ad Soyad",
    role: "İngilizce Öğretmeni",
    exp: "8 yıl deneyim",
    icon: "👩‍🏫",
  },
  {
    name: "Ad Soyad",
    role: "IELTS / TOEFL Uzmanı",
    exp: "6 yıl deneyim",
    icon: "👨‍💼",
  },
];

export default function HakkimizdaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-20 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
            Hikayemiz
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-3 mb-5 md:mb-6">
            Hakkımızda
          </h1>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Nev-Dil, Nevşehir&apos;de 10 yılı aşkın süredir kaliteli dil eğitimi
            sunmaktadır. Küçük grup sınıfları ve bireysel yaklaşımımızla yüzlerce
            öğrencimizin hedeflerine ulaşmasına yardımcı olduk.
          </p>
        </div>
      </section>

      {/* Değerler */}
      <section className="bg-gray-950 py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
              Yaklaşımımız
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">
              Neden Nev-Dil?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-black border border-yellow-400/20 rounded-2xl p-6 md:p-8 text-center hover:border-yellow-400/50 transition-all"
              >
                <div className="text-5xl mb-5">{v.icon}</div>
                <h3 className="text-yellow-400 font-bold text-xl mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Öğretmenler */}
      <section className="bg-black py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
              Ekibimiz
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">
              Öğretmenlerimiz
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {teachers.map((t, i) => (
              <div
                key={i}
                className="bg-gray-950 border border-gray-800 rounded-2xl p-6 md:p-8 text-center hover:border-yellow-400/40 transition-all"
              >
                {/* Fotoğraf placeholder */}
                <div className="w-28 h-28 bg-yellow-400/10 border-2 border-yellow-400/30 rounded-full flex items-center justify-center mx-auto mb-5 text-5xl">
                  {t.icon}
                </div>
                <h3 className="text-white font-bold text-lg">{t.name}</h3>
                <p className="text-yellow-400 text-sm font-medium mt-1">{t.role}</p>
                <p className="text-gray-600 text-xs mt-1">{t.exp}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-700 text-xs mt-6">
            * Öğretmen bilgileri ve fotoğrafları yakında güncellenecektir
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Tanışmak İster misiniz?
          </h2>
          <p className="text-gray-500 mb-8">
            Ön kayıt veya bilgi almak için bize ulaşın, sizi doğru programa yönlendirelim.
          </p>
          <Link
            href="/on-kayit"
            className="inline-block bg-yellow-400 text-black font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition-all hover:scale-105"
          >
            Ön Kayıt Yaptır →
          </Link>
        </div>
      </section>
    </>
  );
}
