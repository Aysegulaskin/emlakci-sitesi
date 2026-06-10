"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function GirisPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", sifre: "" });
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata(null);
    setYukleniyor(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.sifre,
      redirect: false,
    });

    setYukleniyor(false);

    if (result?.error) {
      setHata("E-posta veya şifre hatalı.");
      return;
    }

    router.push("/");
    router.refresh();
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
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">Giriş Yap</h1>
          <p className="mt-2 text-slate-500 text-sm">Favorilerinize erişmek için giriş yapın.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {hata && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{hata}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Şifre</label>
                <Link href="/sifremi-unuttum" className="text-xs text-blue-700 hover:underline">Şifremi Unuttum</Link>
              </div>
              <input
                type="password"
                required
                value={form.sifre}
                onChange={(e) => setForm({ ...form, sifre: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Şifreniz"
              />
            </div>

            <button
              type="submit"
              disabled={yukleniyor}
              className="w-full bg-blue-700 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition disabled:opacity-60 mt-2"
            >
              {yukleniyor ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Hesabın yok mu?{" "}
            <Link href="/kayit" className="text-blue-700 font-medium hover:underline">Kayıt Ol</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
