"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  MAX_BADGE_LENGTH,
  MAX_CAMPAIGNS,
  MAX_DESCRIPTION_LENGTH,
  MAX_PROGRAM_LENGTH,
  MAX_TITLE_LENGTH,
  type Campaign,
  type CampaignStore,
} from "@/lib/campaign-types";

const inputClass = "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400";
const buttonClass = "min-h-11 rounded-xl border border-white/15 px-3 py-2 text-sm transition-colors hover:border-yellow-400 hover:text-yellow-300 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-yellow-400";

export default function CampaignManager({ initial }: { initial: CampaignStore }) {
  const [store, setStore] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [expired, setExpired] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null);
  const [deleting, setDeleting] = useState<Campaign | null>(null);
  const addForm = useRef<HTMLFormElement>(null);
  const deleteDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (deleting) deleteDialog.current?.showModal();
    else deleteDialog.current?.close();
  }, [deleting]);

  async function reload() {
    const response = await fetch("/api/owner/campaigns", { cache: "no-store" });
    if (response.status === 401) setExpired(true);
    const result = await response.json().catch(() => ({ error: "Sunucu yanıtı okunamadı." }));
    if (!response.ok) throw new Error(result.error || "Liste yenilenemedi.");
    setStore(result);
  }

  async function request(method: "POST" | "PATCH", body: Record<string, unknown>, success: string) {
    setBusy(true); setNotice(null);
    try {
      const response = await fetch("/api/owner/campaigns", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, revision: store.revision }),
        signal: AbortSignal.timeout(20_000),
      });
      if (response.status === 401) setExpired(true);
      const result = await response.json().catch(() => ({ error: "Sunucuya ulaşılamadı." }));
      if (!response.ok) throw new Error(result.error || "İşlem tamamlanamadı.");
      setStore(result);
      setNotice({ text: success, error: false });
      return true;
    } catch (error) {
      setNotice({
        error: true,
        text: error instanceof Error && error.name !== "TimeoutError" && error.name !== "TypeError"
          ? error.message : "Bağlantı kesildi. Listeyi yenileyip işlemi kontrol edin.",
      });
      await reload().catch(() => {});
      return false;
    } finally { setBusy(false); }
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ok = await request("POST", {
      badge: form.get("badge"), title: form.get("title"), description: form.get("description"),
      programLabel: form.get("programLabel"), active: form.get("active") === "yes",
    }, "Yeni kayıt dönemi eklendi.");
    if (ok) addForm.current?.reset();
  }

  async function move(index: number, direction: -1 | 1) {
    const ids = store.campaigns.map((campaign) => campaign.id);
    [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
    await request("PATCH", { action: "reorder", ids }, "Kayıt dönemlerinin sırası güncellendi.");
  }

  return <>
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">Duyurudan başvuruya</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Kayıt dönemleri</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">Ana sayfadaki ön kayıt kartlarını ve formdaki dönemsel seçenekleri yönetin. Yayındaki değişiklikler siteye hemen yansır.</p>
      </div>
      <div className="rounded-2xl border border-white/10 px-5 py-3">
        <span className="text-2xl font-semibold text-yellow-400">{store.campaigns.filter((campaign) => campaign.active).length}</span>
        <span className="ml-2 text-xs text-gray-400">yayında · {store.campaigns.length}/{MAX_CAMPAIGNS} toplam</span>
      </div>
    </div>

    <div role="status" aria-live="polite">
      {notice && <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${notice.error ? "border-red-400/30 bg-red-400/10 text-red-200" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"}`}>{notice.text}</div>}
      {expired && <p className="mb-6 text-yellow-300">Oturumunuz sona erdi. <Link href="/nvd-panel/giris" className="underline">Yeniden giriş yapın.</Link></p>}
    </div>

    <div className="grid items-start gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-white/10 bg-[#13151a] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Yeni dönem ekleyin</h2>
        <p className="mb-5 mt-2 text-xs leading-5 text-gray-400">Kart metni ana sayfada; form seçeneği başvuru listesindeki dönemsel bölümde görünür.</p>
        <form ref={addForm} onSubmit={create}>
          <fieldset disabled={busy || expired || store.campaigns.length >= MAX_CAMPAIGNS} className="space-y-4 disabled:opacity-60">
            <Field label="Kısa etiket" name="badge" maxLength={MAX_BADGE_LENGTH} placeholder="Örn. YAZ KURSU" />
            <Field label="Kart başlığı" name="title" maxLength={MAX_TITLE_LENGTH} placeholder="Örn. Yaz Kursu Ön Kayıt" />
            <div><label htmlFor="new-description" className="mb-2 block text-sm font-medium">Kısa açıklama</label>
              <textarea id="new-description" name="description" required rows={4} maxLength={MAX_DESCRIPTION_LENGTH} className={inputClass} placeholder="Tarih, kontenjan ve kayıt bilgisini yazın." /></div>
            <Field label="Formdaki seçenek adı" name="programLabel" maxLength={MAX_PROGRAM_LENGTH} placeholder="Örn. Yaz Kursu (Haziran–Ağustos)" />
            <label className="flex items-start gap-3 text-xs leading-5 text-gray-300">
              <input name="active" value="yes" type="checkbox" defaultChecked className="mt-1 h-4 w-4 shrink-0 accent-yellow-400" />
              Eklenir eklenmez ana sayfada ve formda yayınla.
            </label>
            <button className="min-h-12 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black hover:bg-yellow-300 disabled:opacity-40">{busy ? "İşlem yapılıyor…" : "Dönemi ekle"}</button>
          </fieldset>
        </form>
      </aside>

      <section aria-label="Kayıt dönemleri" aria-busy={busy}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-semibold">Tüm dönemler</h2>
          <button disabled={busy} className={buttonClass} onClick={async () => {
            setBusy(true); setNotice(null);
            try { await reload(); setNotice({ text: "Liste yenilendi.", error: false }); }
            catch (error) { setNotice({ text: error instanceof Error ? error.message : "Liste yenilenemedi.", error: true }); }
            finally { setBusy(false); }
          }}>Yenile</button>
        </div>

        {store.campaigns.length === 0 ? <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-8 text-center">
          <span aria-hidden="true" className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 text-3xl text-yellow-400">+</span>
          <h3 className="text-lg font-semibold">İlk kayıt dönemini ekleyin</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">Dönem eklendiğinde ana sayfadaki ön kayıt alanı ve başvuru formu otomatik güncellenir.</p>
        </div> : <div className="space-y-5">
          {store.campaigns.map((campaign, index) => <article key={`${campaign.id}-${store.revision}`} className="rounded-2xl border border-white/10 bg-[#13151a] p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-yellow-400 px-2.5 py-1 text-[11px] font-black tracking-wider text-black">{campaign.badge}</span>
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${campaign.active ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/5 text-gray-400"}`}>{campaign.active ? "Yayında" : "Yayında değil"}</span>
              </div>
              <span className="text-xs text-gray-600">{index + 1}. sıra</span>
            </div>
            <form onSubmit={async (event) => {
              event.preventDefault(); const form = new FormData(event.currentTarget);
              await request("PATCH", { action: "update", id: campaign.id, badge: form.get("badge"), title: form.get("title"), description: form.get("description"), programLabel: form.get("programLabel") }, "Dönem bilgileri güncellendi.");
            }}>
              <fieldset disabled={busy || expired} className="grid gap-4 disabled:opacity-60 sm:grid-cols-2">
                <Field id={`badge-${campaign.id}`} label="Kısa etiket" name="badge" maxLength={MAX_BADGE_LENGTH} defaultValue={campaign.badge} />
                <Field id={`title-${campaign.id}`} label="Kart başlığı" name="title" maxLength={MAX_TITLE_LENGTH} defaultValue={campaign.title} />
                <div className="sm:col-span-2"><label htmlFor={`description-${campaign.id}`} className="mb-2 block text-xs font-medium text-gray-400">Kısa açıklama</label>
                  <textarea id={`description-${campaign.id}`} name="description" required rows={3} maxLength={MAX_DESCRIPTION_LENGTH} defaultValue={campaign.description} className={inputClass} /></div>
                <div className="sm:col-span-2"><Field id={`program-${campaign.id}`} label="Formdaki seçenek adı" name="programLabel" maxLength={MAX_PROGRAM_LENGTH} defaultValue={campaign.programLabel} /></div>
                <div className="sm:col-span-2"><button className="min-h-11 text-sm font-semibold text-yellow-400 hover:text-yellow-200">Metinleri kaydet</button></div>
              </fieldset>
            </form>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="flex gap-2">
                <button disabled={busy || expired || index === 0} onClick={() => move(index, -1)} aria-label={`${campaign.title} dönemini öne al`} className={buttonClass}>←</button>
                <button disabled={busy || expired || index === store.campaigns.length - 1} onClick={() => move(index, 1)} aria-label={`${campaign.title} dönemini arkaya al`} className={buttonClass}>→</button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button disabled={busy || expired} onClick={() => request("PATCH", { action: "toggle", id: campaign.id, active: !campaign.active }, campaign.active ? "Dönem yayından kaldırıldı; geçmiş başvurular korundu." : "Dönem yayına alındı.")} className={buttonClass}>{campaign.active ? "Yayından kaldır" : "Yayına al"}</button>
                <button disabled={busy || expired} onClick={() => setDeleting(campaign)} className={`${buttonClass} text-red-300`}>Kalıcı sil</button>
              </div>
            </div>
          </article>)}
        </div>}
      </section>
    </div>

    <dialog ref={deleteDialog} onCancel={(event) => { if (busy) event.preventDefault(); else setDeleting(null); }} className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl border border-white/15 bg-[#17191f] p-6 text-white shadow-2xl backdrop:bg-black/80" aria-labelledby="delete-campaign-title">
      <h2 id="delete-campaign-title" className="text-xl font-semibold">Kayıt dönemi kalıcı silinsin mi?</h2>
      <p className="mt-3 text-sm leading-6 text-gray-300">“{deleting?.title}” ana sayfadan, formdan ve panelden kaldırılacak. Daha önce alınmış başvurular korunur. Bu işlem geri alınamaz.</p>
      <div className="mt-6 flex justify-end gap-3">
        <button autoFocus disabled={busy} onClick={() => setDeleting(null)} className={buttonClass}>Vazgeç</button>
        <button disabled={busy} className="rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50" onClick={async () => {
          if (deleting && await request("PATCH", { action: "delete", id: deleting.id }, "Kayıt dönemi kalıcı olarak silindi.")) setDeleting(null);
        }}>{busy ? "Siliniyor…" : "Kalıcı sil"}</button>
      </div>
    </dialog>
  </>;
}

function Field({ label, name, maxLength, id = `new-${name}`, ...props }: {
  label: string; name: string; maxLength: number; id?: string; placeholder?: string; defaultValue?: string;
}) {
  return <div><label htmlFor={id} className="mb-2 block text-xs font-medium text-gray-400">{label}</label>
    <input id={id} name={name} required maxLength={maxLength} className={inputClass} {...props} /></div>;
}

