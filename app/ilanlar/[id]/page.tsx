import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatFiyat } from "@/lib/utils";
import { ArrowLeft, BedDouble, Bath, Maximize2, MapPin } from "lucide-react";
import IlanGaleri from "@/components/IlanGaleri";

export default async function IlanDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ilan = await prisma.ilan.findUnique({
    where: { id },
    include: { resimler: { orderBy: { sira: "asc" } }, ozellikler: true },
  });

  if (!ilan) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Detaylı ilan incelemesi</p>
          <h1 className="text-3xl font-semibold text-slate-900">{ilan.baslik}</h1>
          <p className="mt-2 text-slate-600">{ilan.ilce}, {ilan.il} • {ilan.kategori} • {ilan.tip}</p>
        </div>
        <Link
          href="/ilanlar"
          className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          İlanlara Geri Dön
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <IlanGaleri resimler={ilan.resimler} baslik={ilan.baslik} fiyat={formatFiyat(ilan.fiyat)} />

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Fiyat</p>
                <p className="mt-2 text-3xl font-semibold text-blue-700">{formatFiyat(ilan.fiyat)}{ilan.tip === "KIRALIK" && <span className="text-base font-normal text-slate-500">/ay</span>}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Adres</p>
                <p className="mt-2 text-slate-900">{ilan.adres}, {ilan.ilce}, {ilan.il}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5 text-center">
                <p className="text-sm text-slate-500">Metrekare</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{ilan.metrekare} m²</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 text-center">
                <p className="text-sm text-slate-500">Oda</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{ilan.odaSayisi || "—"}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 text-center">
                <p className="text-sm text-slate-500">Banyo</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{ilan.banyo ?? "—"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900">Açıklama</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">{ilan.aciklama}</p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900">Özellikler</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {ilan.ozellikler.length > 0 ? (
                ilan.ozellikler.map((ozellik) => (
                  <span key={ozellik.id} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                    {ozellik.ad}
                  </span>
                ))
              ) : (
                <span className="text-slate-500">Bu ilan için özel özellik bilgisi yok.</span>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900">Detaylı Bilgiler</h2>
            <div className="mt-4 space-y-4 text-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>{ilan.ilce}, {ilan.il}</span>
              </div>
              <div className="flex items-center gap-3">
                <Maximize2 className="w-5 h-5 text-blue-600" />
                <span>{ilan.metrekare} m²</span>
              </div>
              <div className="flex items-center gap-3">
                <BedDouble className="w-5 h-5 text-blue-600" />
                <span>{ilan.odaSayisi || "Belirtilmemiş"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Bath className="w-5 h-5 text-blue-600" />
                <span>{ilan.banyo ?? "Belirtilmemiş"}</span>
              </div>
              {ilan.isitma && (
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm">I</span>
                  <span>{ilan.isitma}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-blue-700 p-8 text-white shadow-lg">
            <h2 className="text-2xl font-semibold">Hemen İletişime Geçin</h2>
            <p className="mt-4 text-slate-200">İlan hakkında daha fazla bilgi almak için formu doldurun veya bize direkt ulaşın.</p>
            <div className="mt-6 space-y-3 text-sm">
              <p>Telefon: <strong>0850 123 45 67</strong></p>
              <p>Email: <strong>info@emlakpro.com.tr</strong></p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
