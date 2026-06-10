import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import IlanKarti from "@/components/IlanKarti";
import AramaFormu from "@/components/AramaFormu";
import { ArrowRight, Home, TrendingUp, Shield, Award } from "lucide-react";
import { KATEGORI_ETIKETLERI } from "@/lib/utils";

async function getOneCikanIlanlar() {
  return prisma.ilan.findMany({
    where: { aktif: true, one_cikan: true },
    include: { resimler: { orderBy: { sira: "asc" } }, ozellikler: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

async function getSonIlanlar() {
  return prisma.ilan.findMany({
    where: { aktif: true },
    include: { resimler: { orderBy: { sira: "asc" } }, ozellikler: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

async function getIstatistikler() {
  const [toplam, satilik, kiralik] = await Promise.all([
    prisma.ilan.count({ where: { aktif: true } }),
    prisma.ilan.count({ where: { aktif: true, tip: "SATILIK" } }),
    prisma.ilan.count({ where: { aktif: true, tip: "KIRALIK" } }),
  ]);
  return { toplam, satilik, kiralik };
}

export default async function AnaSayfa() {
  const [oneCikan, sonIlanlar, istatistikler] = await Promise.all([
    getOneCikanIlanlar(),
    getSonIlanlar(),
    getIstatistikler(),
  ]);

  const kategoriler = [
    { key: "DAIRE", emoji: "🏢", renk: "bg-blue-50 hover:bg-blue-100 border-blue-100" },
    { key: "VILLA", emoji: "🏡", renk: "bg-green-50 hover:bg-green-100 border-green-100" },
    { key: "ARSA", emoji: "🌿", renk: "bg-yellow-50 hover:bg-yellow-100 border-yellow-100" },
    { key: "ISYERI", emoji: "🏪", renk: "bg-purple-50 hover:bg-purple-100 border-purple-100" },
    { key: "BINA", emoji: "🏗️", renk: "bg-orange-50 hover:bg-orange-100 border-orange-100" },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Profesyonel Emlak
            <br />
            <span className="text-yellow-400">Çözümleriyle Yanınızdayız</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            En güncel satılık ve kiralık ilanları, güvenilir ekspertiz verileriyle bir araya getiriyoruz.
            Akıllı filtreleme, hızlı teklif yönetimi ve güvenli müşteri desteği ile ideal mülkünüzü bulun.
          </p>

          <div className="max-w-3xl mx-auto">
            <Suspense fallback={null}>
              <AramaFormu />
            </Suspense>
          </div>

          {/* İstatistikler */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{istatistikler.toplam}+</div>
              <div className="text-sm text-blue-200">Aktif İlan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{istatistikler.satilik}+</div>
              <div className="text-sm text-blue-200">Satılık</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{istatistikler.kiralik}+</div>
              <div className="text-sm text-blue-200">Kiralık</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">10+</div>
              <div className="text-sm text-blue-200">Yıllık Deneyim</div>
            </div>
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Kategoriye Göre Ara
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {kategoriler.map((kat) => (
              <Link
                key={kat.key}
                href={`/ilanlar?kategori=${kat.key}`}
                className={`${kat.renk} border rounded-xl p-6 text-center transition-all hover:shadow-md group`}
              >
                <div className="text-4xl mb-2">{kat.emoji}</div>
                <div className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                  {KATEGORI_ETIKETLERI[kat.key]}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Öne çıkan ilanlar */}
      {oneCikan.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Öne Çıkan İlanlar</h2>
                <p className="text-gray-500 mt-1">Editörlerimiz tarafından seçilen özel mülkler</p>
              </div>
              <Link
                href="/ilanlar"
                className="flex items-center gap-1.5 text-blue-700 font-medium hover:gap-2.5 transition-all"
              >
                Tümünü Gör <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {oneCikan.map((ilan) => (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <IlanKarti key={ilan.id} ilan={ilan as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Son ilanlar */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Son Eklenen İlanlar</h2>
              <p className="text-gray-500 mt-1">En yeni mülkleri kaçırmayın</p>
            </div>
            <Link
              href="/ilanlar"
              className="flex items-center gap-1.5 text-blue-700 font-medium hover:gap-2.5 transition-all"
            >
              Tümünü Gör <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sonIlanlar.map((ilan) => (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <IlanKarti key={ilan.id} ilan={ilan as any} />
            ))}
          </div>
        </div>
      </section>

      {/* Neden biz */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Neden EmlakPro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-blue-700" />,
                baslik: "Güvenilir",
                aciklama: "Tüm ilanlar uzman ekibimiz tarafından doğrulanır.",
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-blue-700" />,
                baslik: "Güncel Fiyatlar",
                aciklama: "Piyasa fiyatlarını anlık olarak takip ediyoruz.",
              },
              {
                icon: <Home className="w-8 h-8 text-blue-700" />,
                baslik: "Geniş Portföy",
                aciklama: "Her bütçeye uygun yüzlerce seçenek sunuyoruz.",
              },
              {
                icon: <Award className="w-8 h-8 text-blue-700" />,
                baslik: "Profesyonel",
                aciklama: "10 yılı aşkın deneyimli uzman kadromuzla yanınızdayız.",
              },
            ].map((item) => (
              <div key={item.baslik} className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.baslik}</h3>
                <p className="text-gray-500 text-sm">{item.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Mülkünüzü Satmak veya Kiralamak mı İstiyorsunuz?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Uzman ekibimiz size en iyi fiyatı bulmak için hazır. Hemen iletişime geçin.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Bize Ulaşın <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
