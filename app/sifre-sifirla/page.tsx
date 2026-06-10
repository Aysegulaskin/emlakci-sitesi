"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";

function SifreSifirlaForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [form, setForm] = useState({ sifre: "", sifreTekrar: "" });
  const [hata, setHata] = useState<string | null>(null);
  const [basarili, setBasarili] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata(null);

    if (form.sifre !== form.sifreTekrar) {
      setHata("Şifreler eşleşmiyor.");
      return;
    }

    setYukleniyor(true);
    const res = await fetch("/api/auth/sifre-sifirla", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, sifre: form.sifre }),
    });

    const data = await res.json();
    setYukleniyor(false);

    if (!res.ok) {
      setHata(data.error || "Bir hata oluştu.");
      return;
    }

    setBasarili(true);
    setTimeout(() => router.push("/giris"), 2000);
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-600">Geçersiz sıfırlama linki.</p>
        <Link href="/sifremi-unuttum" className="text-blue-700 hover:underline mt-4 block">Yeni link iste</Link>
      </div>
    );
  }

  if (basarili) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Şifreniz Güncellendi!</h2>
        <p className="text-slate-500 text-sm mt-2">Giriş sayfasına yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {hata && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{hata}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Yeni Şifre</label>
        <input
          type="password"
          required
          minLength={6}
          value={form.sifre}
          onChange={(e) => setForm({ ...form, sifre: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="En az 6 karakter"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Şifre Tekrar</label>
        <input
          type="password"
          required
          value={form.sifreTekrar}
          onChange={(e) => setForm({ ...form, sifreTekrar: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Şifrenizi tekrar girin"
        />
      </div>
      <button
        type="submit"
        disabled={yukleniyor}
        className="w-full bg-blue-700 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition disabled:opacity-60"
      >
        {yukleniyor ? "Güncelleniyor..." : "Şifremi Güncelle"}
      </button>
    </form>
  );
}

export default function SifreSifirlaPage() {
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
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">Yeni Şifre Belirle</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <Suspense fallback={<p className="text-center text-slate-500">Yükleniyor...</p>}>
            <SifreSifirlaForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
