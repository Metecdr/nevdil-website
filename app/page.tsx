import Link from "next/link";

const onkayitlar = [
  {
    id: 1,
    badge: "YAZ KURSU",
    title: "2025 Yaz Kursu Ön Kayıt",
    desc: "Haziran–Ağustos yaz dönemi kontenjanı dolmadan yerinizi ayırtın. Sınırlı sayıda yer!",
    acik: true,
  },
  {
    id: 2,
    badge: "YENİ DÖNEM",
    title: "Güz Dönemi Kayıtları",
    desc: "Eylül başlangıçlı yeni dönem için ön kayıtlarımız açıktır. Erken kayıt avantajından yararlanın.",
    acik: true,
  },
];

const courses = [
  {
    level: "Başlangıç",
    tag: "A1 – A2",
    desc: "Sıfırdan İngilizce. Alfabe, günlük konuşmalar ve temel gramer.",
    icon: "🌱",
  },
  {
    level: "Orta Seviye",
    tag: "B1 – B2",
    desc: "Akıcı konuşmaya doğru. İş İngilizcesi, okuma ve yazma pratiği.",
    icon: "📈",
  },
  {
    level: "İleri Seviye",
    tag: "C1 – C2",
    desc: "Akademik ve profesyonel İngilizce. IELTS ve TOEFL sınav hazırlığı.",
    icon: "🏆",
  },
];

const stats = [
  { n: "700+", l: "Mezun Öğrenci" },
  { n: "2021", l: "Kuruluş Yılı" },
  { n: "BEDAF", l: "Yetkili Kurum" },
  { n: "A1–C2", l: "CEFR Sertifikası" },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-black overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(234,179,8,0.12) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-yellow-400/10 rounded-full blur-3xl pointer-events-none animate-glow" />

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-20 md:pt-24 md:pb-28 text-center">
          <span className="inline-block bg-yellow-400 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 md:mb-8 animate-fade-in-up">
            Nevşehir&apos;in Öncü İngilizce Kursu
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-5 md:mb-6 animate-fade-in-up delay-100">
            İngilizce Öğrenmek
            <br />
            <span className="text-yellow-400">Hiç Bu Kadar</span>
            <br />
            Kolay Olmamıştı
          </h1>
          <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-12 animate-fade-in-up delay-200">
            Uzman öğretmenler, küçük grup sınıfları ve modern metodlarla
            hedefinize ulaşın. Yerinizi bugün ayırtın.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fade-in-up delay-300">
            <Link
              href="/on-kayit"
              className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-300 transition-all hover:scale-105 shadow-lg shadow-yellow-400/25"
            >
              Ön Kayıt Yaptır
            </Link>
            <Link
              href="/kurslar"
              className="border border-yellow-400/40 text-white font-semibold px-8 py-4 rounded-full text-lg hover:border-yellow-400 hover:text-yellow-400 transition-colors"
            >
              Kursları İncele →
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-yellow-400/20 bg-yellow-400/5">
          <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="text-3xl md:text-4xl font-black text-yellow-400">{s.n}</div>
                <div className="text-gray-500 text-sm mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÖN KAYIT ── */}
      <section className="bg-black py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
              Kayıtlar Açık
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-3">Ön Kayıt</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {onkayitlar.map((k) => (
              <div
                key={k.id}
                className="bg-gray-950 border border-yellow-400/25 rounded-2xl p-6 md:p-8 hover:border-yellow-400/60 transition-all hover:-translate-y-1 group flex flex-col"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-block bg-yellow-400 text-black text-xs font-black px-2.5 py-1 rounded tracking-wider">
                    {k.badge}
                  </span>
                  {k.acik && (
                    <span className="flex items-center gap-1.5 text-xs text-green-400 font-semibold">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      Kayıt Açık
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-yellow-400 transition-colors">
                  {k.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{k.desc}</p>
                <Link
                  href="/on-kayit"
                  className="mt-6 block text-center bg-yellow-400 text-black font-bold py-3 rounded-full text-sm hover:bg-yellow-300 transition-all hover:scale-105"
                >
                  Ön Kayıt Yaptır →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KURSLAR ── */}
      <section className="bg-gray-950 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
              Eğitim Programları
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-3">Kurs Seviyeleri</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {courses.map((c) => (
              <div
                key={c.level}
                className="bg-black border border-gray-800 rounded-2xl p-6 md:p-8 hover:border-yellow-400/50 transition-all group"
              >
                <div className="text-4xl mb-5">{c.icon}</div>
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
                  {c.tag}
                </span>
                <h3 className="text-white text-xl font-bold mt-1.5 mb-3">{c.level}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{c.desc}</p>
                <Link href="/kurslar" className="text-yellow-400 text-sm font-semibold hover:underline">
                  Detaylar →
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/kurslar"
              className="inline-block border border-yellow-400/40 text-yellow-400 px-8 py-3 rounded-full text-sm font-bold hover:bg-yellow-400/10 transition-colors"
            >
              Tüm Kursları Gör
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOTOĞRAFLAR ── */}
      <section className="bg-black py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Galeri</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-3">Kursumuzdan Kareler</h2>
            <p className="text-gray-500 mt-3 text-sm">Öğrencilerimiz ve öğretmenlerimizle dolu anlar</p>
          </div>

          {/* Mobil: tek kolon yığını. Desktop: 4 kolon, büyük sol kart */}
          <div className="hidden md:grid md:grid-cols-4 gap-3" style={{ gridTemplateRows: "200px 200px" }}>
            <div className="col-span-2 row-span-2 bg-gray-950 border border-yellow-400/15 rounded-2xl flex items-center justify-center hover:border-yellow-400/40 transition-all group">
              <div className="text-center">
                <div className="text-5xl mb-2">📸</div>
                <p className="text-gray-700 text-xs group-hover:text-gray-500 transition-colors">
                  Fotoğraf yakında eklenecek
                </p>
              </div>
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-950 border border-yellow-400/10 rounded-2xl flex items-center justify-center hover:border-yellow-400/30 transition-all"
              >
                <span className="text-gray-700 text-sm">📷</span>
              </div>
            ))}
          </div>

          {/* Mobil galeri placeholder */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            <div className="col-span-2 h-44 bg-gray-950 border border-yellow-400/15 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-gray-700 text-xs">Fotoğraf yakında eklenecek</p>
              </div>
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 bg-gray-950 border border-yellow-400/10 rounded-2xl flex items-center justify-center"
              >
                <span className="text-gray-700 text-sm">📷</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-yellow-400 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-black mb-4 md:mb-5">
            Kontenjan Dolmadan Yerinizi Ayırtın
          </h2>
          <p className="text-black/60 text-base md:text-lg mb-8 md:mb-10">
            Yaz kursu ve yeni dönem ön kayıtları şu an açık. Erken kayıt avantajını kaçırmayın.
          </p>
          <Link
            href="/on-kayit"
            className="inline-block bg-black text-yellow-400 font-bold px-10 py-4 rounded-full text-lg hover:bg-gray-900 transition-all hover:scale-105"
          >
            Ön Kayıt Yaptır →
          </Link>
        </div>
      </section>
    </>
  );
}
