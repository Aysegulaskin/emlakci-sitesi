"use client";

import { useState } from "react";

export default function IletisimPage() {
  const [form, setForm] = useState({
    ad: "",
    email: "",
    telefon: "",
    konu: "",
    mesaj: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/mesajlar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(result?.error || "Mesaj gönderilirken bir hata oluştu.");
      return;
    }

    setStatus("Mesajınız alındı. En kısa sürede size dönüş yapacağız.");
    setForm({ ad: "", email: "", telefon: "", konu: "", mesaj: "" });
  };

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl bg-white p-10 shadow-lg">
          <p className="text-sm text-slate-500">Bizimle iletişime geçin</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Profesyonel destek için hazırız</h1>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Emlak danışmanlarımız size en uygun stratejiyi sunar. Soru, teklif veya değerleme talepleriniz için formu doldurun.
          </p>

          <div className="mt-10 space-y-5">
            <div>
              <p className="text-sm text-slate-500">Telefon</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">0850 123 45 67</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">E-posta</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">info@emlakpro.com.tr</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Adres</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Bağcılar Mah. Emlak Sok. No:12, İstanbul</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-10 shadow-lg">
          <p className="text-sm text-slate-500">Mesaj Gönder</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">İhtiyacınızı bize anlatın</h2>

          {status && <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-700">{status}</div>}
          {error && <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-700">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Adınız</span>
                <input
                  name="ad"
                  value={form.ad}
                  onChange={handleChange}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">E-posta</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Telefon</span>
                <input
                  name="telefon"
                  value={form.telefon}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Konu</span>
                <input
                  name="konu"
                  value={form.konu}
                  onChange={handleChange}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Mesajınız</span>
              <textarea
                name="mesaj"
                rows={6}
                value={form.mesaj}
                onChange={handleChange}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-3xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 transition disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Gönderiliyor..." : "Mesaj Gönder"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
