export type IlanTipi = "SATILIK" | "KIRALIK";
export type IlanKategorisi = "DAIRE" | "VILLA" | "ARSA" | "ISYERI" | "BINA";

export interface IlanWithResimler {
  id: string;
  baslik: string;
  aciklama: string;
  fiyat: number;
  tip: string;
  kategori: string;
  il: string;
  ilce: string;
  adres: string;
  metrekare: number;
  odaSayisi: string | null;
  banyo: number | null;
  kat: number | null;
  toplamKat: number | null;
  isitma: string | null;
  bina_yasi: number | null;
  lat: number | null;
  lng: number | null;
  aktif: boolean;
  one_cikan: boolean;
  goruntuleme: number;
  createdAt: Date;
  updatedAt: Date;
  resimler: { id: string; url: string; sira: number }[];
  ozellikler: { id: string; ad: string }[];
}

export interface FilterParams {
  tip?: string;
  kategori?: string;
  il?: string;
  minFiyat?: string;
  maxFiyat?: string;
  minMetrekare?: string;
  maxMetrekare?: string;
  odaSayisi?: string;
  q?: string;
}
