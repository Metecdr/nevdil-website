import { getRegistrations } from "@/lib/storage";
import { logoutAction } from "./giris/actions";
import RegistrationsClient from "@/components/RegistrationsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Nev-Dil",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  // storage.getRegistrations() en yeni kayıt en üstte döner.
  const registrations = getRegistrations();

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Başlık */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <div className="text-2xl font-black tracking-tight">
              <span className="text-yellow-400">NEV</span>
              <span className="text-white">-DİL</span>
              <span className="text-gray-500 font-normal text-lg ml-2">Admin</span>
            </div>
            <p className="text-gray-600 text-sm mt-0.5">Ön Kayıt Başvuruları</p>
          </div>

          {/* Çıkış */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="bg-gray-900 border border-gray-800 hover:border-red-500/50 hover:text-red-400 text-gray-500 text-xs font-semibold px-4 py-3 rounded-xl transition-colors"
            >
              Çıkış
            </button>
          </form>
        </div>

        {/* Arama + liste + sil (client) */}
        <RegistrationsClient registrations={registrations} />
      </div>
    </div>
  );
}
