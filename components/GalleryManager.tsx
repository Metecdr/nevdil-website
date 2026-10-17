"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MAX_CAPTION_LENGTH, MAX_PHOTOS, MAX_UPLOAD_BYTES, photoUrl, type Gallery, type GalleryPhoto } from "@/lib/gallery-types";

const inputClass = "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 placeholder:text-gray-500";
const buttonClass = "min-h-11 rounded-xl border border-white/15 px-3 py-2 text-sm transition-colors hover:border-yellow-400 hover:text-yellow-300 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-yellow-400";

export default function GalleryManager({ initial }: { initial: Gallery }) {
  const [gallery, setGallery] = useState(initial);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null);
  const [expired, setExpired] = useState(false);
  const [deleting, setDeleting] = useState<GalleryPhoto | null>(null);
  const uploadForm = useRef<HTMLFormElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);
  useEffect(() => { if (deleting) dialog.current?.showModal(); else dialog.current?.close(); }, [deleting]);

  async function reload() {
    const response = await fetch("/api/owner/gallery", { cache: "no-store" });
    if (response.status === 401) setExpired(true);
    if (response.ok) setGallery(await response.json());
  }

  async function request(method: "POST" | "PATCH", body: FormData | Record<string, unknown>, message: string) {
    setBusy(true); setNotice(null);
    try {
      const response = await fetch("/api/owner/gallery", {
        method, body: body instanceof FormData ? body : JSON.stringify({ ...body, revision: gallery.revision }),
        headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(45_000),
      });
      if (response.status === 401) setExpired(true);
      if (response.status === 413) throw new Error("Dosya yükleme sınırını aşıyor. Daha küçük bir fotoğraf deneyin.");
      const result = await response.json().catch(() => ({ error: "Sunucuya ulaşılamadı. Biraz sonra tekrar deneyin." }));
      if (!response.ok) throw new Error(result.error || "İşlem tamamlanamadı.");
      setGallery(result);
      setNotice({ text: message, error: false });
      return true;
    } catch (error) {
      setNotice({ error: true, text: error instanceof Error && error.name !== "TimeoutError" && error.name !== "TypeError"
        ? error.message : "Bağlantı kesildi. Tekrar işlem yapmadan önce listeyi yenileyip fotoğrafı kontrol edin." });
      await reload().catch(() => {});
      return false;
    } finally { setBusy(false); }
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    const form = new FormData(event.currentTarget);
    if (await request("POST", form, "Fotoğraf yayınlandı. Ana sayfada artık görünüyor.")) {
      uploadForm.current?.reset(); setFile(null); setPreview(null);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const ids = gallery.photos.map((p) => p.id);
    [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
    await request("PATCH", { action: "reorder", ids }, "Fotoğrafların sırası güncellendi.");
  }

  return <>
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">Kurumdan hayata</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Fotoğraf galerisi</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">Sınıflarınızı, etkinliklerinizi ve birlikte öğrendiğiniz anları paylaşın. Değişiklikler ana sayfaya hemen yansır.</p>
      </div>
      <div className="rounded-2xl border border-white/10 px-5 py-3"><span className="text-2xl font-semibold text-yellow-400">{gallery.photos.length}</span><span className="ml-2 text-xs text-gray-400">/ {MAX_PHOTOS} fotoğraf</span></div>
    </div>

    <div role="status" aria-live="polite" className="scroll-mt-5">
      {notice && <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${notice.error ? "border-red-400/30 bg-red-400/10 text-red-200" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"}`}>{notice.text}</div>}
      {expired && <p className="mb-6 text-yellow-300">Oturumunuz sona erdi. <Link href="/nvd-panel/giris" className="underline">Yeniden giriş yapın.</Link></p>}
    </div>

    <div className="grid items-start gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-white/10 bg-[#13151a] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Yeni bir kare ekleyin</h2>
        <p className="mb-5 mt-2 text-xs leading-5 text-gray-400">JPG, PNG veya WebP · En fazla 8 MB<br />Fotoğrafınız otomatik olarak küçültülür.</p>
        <form ref={uploadForm} onSubmit={upload}>
          <fieldset disabled={busy || expired || gallery.photos.length >= MAX_PHOTOS} className="space-y-5 disabled:opacity-60">
            {preview && file && <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black"><Image unoptimized src={preview} alt="Seçilen fotoğrafın önizlemesi" fill className="object-contain" /></div>}
            <div><label htmlFor="photo" className="mb-2 block text-sm font-medium">Fotoğraf</label>
              <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" required
                className="block w-full text-xs text-gray-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-yellow-400 file:px-3 file:py-3 file:font-semibold file:text-black"
                onChange={(event) => {
                  const selected = event.target.files?.[0] || null;
                  setNotice(null); setFile(null); setPreview(null);
                  if (selected && (selected.size > MAX_UPLOAD_BYTES || !["image/jpeg", "image/png", "image/webp"].includes(selected.type))) {
                    setNotice({ text: "En fazla 8 MB boyutunda JPG, PNG veya WebP fotoğraf seçin.", error: true });
                    event.target.value = ""; return;
                  }
                  setFile(selected);
                  if (selected) setPreview(URL.createObjectURL(selected));
                }} /></div>
            <div><label htmlFor="caption" className="mb-2 block text-sm font-medium">Kısa açıklama</label>
              <textarea id="caption" name="caption" required maxLength={MAX_CAPTION_LENGTH} rows={3} className={inputClass} placeholder="Örneğin: Junior grubumuzla renkleri öğreniyoruz." />
              <p className="mt-2 text-xs leading-5 text-gray-500">Fotoğrafın altında görünür. En fazla {MAX_CAPTION_LENGTH} karakter.</p></div>
            <label className="flex items-start gap-3 text-xs leading-5 text-gray-300">
              <input name="consent" value="yes" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-yellow-400" />
              Bu fotoğrafın web sitesinde paylaşılması için gerekli izinlere sahibim.
            </label>
            <button disabled={!file} className="min-h-12 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black hover:bg-yellow-300 disabled:opacity-40">{busy ? "İşlem yapılıyor…" : "Fotoğrafı yayınla"}</button>
          </fieldset>
        </form>
        <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-gray-400">İlk fotoğraf galeri kapağı olur. Okları kullanarak sırasını değiştirebilirsiniz.</p>
      </aside>

      <section aria-label="Yayındaki fotoğraflar" aria-busy={busy}>
        <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-semibold">Yayındaki fotoğraflar</h2>
          <button disabled={busy} className={buttonClass} onClick={async () => {
            setBusy(true); try { await reload(); setNotice({ text: "Liste yenilendi.", error: false }); }
            catch { setNotice({ text: "Liste yenilenemedi. Bağlantınızı kontrol edin.", error: true }); } finally { setBusy(false); }
          }}>Yenile</button>
        </div>
        {gallery.photos.length === 0 ? <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-8 text-center">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 text-3xl text-yellow-400" aria-hidden="true">+</span>
          <h3 className="text-lg font-semibold">İlk kareyle başlayın</h3><p className="mt-3 max-w-xs text-sm leading-6 text-gray-400">Henüz fotoğraf yok. Bir fotoğraf seçip yayınladığınızda galeriniz burada oluşacak.</p>
        </div> : <div className="grid gap-5 sm:grid-cols-2">
          {gallery.photos.map((photo, index) => <article key={`${photo.id}-${gallery.revision}`} className="overflow-hidden rounded-2xl border border-white/10 bg-[#13151a]">
            <div className="relative aspect-[4/3] bg-black"><Image unoptimized src={photoUrl(photo.id)} alt={photo.caption} fill sizes="(max-width: 640px) 100vw, 400px" className="object-contain" />
              <span className="absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-yellow-300">{index === 0 ? "Kapak fotoğrafı" : `${index + 1}. fotoğraf`}</span>
            </div>
            <fieldset disabled={busy || expired} className="p-4 disabled:opacity-60">
              <form onSubmit={async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); await request("PATCH", { action: "caption", id: photo.id, caption: form.get("caption") }, "Açıklama güncellendi."); }}>
                <label htmlFor={`caption-${photo.id}`} className="mb-2 block text-xs font-medium text-gray-400">Fotoğraf açıklaması</label>
                <textarea id={`caption-${photo.id}`} name="caption" defaultValue={photo.caption} maxLength={MAX_CAPTION_LENGTH} required rows={2} className={inputClass} />
                <button className="mt-2 min-h-11 text-xs font-semibold text-yellow-400 hover:text-yellow-200">Açıklamayı kaydet</button>
              </form>
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                <div className="flex gap-2"><button disabled={index === 0} onClick={() => move(index, -1)} aria-label={`${index + 1}. fotoğrafı öne al`} className={buttonClass}>←</button>
                  <button disabled={index === gallery.photos.length - 1} onClick={() => move(index, 1)} aria-label={`${index + 1}. fotoğrafı arkaya al`} className={buttonClass}>→</button></div>
                <button onClick={() => setDeleting(photo)} className={`${buttonClass} text-red-300`}>Sil</button>
              </div>
            </fieldset>
          </article>)}
        </div>}
      </section>
    </div>

    <dialog ref={dialog} onCancel={(event) => { if (busy) event.preventDefault(); else setDeleting(null); }} className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl border border-white/15 bg-[#17191f] p-6 text-white shadow-2xl backdrop:bg-black/80" aria-labelledby="delete-title">
      <h2 id="delete-title" className="text-xl font-semibold">Fotoğraf silinsin mi?</h2>
      <p className="mt-3 break-words text-sm leading-6 text-gray-300">“{deleting?.caption}” galeriden ve ana sayfadan kaldırılacak. Bu işlem geri alınamaz.</p>
      {notice?.error && <p role="alert" className="mt-3 text-sm text-red-300">{notice.text}</p>}
      <div className="mt-6 flex justify-end gap-3"><button autoFocus disabled={busy} onClick={() => setDeleting(null)} className={buttonClass}>Vazgeç</button>
        <button disabled={busy} className="rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50" onClick={async () => {
          if (deleting && await request("PATCH", { action: "delete", id: deleting.id }, "Fotoğraf silindi.")) setDeleting(null);
        }}>{busy ? "Siliniyor…" : "Fotoğrafı sil"}</button></div>
    </dialog>
  </>;
}
