"use client";

import { useActionState } from "react";
import { submitForm } from "@/app/actions";
import Link from "next/link";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitForm, null);

  if (state?.success) {
    return (
      <div className="bg-gray-950 border border-yellow-400/30 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[480px] text-center animate-fade-in">
        <div className="text-7xl mb-5 animate-float">🎉</div>
        <h2 className="text-white font-black text-2xl mb-3">Başvurunuz Alındı!</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
          {state.message}
        </p>
        <Link
          href="/"
          className="border border-yellow-400/50 text-yellow-400 text-sm font-bold px-6 py-3 rounded-full hover:bg-yellow-400/10 transition-all"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="bg-gray-950 border border-yellow-400/20 rounded-2xl p-8"
    >
      <h2 className="text-white font-bold text-xl mb-7">Ön Kayıt Formu</h2>

      {state?.success === false && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm">
          {state.message}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="text-gray-400 text-sm font-medium block mb-1.5">
            Ad Soyad <span className="text-yellow-400">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Adınız ve soyadınız"
            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm font-medium block mb-1.5">
            Telefon <span className="text-yellow-400">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            required
            placeholder="0XXX XXX XX XX"
            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm font-medium block mb-1.5">
            E-posta
          </label>
          <input
            name="email"
            type="email"
            placeholder="ornek@email.com"
            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm font-medium block mb-1.5">
            Başvurmak İstediğiniz Program
          </label>
          <select
            name="program"
            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
          >
            <option value="">Seçiniz...</option>
            <option>Yaz Kursu Ön Kayıt (Haziran–Ağustos)</option>
            <option>Yeni Dönem Kaydı (Güz)</option>
            <option>YDS Hazırlık Grubu</option>
            <option>İş İngilizcesi</option>
            <option>Junior Grubu (Ortaokul & Lise)</option>
            <option>İlkokul Grubu</option>
            <option>Henüz bilmiyorum</option>
          </select>
        </div>

        <div>
          <label className="text-gray-400 text-sm font-medium block mb-1.5">
            Mesajınız
          </label>
          <textarea
            name="message"
            rows={4}
            placeholder="Sormak istedikleriniz..."
            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-yellow-400 text-black font-bold py-4 rounded-full hover:bg-yellow-300 transition-all hover:scale-[1.02] text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isPending ? "Gönderiliyor..." : "Ön Kayıt Talebini Gönder →"}
        </button>
      </div>
    </form>
  );
}
