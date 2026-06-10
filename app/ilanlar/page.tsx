import { prisma } from "@/lib/prisma";
import IlanKarti from "@/components/IlanKarti";
import AramaFormu from "@/components/AramaFormu";
import { Suspense } from "react";

type SearchParams = {
  tip?: string;
  kategori?: string;
  il?: string;
  q?: string;
};

async function getIlanlar(searchParams: SearchParams) {
  const andKosullar: Record<string, unknown>[] = [{ aktif: true }];

  if (searchParams.tip) andKosullar.push({ tip: searchParams.tip });
  if (searchParams.kategori) andKosullar.push({ kategori: searchParams.kategori });
  if (searchParams.il) andKosullar.push({ il: searchParams.il });

  if (searchParams.q && searchParams.q.trim()) {
    const q = searchParams.q.trim();
    andKosullar.push({
      OR: [
        { baslik: { contains: q } },
        { aciklama: { contains: q } },
        { il: { contains: q } },
        { ilce: { contains: q } },
        { adres: { contains: q } },
      ],
    });
  }

  return prisma.ilan.findMany({
    where: { AND: andKosullar },
    include: { resimler: { orderBy: { sira: "asc" } }, ozellikler: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  });
}

export default async function IlanlarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params: SearchParams = (await searchParams) as SearchParams;
  const ilanlar = await getIlanlar(params);

  return (
    <main className="container mx-auto px-4 py-16">
      <section className="rounded-3xl bg-white p-8 shadow-lg mb-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Profesyonel Arama</p>
            <h1 className="text-3xl font-semibold text-slate-900">İlanlar</h1>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Satılık ve kiralık ilanlar arasında hızlıca filtreleyin, en uygun mülkü bulun.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
            {ilanlar.length} sonuç bulundu
          </div>
        </div>

        <div className="mt-8">
          <Suspense fallback={null}>
            <AramaFormu />
          </Suspense>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ilanlar.length > 0 ? (
          ilanlar.map((ilan) => <IlanKarti key={ilan.id} ilan={ilan as any} />)
        ) : (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <p className="text-lg font-semibold text-slate-900">Aradığınız kriterde ilan bulunamadı.</p>
            <p className="mt-3 text-slate-600">Filtreleri düzenleyebilir veya tüm ilanları tekrar inceleyebilirsiniz.</p>
          </div>
        )}
      </section>

      {ilanlar.length > 0 && (
        <div className="mt-14 rounded-3xl bg-blue-700 p-10 text-white shadow-lg">
          <h2 className="text-2xl font-semibold">Uzmanlarımızla İletişime Geçin</h2>
          <p className="mt-3 max-w-2xl">
            Profesyonel danışmanlık almak, finansman seçeneklerinizi değerlendirmek ve tur
            planlamak için hemen iletişime geçin.
          </p>
        </div>
      )}
    </main>
  );
}
