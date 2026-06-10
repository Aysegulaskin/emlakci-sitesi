"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

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
  resimler: { id: string; url: string; sira: number }[];
  ozellikler: { id: string; ad: string }[];
  createdAt: string;
};

const defaultFormState = {
  baslik: "",
  aciklama: "",
  fiyat: "",
  tip: "SATILIK",
  kategori: "DAIRE",
  il: "",
  ilce: "",
  adres: "",
  metrekare: "",
  odaSayisi: "",
  banyo: "",
  kat: "",
  toplamKat: "",
  isitma: "",
  binaYasi: "",
  oneCikan: false,
  aktif: true,
  ozellikler: "",
};

type FormState = typeof defaultFormState;

export default function AdminIlanForm({
  selectedIlan,
  onSuccess,
  onCancelEdit,
}: {
  selectedIlan?: AdminIlan | null;
  onSuccess: (ilan: AdminIlan) => void;
  onCancelEdit?: () => void;
}) {
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [images, setImages] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedIlan) {
      setForm({
        baslik: selectedIlan.baslik,
        aciklama: selectedIlan.aciklama,
        fiyat: selectedIlan.fiyat.toString(),
        tip: selectedIlan.tip,
        kategori: selectedIlan.kategori,
        il: selectedIlan.il,
        ilce: selectedIlan.ilce,
        adres: selectedIlan.adres,
        metrekare: selectedIlan.metrekare.toString(),
        odaSayisi: selectedIlan.odaSayisi ?? "",
        banyo: selectedIlan.banyo?.toString() ?? "",
        kat: selectedIlan.kat?.toString() ?? "",
        toplamKat: selectedIlan.toplamKat?.toString() ?? "",
        isitma: selectedIlan.isitma ?? "",
        binaYasi: selectedIlan.bina_yasi?.toString() ?? "",
        oneCikan: selectedIlan.one_cikan,
        aktif: selectedIlan.aktif,
        ozellikler: selectedIlan.ozellikler.map((item) => item.ad).join(", "),
      });
      setImages([]);
      setMessage(null);
      setError(null);
    } else {
      setForm(defaultFormState);
      setImages([]);
    }
  }, [selectedIlan]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = event.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setImages(Array.from(event.target.files));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    if (!event.dataTransfer.files) return;
    const droppedFiles = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
    if (droppedFiles.length > 0) {
      setImages(droppedFiles);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const uploadImages = async () => {
    if (!images.length) return [];

    const uploadPromises = images.map(async (file) => {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        throw new Error("Resim yüklemesi başarısız oldu.");
      }
      const result = await response.json();
      return result.url as string;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const resimUrls = await uploadImages();
      const ozellikler = form.ozellikler
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);

      const payload: Record<string, unknown> = {
        baslik: form.baslik,
        aciklama: form.aciklama,
        fiyat: parseFloat(form.fiyat),
        tip: form.tip,
        kategori: form.kategori,
        il: form.il,
        ilce: form.ilce,
        adres: form.adres,
        metrekare: parseInt(form.metrekare, 10),
        odaSayisi: form.odaSayisi || null,
        banyo: form.banyo ? parseInt(form.banyo, 10) : null,
        kat: form.kat ? parseInt(form.kat, 10) : null,
        toplamKat: form.toplamKat ? parseInt(form.toplamKat, 10) : null,
        isitma: form.isitma || null,
        bina_yasi: form.binaYasi ? parseInt(form.binaYasi, 10) : null,
        one_cikan: form.oneCikan,
        aktif: form.aktif,
        ozellikler,
      };

      if (resimUrls.length) {
        payload.resimler = resimUrls;
      }

      const method = selectedIlan ? "PUT" : "POST";
      const url = selectedIlan ? `/api/ilanlar/${selectedIlan.id}` : "/api/ilanlar";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result?.error || "İlan kaydedilemedi.");
      }

      const result = await response.json();
      setMessage(selectedIlan ? "İlan başarıyla güncellendi." : "İlan başarıyla yüklendi.");
      setForm(defaultFormState);
      setImages([]);
      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-8 shadow-lg">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Hızlı ilan ekleme</p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {selectedIlan ? "Seçili ilanı düzenle" : "Yeni ilan oluştur"}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {selectedIlan && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Düzenlemeyi İptal Et
            </button>
          )}
          <button
            type="button"
            className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 transition"
            onClick={() => signOut({ callbackUrl: "/admin/giris" })}
          >
            Oturumu Kapat
          </button>
        </div>
      </div>

      {message && <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-700">{message}</div>}
      {error && <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-700">{error}</div>}

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Başlık</span>
            <input
              name="baslik"
              value={form.baslik}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Fiyat (TL)</span>
            <input
              name="fiyat"
              type="number"
              min="0"
              step="0.01"
              value={form.fiyat}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Tip</span>
            <select
              name="tip"
              value={form.tip}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            >
              <option value="SATILIK">Satılık</option>
              <option value="KIRALIK">Kiralık</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Kategori</span>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            >
              <option value="DAIRE">Daire</option>
              <option value="VILLA">Villa</option>
              <option value="ARSA">Arsa</option>
              <option value="ISYERI">İşyeri</option>
              <option value="BINA">Bina</option>
            </select>
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">İl</span>
            <input
              name="il"
              value={form.il}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">İlçe</span>
            <input
              name="ilce"
              value={form.ilce}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Metrekare</span>
            <input
              name="metrekare"
              type="number"
              min="0"
              value={form.metrekare}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Oda Sayısı</span>
            <input
              name="odaSayisi"
              value={form.odaSayisi}
              onChange={handleChange}
              placeholder="3+1"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Banyo</span>
            <input
              name="banyo"
              type="number"
              min="0"
              value={form.banyo}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Kat / Toplam Kat</span>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                name="kat"
                type="number"
                min="0"
                value={form.kat}
                onChange={handleChange}
                placeholder="Kat"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              />
              <input
                name="toplamKat"
                type="number"
                min="0"
                value={form.toplamKat}
                onChange={handleChange}
                placeholder="Toplam"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              />
            </div>
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Adres</span>
          <input
            name="adres"
            value={form.adres}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Isıtma</span>
          <input
            name="isitma"
            value={form.isitma}
            onChange={handleChange}
            placeholder="Merkezi, Doğalgaz, Klima..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Bina Yaşı</span>
          <input
            name="binaYasi"
            type="number"
            min="0"
            value={form.binaYasi}
            onChange={handleChange}
            placeholder="0"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Açıklama</span>
          <textarea
            name="aciklama"
            value={form.aciklama}
            onChange={handleChange}
            rows={6}
            required
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Özellikler (virgülle ayırın)</span>
          <textarea
            name="ozellikler"
            value={form.ozellikler}
            onChange={handleChange}
            rows={3}
            placeholder="Site içinde, Otopark, Asansör"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Resimler (birden fazla seçebilirsiniz)</span>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex min-h-[140px] flex-col items-center justify-center rounded-3xl border-2 px-4 py-6 text-center transition ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-dashed border-slate-300 bg-slate-50"
            }`}
          >
            <p className="text-sm text-slate-600">
              Dosyaları buraya sürükleyin veya seçmek için tıklayın.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Birden fazla fotoğraf için Ctrl/Shift ile seçin.
            </p>
            <input
              type="file"
              multiple={true}
              accept="image/*"
              onChange={handleImageChange}
              className="mt-4 w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            />
          </div>
          {images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
              {images.map((file) => (
                <span key={`${file.name}-${file.size}`} className="rounded-full bg-slate-100 px-3 py-1">
                  {file.name}
                </span>
              ))}
            </div>
          )}
        </label>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="oneCikan"
                checked={form.oneCikan}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Öne çıkan ilan
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="aktif"
                checked={form.aktif}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Yayında
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-3xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Kaydediliyor..." : selectedIlan ? "İlanı Güncelle" : "İlanı Yayınla"}
          </button>
        </div>
      </form>
    </section>
  );
}
