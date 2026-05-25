import { getRegistrations } from "@/lib/storage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin | Nev-Dil" };

// Her zaman sunucudan taze veri
export const dynamic = "force-dynamic";

export default function AdminPage() {
  const registrations = getRegistrations();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">
              <span className="text-yellow-400">NEV</span>-DİL Admin
            </h1>
            <p className="text-gray-500 text-sm mt-1">Ön Kayıt Başvuruları</p>
          </div>
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-2 text-center">
            <div className="text-2xl font-black text-yellow-400">{registrations.length}</div>
            <div className="text-gray-500 text-xs">Toplam Kayıt</div>
          </div>
        </div>

        {registrations.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            <div className="text-5xl mb-3">📭</div>
            <p>Henüz kayıt yok.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {registrations.map((r) => (
              <div
                key={r.id}
                className="bg-gray-950 border border-gray-800 rounded-2xl p-5 hover:border-yellow-400/30 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Sol: İsim + Program */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-lg">{r.name}</span>
                      <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded">
                        {r.program}
                      </span>
                      {r.ageGroup && (
                        <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">
                          {r.ageGroup}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <a
                        href={`tel:${r.phone}`}
                        className="text-yellow-400 font-semibold text-sm hover:underline"
                      >
                        📞 {r.phone}
                      </a>
                      {r.email && (
                        <a
                          href={`mailto:${r.email}`}
                          className="text-gray-400 text-sm hover:text-white"
                        >
                          ✉️ {r.email}
                        </a>
                      )}
                    </div>
                    {r.message && (
                      <p className="text-gray-500 text-sm mt-2 italic">
                        &ldquo;{r.message}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Sağ: Tarih */}
                  <div className="text-right text-xs text-gray-600 whitespace-nowrap">
                    {new Date(r.timestamp).toLocaleString("tr-TR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
