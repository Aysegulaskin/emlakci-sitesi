"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Maximize2, BedDouble, Bath, Eye } from "lucide-react";
import { formatFiyat, KATEGORI_ETIKETLERI, TIP_ETIKETLERI } from "@/lib/utils";
import { IlanWithResimler } from "@/lib/types";
import { useFavori } from "@/hooks/useFavori";
import { useSession } from "next-auth/react";

interface Props {
  ilan: IlanWithResimler;
}

export default function IlanKarti({ ilan }: Props) {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id;
  const { favoriMi, toggle } = useFavori(ilan.id, userId);
  const kapakResim = ilan.resimler[0]?.url || "/placeholder.jpg";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Resim */}
      <div className="relative h-52 overflow-hidden">
        <Link href={`/ilanlar/${ilan.id}`} className="block absolute inset-0 z-10" tabIndex={-1} aria-label={ilan.baslik} />
        <Image
          src={kapakResim}
          alt={ilan.baslik}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Etiketler */}
        <div className="absolute top-3 left-3 flex gap-2 z-20">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white ${ilan.tip === "SATILIK" ? "bg-blue-600" : "bg-green-600"}`}>
            {TIP_ETIKETLERI[ilan.tip] || ilan.tip}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800 text-white bg-opacity-80">
            {KATEGORI_ETIKETLERI[ilan.kategori] || ilan.kategori}
          </span>
        </div>

        {/* Favori butonu */}
        <button
          onClick={() => toggle()}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform"
          title={favoriMi ? "Favoriden çıkar" : "Favoriye ekle"}
        >
          <Heart className={`w-4 h-4 ${favoriMi ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>

        {/* Görüntüleme */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
          <Eye className="w-3 h-3" />
          {ilan.goruntuleme}
        </div>
      </div>

      {/* İçerik */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug mb-2">
          <Link href={`/ilanlar/${ilan.id}`} className="hover:text-blue-700 transition-colors">
            {ilan.baslik}
          </Link>
        </h3>

        <p className="text-2xl font-bold text-blue-700 mb-3">
          {formatFiyat(ilan.fiyat)}
          {ilan.tip === "KIRALIK" && <span className="text-sm font-normal text-gray-500">/ay</span>}
        </p>

        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{ilan.ilce}, {ilan.il}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
            {ilan.metrekare} m²
          </span>
          {ilan.odaSayisi && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5 text-gray-400" />
              {ilan.odaSayisi}
            </span>
          )}
          {ilan.banyo && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-gray-400" />
              {ilan.banyo}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
