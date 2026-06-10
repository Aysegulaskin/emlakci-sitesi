"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { IL_LISTESI } from "@/lib/utils";

export default function AramaFormu() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    q: searchParams.get("q") || "",
    tip: searchParams.get("tip") || "",
    kategori: searchParams.get("kategori") || "",
    il: searchParams.get("il") || "",
  });

  // URL değişince formu güncelle
  useEffect(() => {
    setForm({
      q: searchParams.get("q") || "",
      tip: searchParams.get("tip") || "",
      kategori: searchParams.get("kategori") || "",
      il: searchParams.get("il") || "",
    });
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, val]) => {
      if (val && val.trim()) params.set(key, val.trim());
    });
    router.push(`/ilanlar?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <select
          value={form.tip}
          onChange={(e) => setForm({ ...form, tip: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tüm İlanlar</option>
          <option value="SATILIK">Satılık</option>
          <option value="KIRALIK">Kiralık</option>
        </select>

        <select
          value={form.kategori}
          onChange={(e) => setForm({ ...form, kategori: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tüm Kategoriler</option>
          <option value="DAIRE">Daire</option>
          <option value="VILLA">Villa</option>
          <option value="ARSA">Arsa</option>
          <option value="ISYERI">İşyeri</option>
          <option value="BINA">Bina</option>
        </select>

        <select
          value={form.il}
          onChange={(e) => setForm({ ...form, il: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tüm Şehirler</option>
          {IL_LISTESI.map((il) => (
            <option key={il} value={il}>{il}</option>
          ))}
        </select>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Anahtar kelime..."
            value={form.q}
            onChange={(e) => setForm({ ...form, q: e.target.value })}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          İlan Ara
        </button>
        {(form.q || form.tip || form.kategori || form.il) && (
          <button
            type="button"
            onClick={() => {
              setForm({ q: "", tip: "", kategori: "", il: "" });
              router.push("/ilanlar");
            }}
            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Temizle
          </button>
        )}
      </div>
    </form>
  );
}
