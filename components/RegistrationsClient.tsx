"use client";

import { useState, useMemo, useTransition } from "react";
import type { Registration } from "@/lib/storage";
import { deleteRegistrationAction } from "@/app/nvd-panel/actions";

function formatWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("90") && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith("0") && cleaned.length === 11) return "9" + cleaned;
  if (cleaned.length === 10) return "90" + cleaned;
  return cleaned;
}

export default function RegistrationsClient({
  registrations,
}: {
  registrations: Registration[];
}) {
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return registrations;
    return registrations.filter((r) =>
      [r.name, r.phone, r.program, r.email, r.ageGroup]
        .filter(Boolean)
        .some((field) => field.toLocaleLowerCase("tr").includes(q))
    );
  }, [query, registrations]);

  function handleDelete(r: Registration) {
    if (!confirm(`"${r.name}" kaydını silmek istediğinize emin misiniz?`)) return;
    setDeletingId(r.id);
    startTransition(async () => {
      const res = await deleteRegistrationAction(r.id);
      if (!res.success) {
        alert(res.message || "Silinemedi.");
      }
      setDeletingId(null);
    });
  }

  return (
    <>
      {/* Arama + sayaç */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <svg
            className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="İsim, telefon, program veya e-posta ara..."
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>
        <div className="bg-yellow-400/10 border border-yellow-400/25 rounded-xl px-4 py-2 text-center">
          <div className="text-2xl font-black text-yellow-400 leading-none">
            {filtered.length}
          </div>
          <div className="text-gray-500 text-xs mt-0.5">
            {query ? "Sonuç" : "Kayıt"}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-700">
          <div className="text-5xl mb-3">{query ? "🔍" : "📭"}</div>
          <p className="text-sm">
            {query ? "Aramanızla eşleşen kayıt yok." : "Henüz ön kayıt yok."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const waNumber = formatWhatsApp(r.phone);
            const waText = encodeURIComponent(
              `Merhaba ${r.name}, Nev-Dil Yabancı Dil Kursu ön kaydınızı aldık. En kısa sürede sizi bilgilendireceğiz.`
            );
            const isDeleting = deletingId === r.id && isPending;
            return (
              <div
                key={r.id}
                className={`bg-gray-950 border border-gray-800 rounded-2xl p-5 hover:border-yellow-400/25 transition-all ${
                  isDeleting ? "opacity-40 pointer-events-none" : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Sol: Bilgiler */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-white font-bold text-lg leading-tight">
                        {r.name}
                      </span>
                      <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-md">
                        {r.program}
                      </span>
                      {r.ageGroup && (
                        <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-md">
                          {r.ageGroup}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={`tel:${r.phone}`}
                        className="text-yellow-400 font-semibold text-sm hover:underline"
                      >
                        📞 {r.phone}
                      </a>
                      {r.email && (
                        <a
                          href={`mailto:${r.email}`}
                          className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
                        >
                          ✉️ {r.email}
                        </a>
                      )}
                    </div>

                    {r.message && (
                      <p className="text-gray-600 text-sm mt-2 italic leading-relaxed">
                        &ldquo;{r.message}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Sağ: Tarih + aksiyonlar */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-gray-700 text-xs whitespace-nowrap">
                      {new Date(r.timestamp).toLocaleString("tr-TR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${waNumber}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </a>
                      <button
                        onClick={() => handleDelete(r)}
                        disabled={isDeleting}
                        aria-label={`${r.name} kaydını sil`}
                        className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
