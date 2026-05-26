import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkımızda | Nev-Dil Yabancı Dil Kursu",
  description:
    "Nev-Dil Yabancı Dil Kursu, 2021'de Nevşehir'in ilk ve tek yerli çocuk yaş gruplarına İngilizce dil eğitimi veren kurumu olarak kurulmuştur. BEDAF yetkili kurum.",
};

const stats = [
  { n: "700+", l: "Mezun Öğrenci" },
  { n: "2021", l: "Kuruluş Yılı" },
  { n: "5", l: "Yıllık Deneyim" },
  { n: "A1–C2", l: "CEFR Seviyeleri" },
];

const values = [
  {
    icon: "🎯",
    title: "Hedef Odaklı",
    desc: "Her öğrencinin hedefine ve yaş grubuna göre kişiselleştirilmiş eğitim planı hazırlanır.",
  },
  {
    icon: "👥",
    title: "Akran Grubu Sınıflar",
    desc: "Aynı sınıf ve yaş grubundaki öğrenciler bir arada öğrenir. Hiç kimse geride kalmaz.",
  },
  {
    icon: "📚",
    title: "Modern Metodlar",
    desc: "Oyun temelli, eğlenceli ve interaktif derslerle hızlı ve kalıcı öğrenme.",
  },
];


export default function HakkimizdaPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-black pt-20 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
            Hikayemiz
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-3 mb-6">
            Hakkımızda
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Nevşehir&apos;in ilk ve tek yerli çocuk yaş gruplarına İngilizce dil eğitimi
            veren kurumu olarak, <span className="text-yellow-400 font-semibold">2 Ekim 2021</span>&apos;de
            kurulduk. Beş yıldır, yaklaşık <span className="text-yellow-400 font-semibold">700 öğrencimizi</span> mezun
            ederek güvenilir ve kaliteli bir eğitim sunuyoruz. Öğrenci odaklı yaklaşımımız,
            modern ve eğlenceli öğretim yöntemlerimiz ve bireysel gelişime verdiğimiz önemle,
            Nevşehir&apos;de İngilizce öğrenmenin en güvenilir adresi olmaktan gurur duyuyoruz.
          </p>
        </div>
      </section>

      {/* ── İSTATİSTİKLER ── */}
      <section className="border-t border-yellow-400/20 bg-yellow-400/5">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="text-3xl md:text-4xl font-black text-yellow-400">{s.n}</div>
              <div className="text-gray-500 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEDEN NEV-DİL ── */}
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

      {/* ── AKREDİTASYON & SERTİFİKALAR ── */}
      <section className="bg-black py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
              Uluslararası Yetki
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">
              Akreditasyon & Belgeler
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
              Nev-Dil, BEDAF — British Educational Affairs tarafından yetkilendirilmiş bir kurumdur.
              Öğrencilerimize Avrupa Konseyi onaylı sertifika sağlıyoruz.
            </p>
          </div>

          {/* Ana iki sertifika — PDF önizlemeli */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">

            {/* Yetkili Kurum */}
            <div className="bg-gray-950 border border-yellow-400/25 rounded-2xl overflow-hidden hover:border-yellow-400/60 transition-all group">
              {/* PDF Önizleme */}
              <div className="relative bg-gray-900 h-56 md:h-64 overflow-hidden">
                <iframe
                  src="/belgeler/yetkili-kurum.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit"
                  className="w-full h-full border-0 pointer-events-none"
                  title="BEDAF Yetkili Kurum Belgesi"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
              </div>
              {/* Bilgi */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">
                    Yetkili Kurum
                  </span>
                  <span className="text-gray-600 text-xs">Geçerlilik: 31.12.2026</span>
                </div>
                <h3 className="text-white font-black text-lg mb-1">BEDAF Authorized Institution</h3>
                <p className="text-gray-500 text-xs mb-4">
                  Sertifika No: 2025/000934 · BEDAF British Educational Affairs
                </p>
                <a
                  href="/belgeler/yetkili-kurum.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-yellow-400 text-sm font-bold hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Belgeyi Görüntüle
                </a>
              </div>
            </div>

            {/* Yetkili Sınav Gözetmeni */}
            <div className="bg-gray-950 border border-yellow-400/25 rounded-2xl overflow-hidden hover:border-yellow-400/60 transition-all group">
              <div className="relative bg-gray-900 h-56 md:h-64 overflow-hidden">
                <iframe
                  src="/belgeler/yetkili-sinav-gozetmeni.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit"
                  className="w-full h-full border-0 pointer-events-none"
                  title="BEDAF Yetkili Sınav Gözetmeni Belgesi"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">
                    Yetkili Sınav Gözetmeni
                  </span>
                  <span className="text-gray-600 text-xs">Geçerlilik: 31.12.2026</span>
                </div>
                <h3 className="text-white font-black text-lg mb-1">BEDAF Authorized Examiner</h3>
                <p className="text-gray-500 text-xs mb-4">
                  Sertifika No: 2025/000926 · Ms. Şerifegül Yavuz
                </p>
                <a
                  href="/belgeler/yetkili-sinav-gozetmeni.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-yellow-400 text-sm font-bold hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Belgeyi Görüntüle
                </a>
              </div>
            </div>
          </div>

          {/* Garanti Belgesi + ELP Kutusu yan yana */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

            {/* Garanti Belgesi */}
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/30 transition-all flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-4">📄</div>
                <h3 className="text-white font-black text-lg mb-2">Garanti Belgesi</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Kurumumuza ait resmi garanti belgesi. Eğitim kalitemizi ve
                  taahhütlerimizi belgeleyen resmi doküman.
                </p>
              </div>
              <a
                href="/belgeler/garanti-belgesi.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center gap-2 text-yellow-400 text-sm font-bold hover:underline"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Belgeyi Görüntüle
              </a>
            </div>

            {/* ELP Sertifika Bilgi Kutusu */}
            <div className="bg-yellow-400/5 border border-yellow-400/30 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-4">🏅</div>
                <h3 className="text-white font-black text-lg mb-2">
                  Öğrencilere Avrupa Dil Sertifikası
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Öğrencilerimiz dil seviyelerini belgeleyen{" "}
                  <span className="text-yellow-400 font-semibold">Avrupa Dil Portfolyosu (ELP)</span> ve
                  uluslararası geçerliliğe sahip sertifikalar alabilmektedir.
                  Tüm sertifikalar{" "}
                  <span className="text-yellow-400 font-semibold">Avrupa Konseyi</span> onaylı
                  CEFR standartlarına (A1–C2) dayanmaktadır.
                </p>
              </div>
              <a
                href="https://www.bedaf.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 border border-yellow-400/50 text-yellow-400 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-yellow-400/10 transition-all w-fit"
              >
                bedaf.org.uk →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ÖĞRETMEN ── */}
      <section className="bg-gray-950 py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
              Ekibimiz
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">
              Öğretmenlerimiz
            </h2>
          </div>
          <div className="max-w-xs mx-auto">
            <div className="bg-black border border-yellow-400/30 rounded-2xl p-8 text-center hover:border-yellow-400/60 transition-all">
              <div className="w-28 h-28 bg-yellow-400/10 border-2 border-yellow-400/40 rounded-full flex items-center justify-center mx-auto mb-5 text-5xl">
                👩‍🏫
              </div>
              <h3 className="text-white font-bold text-xl">Şerifegül Yavuz</h3>
              <p className="text-yellow-400 text-sm font-semibold mt-1">Kurucu & Baş Öğretmen</p>
              <p className="text-gray-600 text-xs mt-1 mb-4">BEDAF Yetkili Sınav Gözetmeni</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs px-2.5 py-1 rounded-full">
                  5+ Yıl Deneyim
                </span>
                <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs px-2.5 py-1 rounded-full">
                  BEDAF Certified
                </span>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-700 text-xs mt-6">
            * Diğer öğretmen bilgileri ve fotoğrafları yakında güncellenecektir.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-yellow-400 py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-black mb-4">
            Tanışmak İster misiniz?
          </h2>
          <p className="text-black/60 text-sm md:text-base mb-8">
            Ön kayıt veya bilgi almak için bize ulaşın, sizi doğru programa yönlendirelim.
          </p>
          <Link
            href="/on-kayit"
            className="inline-block bg-black text-yellow-400 font-bold px-8 py-4 rounded-full hover:bg-gray-900 transition-all hover:scale-105"
          >
            Ön Kayıt Yaptır →
          </Link>
        </div>
      </section>
    </>
  );
}
