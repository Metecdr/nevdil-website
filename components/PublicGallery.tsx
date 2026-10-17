import Image from "next/image";
import { getGallery } from "@/lib/gallery-store";
import { photoUrl } from "@/lib/gallery-types";

export default async function PublicGallery() {
  const gallery = await getGallery().catch(() => {
    console.error("[gallery] Public gallery could not be loaded.");
    return null;
  });
  // A gallery failure must not bring down the registration website.
  // Keep the section visible while the owners prepare the first photographs.
  const photos = gallery?.photos ?? [];
  return <section id="galeri" className="scroll-mt-20 bg-black py-16 md:scroll-mt-24 md:py-24">
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-14">
        <div><span className="text-xs font-black uppercase tracking-widest text-yellow-400">Galeri</span>
          <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">Kursumuzdan Kareler</h2></div>
        <p className="max-w-xs text-sm leading-6 text-gray-400">Birlikte öğreniyor, keşfediyor ve güzel anılar biriktiriyoruz.</p>
      </div>
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => <figure key={photo.id} className={`overflow-hidden rounded-2xl border border-white/10 bg-gray-950 ${index === 0 ? "sm:col-span-2" : ""}`}>
            <div className={`relative ${index === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
              <Image unoptimized src={photoUrl(photo.id)} alt={photo.caption} fill className="object-contain" sizes={index === 0 ? "(max-width: 640px) 100vw, 750px" : "(max-width: 640px) 100vw, 380px"} />
            </div>
            <figcaption className="break-words px-5 py-4 text-sm leading-6 text-gray-300">{photo.caption}</figcaption>
          </figure>)}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-yellow-400/20 bg-gray-950 px-6 py-10 sm:px-10 md:py-14">
          <div aria-hidden="true" className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl" />
          <div aria-hidden="true" className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(234,179,8,0.18)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            <div aria-hidden="true" className="relative mb-7 h-24 w-28">
              <div className="absolute left-0 top-3 h-16 w-20 -rotate-6 rounded-xl border border-white/10 bg-gray-900" />
              <div className="absolute right-0 top-0 h-20 w-24 rotate-3 rounded-xl border border-yellow-400/35 bg-black p-3 shadow-2xl shadow-yellow-400/10">
                <div className="relative h-full rounded-lg bg-gradient-to-br from-yellow-400/30 via-yellow-400/10 to-transparent">
                  <span className="absolute right-2 top-1 h-3 w-3 rounded-full bg-yellow-300" />
                  <span className="absolute bottom-1 left-1 h-8 w-16 [clip-path:polygon(0_100%,35%_35%,55%_65%,75%_20%,100%_100%)] bg-yellow-400/60" />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-black text-white md:text-3xl">Yeni kareler çok yakında</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400 md:text-base">
              Sınıflarımızdan, etkinliklerimizden ve öğrencilerimizin güzel anlarından seçtiğimiz fotoğrafları burada paylaşacağız.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-300/90">
              {["Dersler", "Etkinlikler", "Başarılar"].map((label) => (
                <span key={label} className="rounded-full border border-yellow-400/20 bg-yellow-400/5 px-3 py-1.5">{label}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </section>;
}
