import Image from "next/image";
import { getGallery } from "@/lib/gallery-store";
import { photoUrl } from "@/lib/gallery-types";

export default async function PublicGallery() {
  const gallery = await getGallery().catch(() => {
    console.error("[gallery] Public gallery could not be loaded.");
    return null;
  });
  // A gallery failure must not bring down the registration website.
  if (!gallery?.photos.length) return null;
  return <section id="galeri" className="scroll-mt-20 bg-black py-16 md:scroll-mt-24 md:py-24">
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-14">
        <div><span className="text-xs font-black uppercase tracking-widest text-yellow-400">Galeri</span>
          <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">Kursumuzdan Kareler</h2></div>
        <p className="max-w-xs text-sm leading-6 text-gray-400">Birlikte öğreniyor, keşfediyor ve güzel anılar biriktiriyoruz.</p>
      </div>
      <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.photos.map((photo, index) => <figure key={photo.id} className={`overflow-hidden rounded-2xl border border-white/10 bg-gray-950 ${index === 0 ? "sm:col-span-2" : ""}`}>
          <div className={`relative ${index === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
            <Image unoptimized src={photoUrl(photo.id)} alt={photo.caption} fill className="object-contain" sizes={index === 0 ? "(max-width: 640px) 100vw, 750px" : "(max-width: 640px) 100vw, 380px"} />
          </div>
          <figcaption className="break-words px-5 py-4 text-sm leading-6 text-gray-300">{photo.caption}</figcaption>
        </figure>)}
      </div>
    </div>
  </section>;
}
