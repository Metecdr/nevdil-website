import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Yönetim Girişi | Nev-Dil",
  robots: { index: false, follow: false },
};

export default function AdminGirisPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-4xl font-black mb-2 tracking-tight">
            <span className="text-yellow-400">NEV</span>
            <span className="text-white">-DİL</span>
          </div>
          <p className="text-gray-600 text-sm">Yönetim Paneli</p>
        </div>

        {/* Kart */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-7 shadow-2xl">
          <LoginForm />
        </div>

        {/* Alt not */}
        <p className="text-center text-gray-700 text-xs mt-6">
          Nev-Dil Yabancı Dil Kursu &mdash; Yetkili Personel Girişi
        </p>
      </div>
    </div>
  );
}
