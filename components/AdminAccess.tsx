"use client";

import { useEffect, useRef } from "react";
import LoginForm from "@/app/nvd-panel/giris/LoginForm";

export default function AdminAccess() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const restoreScroll = () => {
      document.body.style.overflow = "";
    };

    dialog.addEventListener("close", restoreScroll);
    return () => {
      dialog.removeEventListener("close", restoreScroll);
      restoreScroll();
    };
  }, []);

  const openDialog = () => {
    document.body.style.overflow = "hidden";
    dialogRef.current?.showModal();
  };

  const closeDialog = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        aria-label="Yetkili personel girişi"
        title="Yetkili personel girişi"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-800 transition-colors hover:bg-yellow-400/5 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70"
      >
        <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="owner-login-title"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-yellow-400/20 bg-gray-950 p-0 text-white shadow-2xl shadow-black/80 backdrop:bg-black/85 backdrop:backdrop-blur-sm open:animate-fade-in-up"
      >
        <div className="relative overflow-hidden px-6 py-7 sm:px-8 sm:py-8">
          <div aria-hidden="true" className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl" />
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Giriş penceresini kapat"
            className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-gray-400 transition-colors hover:border-yellow-400/30 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70"
          >
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>

          <div className="relative mb-7 pr-12">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-yellow-400">Nev-Dil</span>
            <h2 id="owner-login-title" className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Yetkili girişi
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Kayıtları ve fotoğraf galerisini yönetmek için giriş yapın.
            </p>
          </div>

          <div className="relative">
            <LoginForm />
          </div>

          <p className="relative mt-6 border-t border-white/5 pt-5 text-center text-[11px] leading-5 text-gray-700">
            Bu alan yalnızca Nev-Dil yetkili personeli içindir.
          </p>
        </div>
      </dialog>
    </>
  );
}
