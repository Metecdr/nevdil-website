import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İletişim | Nev-Dil Yabancı Dil Kursu",
  description:
    "Nev-Dil Yabancı Dil Kursu iletişim bilgileri. Nevşehir, 15 Temmuz Mahallesi. WhatsApp veya telefonla ulaşın.",
};

const contactItems = [
  {
    icon: "📍",
    label: "Adres",
    value: "15 Temmuz Mah. 154. Sok. No:6B, 2000 Evler Polis Karakolu Karşısı, Merkez/Nevşehir",
  },
  { icon: "📞", label: "Telefon", value: "0537 428 76 40" },
  {
    icon: "🕐",
    label: "Çalışma Saatleri",
    value: "Hafta içi 09:00–20:00 | Cumartesi 10:00–17:00",
  },
];

export default function IletisimPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-24 pb-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
            Bize Ulaşın
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mt-3 mb-4">
            İletişim
          </h1>
          <p className="text-gray-400 text-lg">
            Sormak istedikleriniz için arayın ya da WhatsApp&apos;tan yazın.
            Ön kayıt için aşağıdaki butonu kullanın.
          </p>
        </div>
      </section>

      <section className="bg-black pb-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* İletişim Bilgileri */}
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-yellow-400 font-bold mb-6 text-xs uppercase tracking-widest">
                İletişim Bilgileri
              </h3>
              <div className="space-y-6">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="text-2xl mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      <p className="text-white text-sm leading-relaxed">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp + Ön Kayıt */}
            <div className="flex flex-col gap-5">
              <div className="bg-yellow-400 rounded-2xl p-7">
                <h3 className="text-black font-black text-xl mb-2">
                  WhatsApp ile Yazın
                </h3>
                <p className="text-black/70 text-sm mb-5 leading-relaxed">
                  En hızlı iletişim yöntemi. Mesajınıza en kısa sürede dönüş yaparız.
                </p>
                <a
                  href="https://wa.me/905457416609?text=Merhaba%2C%20bilgi%20almak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-black text-yellow-400 font-bold py-3.5 rounded-full text-sm hover:bg-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp&apos;tan Yaz
                </a>
              </div>

              <div className="bg-gray-950 border border-yellow-400/20 rounded-2xl p-7 flex flex-col items-center text-center">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-white font-bold text-lg mb-2">Ön Kayıt Formu</h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                  Kayıt yaptırmak için ön kayıt sayfamızı kullanın. Sizi arayalım.
                </p>
                <Link
                  href="/on-kayit"
                  className="bg-yellow-400 text-black font-bold px-7 py-3 rounded-full text-sm hover:bg-yellow-300 transition-all hover:scale-105"
                >
                  Ön Kayıt Yaptır →
                </Link>
              </div>

              {/* Harita placeholder */}
              <div className="bg-gray-950 border border-gray-800 rounded-2xl h-40 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-1">🗺️</div>
                  <p className="text-gray-600 text-xs">Harita yakında eklenecek</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
