import Link from "next/link";
import Image from "next/image";
import { logoutAction } from "@/app/nvd-panel/giris/actions";

export default function AdminShell({ active, children }: { active: "registrations" | "gallery"; children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0b0c0f] text-white">
    <header className="border-b border-white/10 bg-black/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link href="/nvd-panel" className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-yellow-400">
          <Image src="/logo.png" alt="Nev-Dil" width={42} height={42} className="rounded-full" />
          <div><span className="text-lg font-black tracking-tight">NEV<span className="text-yellow-400">-DİL</span></span>
            <span className="mt-0.5 block text-xs text-gray-400">Kurum yönetimi</span></div>
        </Link>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-3 text-sm text-gray-300 hover:text-yellow-300">Siteyi gör ↗</a>
          <form action={logoutAction}><button className="rounded-xl border border-white/15 px-4 py-3 text-sm hover:border-yellow-400 focus-visible:outline-2 focus-visible:outline-yellow-400">Çıkış yap</button></form>
        </div>
      </div>
    </header>
    <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
      <nav aria-label="Yönetim menüsü" className="mb-9 flex gap-2 border-b border-white/10">
        {([{ key: "registrations", href: "/nvd-panel", label: "Ön kayıtlar" }, { key: "gallery", href: "/nvd-panel/galeri", label: "Fotoğraf galerisi" }] as const).map((item) =>
          <Link key={item.key} href={item.href} aria-current={active === item.key ? "page" : undefined}
            className={`border-b-2 px-4 py-4 text-sm font-semibold transition-colors ${active === item.key ? "border-yellow-400 text-yellow-400" : "border-transparent text-gray-400 hover:text-white"}`}>{item.label}</Link>)}
      </nav>
      {children}
    </div>
  </div>;
}
