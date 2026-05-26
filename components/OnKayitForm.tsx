"use client";

import { useActionState } from "react";
import { submitOnKayit } from "@/app/actions";
import Link from "next/link";

export default function OnKayitForm() {
  const [state, formAction, isPending] = useActionState(submitOnKayit, null);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center text-center py-10 animate-fade-in">
        {/* İkon */}
        <div className="text-6xl mb-4 animate-float">🎉</div>

        <h2 className="text-white font-black text-3xl mb-2">Ön Kayıt Alındı!</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
          Başvurunuz Nev-Dil'e iletildi. Kısa süre içinde sizi arayacağız.
        </p>

        {/* Sonraki adımlar */}
        <div className="w-full bg-black border border-yellow-400/15 rounded-2xl p-5 mb-6 text-left space-y-4">
          <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-3">Bundan Sonra Ne Olacak?</p>

          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-yellow-400 text-black text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <div>
              <p className="text-white text-sm font-semibold">Sizi Arayacağız</p>
              <p className="text-gray-500 text-xs mt-0.5">Genellikle aynı gün veya ertesi gün iş saatleri içinde (09:00–18:00)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <div>
              <p className="text-white text-sm font-semibold">Seviye Belirleme</p>
              <p className="text-gray-500 text-xs mt-0.5">Kısa bir görüşme ile size en uygun grup ve program belirlenir</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <div>
              <p className="text-white text-sm font-semibold">Kursa Başlayın</p>
              <p className="text-gray-500 text-xs mt-0.5">Yeriniz ayrılır, başlangıç tarihi ve ders saati bildirilir</p>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <a
          href="https://wa.me/905457416609?text=Merhaba%2C%20ön%20kayıt%20formunu%20doldurdum.%20Bilgi%20almak%20istiyorum."
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-3.5 rounded-full transition-all hover:scale-[1.02] text-sm mb-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp ile Ulaşın
        </a>

        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/"
            className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition-all hover:scale-105 text-sm"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/kurslar"
            className="border border-gray-800 text-gray-400 font-semibold px-6 py-3 rounded-full hover:border-gray-600 transition-all text-sm"
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
          <optgroup label="Yetişkin & Sınav Hazırlık">
            <option value="YDS Hazırlık Grubu">YDS Hazırlık Grubu</option>
            <option value="İş İngilizcesi">İş İngilizcesi</option>
          </optgroup>
          <optgroup label="Çocuk & Gençlik Grupları">
            <option value="Junior Grubu (4–6 Yaş)">Junior Grubu (4–6 Yaş)</option>
            <option value="İlkokul Grubu (1–4. Sınıf)">İlkokul Grubu (1–4. Sınıf)</option>
            <option value="Ortaokul Grubu (5–7. Sınıf)">Ortaokul Grubu (5–7. Sınıf)</option>
            <option value="Lise Grubu (9–12. Sınıf)">Lise Grubu (9–12. Sınıf)</option>
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
