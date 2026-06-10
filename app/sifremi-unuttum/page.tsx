"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState("");
  const [durum, setDurum] = useState<"bekliyor" | "gonderildi" | "hata">("bekliyor");
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);

    const res = await fetch("/api/auth/sifremi-unuttum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setYukleniyor(false);
    setDurum(res.ok ? "gonderildi" : "hata");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Emlak<span className="text-blue-700">Pro</span></span>
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">Şifremi Unuttum</h1>
          <p className="mt-2 text-slate-500 text-sm">E-postanıza sıfırlama linki göndereceğiz.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {durum === "gonderildi" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✉️</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">E-posta Gönderildi</h2>
              <p className="text-slate-500 text-sm mb-6">
                <strong>{email}</strong> adresine şifre sıfırlama linki gönderdik. Gelen kutunuzu kontrol edin.
              </p>
              <Link href="/giris" className="text-blue-700 text-sm font-medium hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Giriş sayfasına dön
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {durum === "hata" && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                  Bir hata oluştu. Lütfen tekrar deneyin.
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-posta Adresiniz</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ornek@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={yukleniyor}
                className="w-full bg-blue-700 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition disabled:opacity-60"
              >
                {yukleniyor ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
              </button>
              <Link href="/giris" className="block text-center text-sm text-slate-500 hover:text-slate-700 mt-2">
                ← Giriş sayfasına dön
              </Link>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
