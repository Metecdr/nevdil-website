import type { Metadata } from "next";
import Link from "next/link";
import OnKayitForm from "@/components/OnKayitForm";

export const metadata: Metadata = {
  title: "Ön Kayıt | Nev-Dil Yabancı Dil Kursu",
  description:
    "Nev-Dil Yabancı Dil Kursu'na ön kayıt yaptırın. Yaz kursu, YDS hazırlık, junior grupları ve daha fazlası için yerinizi ayırtın.",
};

const programs = [
  { icon: "📚", label: "YDS Hazırlık" },
  { icon: "💼", label: "İş İngilizcesi" },
  { icon: "🎒", label: "Junior Grupları" },
  { icon: "🌟", label: "İlkokul" },
];

export default function OnKayitPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Dot grid arka plan */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(234,179,8,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-lg mx-auto px-4 pt-12 pb-20">
        {/* Başlık */}
        <div className="text-center mb-10 animate-fade-in-up">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Nev-Dil Logo"
            width={64}
            height={64}
            className="rounded-full mx-auto mb-4"
          />
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
            Nev-Dil Yabancı Dil Kursu
          </span>
          <h1 className="text-4xl font-black text-white mt-2 mb-2">Ön Kayıt</h1>
          <p className="text-gray-500 text-sm">
            Formu doldurun, sizi en kısa sürede arayalım.
          </p>
        </div>

        {/* Program rozetleri */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 animate-fade-in-up delay-100">
          {programs.map((p) => (
            <span
              key={p.label}
              className="flex items-center gap-1.5 bg-gray-950 border border-yellow-400/20 text-gray-300 text-xs px-3 py-1.5 rounded-full"
            >
              <span>{p.icon}</span>
              {p.label}
            </span>
          ))}
        </div>

        {/* Form kartı */}
        <div className="bg-gray-950 border border-yellow-400/20 rounded-2xl p-7 animate-fade-in-up delay-200">
          <OnKayitForm />
        </div>

        {/* Alt link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Soru mu var?{" "}
          <Link href="/iletisim" className="text-yellow-400 hover:underline">
            Bize ulaşın
          </Link>
        </p>
      </div>
    </div>
  );
}
