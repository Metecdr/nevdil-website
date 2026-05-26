"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {/* Kullanıcı Adı */}
      <div>
        <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
          Kullanıcı Adı
        </label>
        <input
          name="username"
          type="text"
          required
          autoComplete="username"
          defaultValue="admin"
          className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-400/60 transition-colors"
        />
      </div>

      {/* Şifre */}
      <div>
        <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
          Şifre
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-400/60 transition-colors"
          placeholder="••••••••"
        />
      </div>

      {/* Hata mesajı */}
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm text-center">
          {state.error}
        </div>
      )}

      {/* Giriş butonu */}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-yellow-400 text-black font-black py-3.5 rounded-xl hover:bg-yellow-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider mt-2"
      >
        {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>
    </form>
  );
}
