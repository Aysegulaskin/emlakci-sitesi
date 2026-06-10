"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function KayitPage() {
  const router = useRouter();
  const [form, setForm] = useState({ ad: "", email: "", sifre: "", sifreTekrar: "" });
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata(null);

    if (form.sifre !== form.sifreTekrar) {
      setHata("Şifreler eşleşmiyor.");
      return;
    }

    setYukleniyor(true);
    const res = await fetch("/api/auth/kayit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ad: form.ad, email: form.email, sifre: form.sifre }),
    });

    const data = await res.json();
    if (!res.ok) {
      setHata(data.error || "Kayıt sırasında hata oluştu.");
      setYukleniyor(false);
      return;
    }

    // Kayıt başarılı, otomatik giriş yap
    await signIn("credentials", {
      email: form.email,
      password: form.sifre,
      redirect: false,
    });
    router.push("/");
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
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">Hesap Oluştur</h1>
          <p className="mt-2 text-slate-500 text-sm">Favorilerinizi kaydedin, ilanları takip edin.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {hata && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{hata}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Ad Soyad</label>
              <input
                type="text"
                required
                value={form.ad}
                onChange={(e) => setForm({ ...form, ad: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adınız Soyadınız"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">E-posta</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ornek@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Şifre</label>
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
              className="w-full bg-blue-700 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition disabled:opacity-60 mt-2"
            >
              {yukleniyor ? "Kaydediliyor..." : "Kayıt Ol"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Zaten hesabın var mı?{" "}
            <Link href="/giris" className="text-blue-700 font-medium hover:underline">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
