"use client";

import { useEffect, useState } from "react";
import IlanKarti from "@/components/IlanKarti";
import { getFavoriler } from "@/hooks/useFavori";
import { IlanWithResimler } from "@/lib/types";

export default function FavorilerPage() {
  const [ilanlar, setIlanlar] = useState<IlanWithResimler[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const favoriIds = getFavoriler();
    if (favoriIds.length === 0) {
      setLoading(false);
      return;
    }

    Promise.all(
      favoriIds.map(async (id) => {
        const res = await fetch(`/api/ilanlar/${id}`);
        if (!res.ok) return null;
        return (await res.json()) as IlanWithResimler;
      })
    )
      .then((results) => {
        setIlanlar(results.filter(Boolean) as IlanWithResimler[]);
      })
      .catch(() => {
        setError("Favori ilanlar yüklenirken bir hata oluştu.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">Favori İlanlarım</h1>
        <p className="mt-3 text-slate-600">Beğendiğiniz ilanları burada toplayın ve hızlıca inceleyin.</p>
      </div>

      <section className="mt-10">
        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <p className="text-slate-600">Favori ilanlarınız yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-rose-50 p-10 text-center shadow-lg text-rose-700">
            {error}
          </div>
        ) : ilanlar.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <p className="text-lg font-semibold text-slate-900">Henüz favori ilan eklemediniz.</p>
            <p className="mt-3 text-slate-600">Beğendiğiniz ilanların kalbini tıklayarak favorilerinize ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ilanlar.map((ilan) => (
              <IlanKarti key={ilan.id} ilan={ilan as any} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
