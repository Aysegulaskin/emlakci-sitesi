import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // Admin kullanıcısı oluştur
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@emlakpro.com.tr" },
    update: {},
    create: {
      email: "admin@emlakpro.com.tr",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin kullanıcısı: admin@emlakpro.com.tr / admin123");

  const ilanlar = [
    {
      baslik: "Kadıköy'de Lüks 3+1 Daire",
      aciklama: "Kadıköy merkezde, deniz manzaralı, yeni yapı, ebeveyn banyolu, geniş balkonlu 3+1 daire. Merkezi ısıtma, asansörlü bina, otoparklı.",
      fiyat: 8500000,
      tip: "SATILIK",
      kategori: "DAIRE",
      il: "İstanbul",
      ilce: "Kadıköy",
      adres: "Moda Caddesi No:45",
      metrekare: 145,
      odaSayisi: "3+1",
      banyo: 2,
      kat: 5,
      toplamKat: 8,
      isitma: "Doğalgaz",
      bina_yasi: 3,
      lat: 40.9865,
      lng: 29.0299,
      aktif: true,
      one_cikan: true,
      resimler: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
      ],
      ozellikler: ["Asansör", "Otopark", "Balkon", "Güvenlik", "Ebeveyn Banyosu"],
    },
    {
      baslik: "Beşiktaş'ta Kiralık 2+1 Daire",
      aciklama: "Beşiktaş'ın kalbinde, ulaşıma yakın, mobilyalı 2+1 daire. Yüksek tavan, amerikan mutfak, giyinme odası.",
      fiyat: 32000,
      tip: "KIRALIK",
      kategori: "DAIRE",
      il: "İstanbul",
      ilce: "Beşiktaş",
      adres: "Barbaros Bulvarı No:12",
      metrekare: 95,
      odaSayisi: "2+1",
      banyo: 1,
      kat: 3,
      toplamKat: 6,
      isitma: "Merkezi",
      bina_yasi: 10,
      lat: 41.0431,
      lng: 29.0059,
      aktif: true,
      one_cikan: true,
      resimler: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      ],
      ozellikler: ["Mobilyalı", "Asansör", "Güvenlik", "Amerikan Mutfak"],
    },
    {
      baslik: "Ataşehir'de Satılık Villa",
      aciklama: "Ataşehir'de özel havuzlu, bahçeli, 5+2 lüks villa. 3 katlı, 400m² kullanım alanı. Akıllı ev sistemi, yerden ısıtma, kapalı garaj.",
      fiyat: 25000000,
      tip: "SATILIK",
      kategori: "VILLA",
      il: "İstanbul",
      ilce: "Ataşehir",
      adres: "Küçükbakkalköy Mah.",
      metrekare: 400,
      odaSayisi: "5+2",
      banyo: 4,
      kat: 3,
      toplamKat: 3,
      isitma: "Yerden Isıtma",
      bina_yasi: 2,
      lat: 40.9856,
      lng: 29.1224,
      aktif: true,
      one_cikan: true,
      resimler: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      ],
      ozellikler: ["Özel Havuz", "Bahçe", "Garaj", "Akıllı Ev", "Yerden Isıtma"],
    },
    {
      baslik: "Ankara Çankaya'da 4+1 Satılık",
      aciklama: "Çankaya'nın prestijli bölgesinde, ara katta, geniş terası olan 4+1 daire. Şehir manzaralı, yeni tadilatlı.",
      fiyat: 6200000,
      tip: "SATILIK",
      kategori: "DAIRE",
      il: "Ankara",
      ilce: "Çankaya",
      adres: "Kızılay Mah. Atatürk Bulvarı",
      metrekare: 185,
      odaSayisi: "4+1",
      banyo: 2,
      kat: 7,
      toplamKat: 12,
      isitma: "Doğalgaz",
      bina_yasi: 8,
      lat: 39.9208,
      lng: 32.8541,
      aktif: true,
      one_cikan: false,
      resimler: [
        "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80",
      ],
      ozellikler: ["Asansör", "Otopark", "Teras", "Güvenlik"],
    },
    {
      baslik: "İzmir Karşıyaka'da Kiralık İşyeri",
      aciklama: "Karşıyaka çarşı merkezinde, cadde cepheli, 120m² işyeri. Klimalı, güvenlik sistemi mevcut.",
      fiyat: 18000,
      tip: "KIRALIK",
      kategori: "ISYERI",
      il: "İzmir",
      ilce: "Karşıyaka",
      adres: "Karşıyaka Çarşı Caddesi No:78",
      metrekare: 120,
      odaSayisi: null,
      banyo: 1,
      kat: 0,
      toplamKat: 4,
      isitma: "Klima",
      bina_yasi: 15,
      lat: 38.4585,
      lng: 27.1043,
      aktif: true,
      one_cikan: false,
      resimler: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      ],
      ozellikler: ["Klima", "Güvenlik", "Cadde Cepheli"],
    },
    {
      baslik: "Antalya Konyaaltı'nda Arsa",
      aciklama: "Konyaaltı'nda imarlı, denize yakın 1500m² arsa. Konut imarlı, altyapısı hazır, tapusu temiz.",
      fiyat: 12000000,
      tip: "SATILIK",
      kategori: "ARSA",
      il: "Antalya",
      ilce: "Konyaaltı",
      adres: "Konyaaltı Mah.",
      metrekare: 1500,
      odaSayisi: null,
      banyo: null,
      kat: null,
      toplamKat: null,
      isitma: null,
      bina_yasi: null,
      lat: 36.8841,
      lng: 30.6419,
      aktif: true,
      one_cikan: false,
      resimler: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      ],
      ozellikler: ["İmarlı", "Tapulu", "Altyapı Hazır"],
    },
    {
      baslik: "Bursa Nilüfer'de Kiralık 1+1",
      aciklama: "Nilüfer'de yeni yapı, eşyalı, otoparklı 1+1 daire. Öğrenci veya bekar profesyonellere uygun.",
      fiyat: 12500,
      tip: "KIRALIK",
      kategori: "DAIRE",
      il: "Bursa",
      ilce: "Nilüfer",
      adres: "Özlüce Mah.",
      metrekare: 65,
      odaSayisi: "1+1",
      banyo: 1,
      kat: 2,
      toplamKat: 5,
      isitma: "Doğalgaz",
      bina_yasi: 4,
      lat: 40.2252,
      lng: 28.9850,
      aktif: true,
      one_cikan: false,
      resimler: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      ],
      ozellikler: ["Mobilyalı", "Otopark", "Asansör"],
    },
    {
      baslik: "Sarıyer'de Boğaz Manzaralı Villa",
      aciklama: "Sarıyer'de Boğaz manzaralı, özel bahçeli, 6+2 müstakil villa. Özel yüzme havuzu, kapalı garaj.",
      fiyat: 45000000,
      tip: "SATILIK",
      kategori: "VILLA",
      il: "İstanbul",
      ilce: "Sarıyer",
      adres: "Tarabya Mah.",
      metrekare: 600,
      odaSayisi: "6+2",
      banyo: 5,
      kat: 3,
      toplamKat: 3,
      isitma: "Yerden Isıtma",
      bina_yasi: 5,
      lat: 41.1751,
      lng: 29.0564,
      aktif: true,
      one_cikan: true,
      resimler: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      ],
      ozellikler: ["Deniz Manzarası", "Özel Havuz", "Bahçe", "Garaj"],
    },
    {
      baslik: "Komple Satılık Bina — Merkezi Konumda 6 Katlı Yatırımlık",
      aciklama: "Şehir merkezinde, ana cadde cepheli, 6 katlı komple satılık bina. Her katı bağımsız daire veya ofis olarak kullanılabilir. Mevcut kira geliri: aylık 95.000 TL",
      fiyat: 85000000,
      tip: "SATILIK",
      kategori: "BINA",
      il: "İstanbul",
      ilce: "Kadıköy",
      adres: "Bağdat Caddesi No:142, Kadıköy",
      metrekare: 1450,
      odaSayisi: null,
      banyo: null,
      kat: 6,
      toplamKat: 6,
      isitma: "Doğalgaz",
      bina_yasi: 9,
      lat: 40.9764,
      lng: 29.0547,
      aktif: true,
      one_cikan: true,
      resimler: [
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      ],
      ozellikler: ["Asansör", "Kapalı Otopark", "Cadde Cepheli", "Kira Getirisi Var", "Depreme Dayanıklı"],
    },
  ];

  for (const ilanData of ilanlar) {
    const { resimler, ozellikler, ...data } = ilanData;
    await prisma.ilan.create({
      data: {
        ...data,
        resimler: { create: resimler.map((url: string, i: number) => ({ url, sira: i })) },
        ozellikler: { create: ozellikler.map((ad: string) => ({ ad })) },
      },
    });
  }

  console.log(`✅ ${ilanlar.length} demo ilan eklendi`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
