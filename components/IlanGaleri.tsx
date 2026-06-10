"use client";

import { useState } from "react";
import Image from "next/image";

interface Resim {
  id: string;
  url: string;
  sira: number;
}

interface Props {
  resimler: Resim[];
  baslik: string;
  fiyat: string;
}

export default function IlanGaleri({ resimler, baslik, fiyat }: Props) {
  const initialUrl = resimler[0]?.url || "/placeholder.jpg";
  const [activeUrl, setActiveUrl] = useState(initialUrl);

  return (
    <div className="space-y-6">
      <div className="group rounded-3xl overflow-hidden bg-slate-100 shadow-lg">
        <div className="relative h-[420px] sm:h-[500px] w-full overflow-hidden">
          <Image
            src={activeUrl}
            alt={baslik}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            sizes="100vw"
          />
        </div>
      </div>

      {resimler.length > 1 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {resimler.map((resim) => (
            <button
              key={resim.id}
              type="button"
              onClick={() => setActiveUrl(resim.url)}
              className={`group overflow-hidden rounded-3xl border transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                activeUrl === resim.url ? "border-blue-600 shadow-md" : "border-slate-200 hover:shadow-lg"
              }`}
            >
              <div className="relative h-24 w-full overflow-hidden">
                <Image
                  src={resim.url}
                  alt={`${baslik} fotoğraf`}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Fotoğraf Galerisi</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{resimler.length} fotoğraf</h2>
        <p className="mt-3 text-slate-600">Bu ilana eklenen tüm fotoğrafları buradan görüntüleyebilirsiniz.</p>
      </div>
    </div>
  );
}
