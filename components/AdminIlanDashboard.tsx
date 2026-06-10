"use client";

import { useEffect, useState } from "react";
import AdminIlanForm from "@/components/AdminIlanForm";

type IlanOzellik = {
  id: string;
  ad: string;
};

type IlanResim = {
  id: string;
  url: string;
  sira: number;
};

type AdminIlan = {
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
  aktif: boolean;
  one_cikan: boolean;
  resimler: IlanResim[];
  ozellikler: IlanOzellik[];
  createdAt: string;
};

export default function AdminIlanDashboard({ ilanlar }: { ilanlar: AdminIlan[] }) {
  const [list, setList] = useState<AdminIlan[]>(ilanlar);
  const [selectedIlan, setSelectedIlan] = useState<AdminIlan | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setList(ilanlar);
  }, [ilanlar]);

  const onSuccess = (ilan: AdminIlan) => {
    setStatusMessage(selectedIlan ? "İlan başarıyla güncellendi." : "İlan başarıyla oluşturuldu.");
    setErrorMessage(null);
    setSelectedIlan(null);

    setList((prev) => {
      if (prev.some((item) => item.id === ilan.id)) {
        return prev.map((item) => (item.id === ilan.id ? ilan : item));
      }
      return [ilan, ...prev];
    });
  };

  const handleEdit = (ilan: AdminIlan) => {
    setStatusMessage(null);
    setErrorMessage(null);
    setSelectedIlan(ilan);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Bu ilanı silmek istediğinizden emin misiniz?");
    if (!confirmed) return;

    setErrorMessage(null);
    setStatusMessage(null);

    const response = await fetch(`/api/ilanlar/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json();
      setErrorMessage(result?.error || "İlan silinirken bir hata oluştu.");
      return;
    }

    setList((prev) => prev.filter((item) => item.id !== id));
    setStatusMessage("İlan başarıyla silindi.");
    if (selectedIlan?.id === id) {
      setSelectedIlan(null);
    }
  };

  const handleCancelEdit = () => {
    setSelectedIlan(null);
    setStatusMessage(null);
    setErrorMessage(null);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr]">
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">İlan Yönetimi</p>
              <h2 className="text-2xl font-semibold text-slate-900">Yeni ilan ekle ya da mevcut ilanı düzenle</h2>
            </div>
            {selectedIlan && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Düzenlemeyi İptal Et
              </button>
            )}
          </div>

          {statusMessage && (
            <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-700">
              {statusMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-700">
              {errorMessage}
            </div>
          )}

          <div className="mt-6">
            <AdminIlanForm
              selectedIlan={selectedIlan}
              onSuccess={onSuccess}
              onCancelEdit={handleCancelEdit}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Mevcut İlanlar</p>
              <h2 className="text-2xl font-semibold text-slate-900">Tüm ilanları görüntüle</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              {list.length} ilan
            </span>
          </div>

          <div className="space-y-4">
            {list.length === 0 ? (
              <p className="text-sm text-slate-500">Henüz ilan bulunmuyor.</p>
            ) : (
              <div className="space-y-4">
                {list.map((ilan) => (
                  <div key={ilan.id} className="rounded-3xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{ilan.baslik}</h3>
                        <p className="mt-1 text-sm text-slate-500">{ilan.il}, {ilan.ilce} • {ilan.kategori} • {ilan.tip}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(ilan)}
                          className="rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition"
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ilan.id)}
                          className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
                      <span>{ilan.fiyat.toLocaleString()} TL</span>
                      <span>|</span>
                      <span>{ilan.metrekare} m²</span>
                      <span>|</span>
                      <span>{ilan.odaSayisi || "Oda bilgisi yok"}</span>
                      <span>|</span>
                      <span>{ilan.aktif ? "Yayında" : "Pasif"}</span>
                      {ilan.one_cikan && <span className="rounded-full bg-yellow-100 px-2 py-1 text-yellow-800">Öne çıkan</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
