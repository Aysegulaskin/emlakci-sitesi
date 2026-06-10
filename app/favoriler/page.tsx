"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import IlanKarti from "@/components/IlanKarti";
import { getFavoriler } from "@/hooks/useFavori";
import { IlanWithResimler } from "@/lib/types";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function FavorilerPage() {
  const { data: session, status } = useSession();
  const [ilanlar, setIlanlar] = useState<IlanWithResimler[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user) {
      // Giriş yapmış kullanıcı: veritabanından al
      fetch("/api/kullanici/favoriler")
        .then((r) => r.json())
        .then((data) => setIlanlar(Array.isArray(data) ? data : []))
        .finally(() => setLoading(false));
    } else {
      // Misafir: localStorage'dan al
      const favoriIds = getFavoriler();
      if (favoriIds.length === 0) { setLoading(false); return; }

      Promise.all(
        favoriIds.map(async (id) => {
          const res = await fetch(`/api/ilanlar/${id}`);
          if (!res.ok) return null;
          return (await res.json()) as IlanWithResimler;
        })
      )
        .then((results) => setIlanlar(results.filter(Boolean) as IlanWithResimler[]))
        .finally(() => setLoading(false));
    }
  }, [session, status]);

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="rounded-3xl bg-white p-8 shadow-lg mb-8">
        <div className="flex items-center gap-3">
          <Heart className="w-7 h-7 text-red-500 fill-red-500" />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Favori İlanlarım</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {session?.user
                ? "Hesabınıza kayıtlı favori ilanlarınız"
                : "Tarayıcınıza kaydedilen favori ilanlarınız"}
            </p>
          </div>
        </div>

        {!session?.user && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-700 flex items-center justify-between gap-4 flex-wrap">
            <span>Favorilerinizi kalıcı kaydetmek için giriş yapın.</span>
            <div className="flex gap-2">
              <Link href="/giris" className="bg-blue-700 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-blue-800 transition text-sm">
                Giriş Yap
              </Link>
              <Link href="/kayit" className="border border-blue-200 text-blue-700 px-4 py-1.5 rounded-lg font-medium hover:bg-blue-100 transition text-sm">
                Kayıt Ol
              </Link>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Yükleniyor...</div>
      ) : ilanlar.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
          <Heart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-lg font-semibold text-slate-900">Henüz favori ilan eklemediniz.</p>
          <p className="mt-2 text-slate-500 text-sm">İlan kartlarındaki kalp ikonuna tıklayarak favorilere ekleyebilirsiniz.</p>
          <Link href="/ilanlar" className="inline-block mt-6 bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-800 transition">
            İlanları İncele
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ilanlar.map((ilan) => (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <IlanKarti key={ilan.id} ilan={ilan as any} />
          ))}
        </div>
      )}
    </main>
  );
}
