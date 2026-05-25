"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/kurslar", label: "Kurslar" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-yellow-400/30">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Nev-Dil Logo"
            width={42}
            height={42}
            className="rounded-full group-hover:opacity-90 transition-opacity"
          />
          <span className="flex items-center gap-0 text-2xl font-black tracking-tight">
            <span className="text-yellow-400 group-hover:text-yellow-300 transition-colors">NEV</span>
            <span className="text-white font-light">-DİL</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "text-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/on-kayit"
            className="bg-yellow-400 text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-yellow-300 transition-all hover:scale-105"
          >
            Ön Kayıt Yaptır
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-1"
          aria-label="Menü"
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-yellow-400/20 px-4 py-5 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium transition-colors ${
                pathname === l.href ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/on-kayit"
            onClick={() => setOpen(false)}
            className="bg-yellow-400 text-black px-5 py-3 rounded-full text-sm font-bold text-center hover:bg-yellow-300 transition-colors"
          >
            Ön Kayıt Yaptır
          </Link>
        </div>
      )}
    </nav>
  );
}
