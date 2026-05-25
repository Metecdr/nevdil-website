"use client";

import { useActionState } from "react";
import { submitOnKayit } from "@/app/actions";
import Link from "next/link";

export default function OnKayitForm() {
  const [state, formAction, isPending] = useActionState(submitOnKayit, null);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 animate-fade-in">
        <div className="text-7xl mb-5 animate-float">🎉</div>
        <h2 className="text-white font-black text-3xl mb-3">Ön Kayıt Alındı!</h2>
        <p className="text-gray-400 text-base leading-relaxed mb-2 max-w-sm">
          Başvurunuz başarıyla iletildi. En kısa sürede
          <span className="text-yellow-400 font-semibold"> sizi arayacağız.</span>
        </p>
        <p className="text-gray-600 text-sm mb-10">Nev-Dil Yabancı Dil Kursu</p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/"
            className="bg-yellow-400 text-black font-bold px-7 py-3 rounded-full hover:bg-yellow-300 transition-all hover:scale-105 text-sm"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/kurslar"
            className="border border-yellow-400/40 text-yellow-400 font-bold px-7 py-3 rounded-full hover:bg-yellow-400/10 transition-all text-sm"
          >
            Kursları İncele
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state?.success === false && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {state.message}
        </div>
      )}

      {/* Ad Soyad */}
      <div>
        <label className="text-gray-400 text-sm font-medium block mb-1.5">
          Ad Soyad <span className="text-yellow-400">*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Adınız ve soyadınız"
          className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-yellow-400 transition-colors"
        />
      </div>

      {/* Telefon */}
      <div>
        <label className="text-gray-400 text-sm font-medium block mb-1.5">
          Telefon <span className="text-yellow-400">*</span>
        </label>
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="0XXX XXX XX XX"
          className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-yellow-400 transition-colors"
        />
      </div>

      {/* Program */}
      <div>
        <label className="text-gray-400 text-sm font-medium block mb-1.5">
          Başvurmak İstediğiniz Program <span className="text-yellow-400">*</span>
        </label>
        <select
          name="program"
          required
          className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
        >
          <option value="">Seçiniz...</option>
          <optgroup label="Dönemsel Kayıt">
            <option value="Yaz Kursu (Haziran–Ağustos)">Yaz Kursu (Haziran–Ağustos)</option>
            <option value="Güz Dönemi Kaydı">Güz Dönemi Kaydı</option>
          </optgroup>
          <optgroup label="Program">
            <option value="YDS Hazırlık Grubu">YDS Hazırlık Grubu</option>
            <option value="İş İngilizcesi">İş İngilizcesi</option>
            <option value="Junior Grubu (Ortaokul & Lise)">Junior Grubu (Ortaokul &amp; Lise)</option>
            <option value="İlkokul Grubu">İlkokul Grubu</option>
          </optgroup>
          <option value="Henüz bilmiyorum">Henüz bilmiyorum</option>
        </select>
      </div>

      {/* Yaş / Sınıf */}
      <div>
        <label className="text-gray-400 text-sm font-medium block mb-1.5">
          Yaş / Sınıf Seviyesi
        </label>
        <select
          name="ageGroup"
          className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
        >
          <option value="">Seçiniz...</option>
          <option value="İlkokul 1–4. Sınıf">İlkokul 1–4. Sınıf</option>
          <option value="Ortaokul 5–8. Sınıf">Ortaokul 5–8. Sınıf</option>
          <option value="Lise">Lise</option>
          <option value="Üniversite">Üniversite</option>
          <option value="Yetişkin / Mezun">Yetişkin / Mezun</option>
        </select>
      </div>

      {/* E-posta */}
      <div>
        <label className="text-gray-400 text-sm font-medium block mb-1.5">
          E-posta
        </label>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ornek@email.com"
          className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-yellow-400 transition-colors"
        />
      </div>

      {/* Mesaj */}
      <div>
        <label className="text-gray-400 text-sm font-medium block mb-1.5">
          Mesajınız
        </label>
        <textarea
          name="message"
          rows={3}
          placeholder="Eklemek istedikleriniz, sormak istedikleriniz..."
          className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
        />
      </div>

      {/* Honeypot — botlar için gizli alan, insanlar görmez */}
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: "none" }}
      />

      {/* KVKK Onayı */}
      <div className="flex items-start gap-3 pt-1">
        <input
          id="kvkk"
          name="kvkk"
          type="checkbox"
          required
          value="1"
          className="mt-0.5 w-4 h-4 accent-yellow-400 flex-shrink-0 cursor-pointer"
        />
        <label htmlFor="kvkk" className="text-gray-500 text-xs leading-relaxed cursor-pointer">
          <span className="text-gray-300">Kişisel verilerimin</span>{" "}
          6698 sayılı KVKK kapsamında yalnızca kayıt ve iletişim
          amacıyla işlenmesini kabul ediyorum.
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-yellow-400 text-black font-bold py-4 rounded-full hover:bg-yellow-300 transition-all hover:scale-[1.02] text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-1"
      >
        {isPending ? "Gönderiliyor..." : "Ön Kayıt Yaptır →"}
      </button>
    </form>
  );
}
