import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatFiyat(fiyat: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(fiyat);
}

export function formatTarih(tarih: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(tarih));
}

export const IL_LISTESI = [
  "Adana", "Ankara", "Antalya", "Bursa", "Denizli", "Diyarbakır",
  "Eskişehir", "Gaziantep", "İstanbul", "İzmir", "Kayseri", "Kocaeli",
  "Konya", "Malatya", "Mersin", "Muğla", "Samsun", "Trabzon",
];

export const KATEGORI_ETIKETLERI: Record<string, string> = {
  DAIRE: "Daire",
  VILLA: "Villa",
  ARSA: "Arsa",
  ISYERI: "İşyeri",
  BINA: "Bina",
};

export const TIP_ETIKETLERI: Record<string, string> = {
  SATILIK: "Satılık",
  KIRALIK: "Kiralık",
};

export const ISITMA_TIPLERI = [
  "Doğalgaz", "Merkezi", "Klima", "Soba", "Yerden Isıtma", "Isıtma Yok"
];
