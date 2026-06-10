"use client";

import { useState, useEffect } from "react";

// localStorage favori (misafir kullanıcılar)
export function useFavori(ilanId: string, sessionUserId?: string) {
  const [favoriMi, setFavoriMi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    if (sessionUserId) {
      // Giriş yapmış: API'dan kontrol et
      fetch(`/api/kullanici/favoriler/kontrol?ilanId=${ilanId}`)
        .then((r) => r.json())
        .then((d) => setFavoriMi(d.favori === true))
        .catch(() => {});
    } else {
      // Misafir: localStorage
      const favoriler = JSON.parse(localStorage.getItem("favoriler") || "[]");
      setFavoriMi(favoriler.includes(ilanId));
    }
  }, [ilanId, sessionUserId]);

  const toggle = async () => {
    if (yukleniyor) return;
    setYukleniyor(true);

    if (sessionUserId) {
      const res = await fetch("/api/kullanici/favoriler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ilanId }),
      });
      const data = await res.json();
      setFavoriMi(data.favori);
    } else {
      const favoriler: string[] = JSON.parse(localStorage.getItem("favoriler") || "[]");
      const yeni = favoriler.includes(ilanId)
        ? favoriler.filter((id) => id !== ilanId)
        : [...favoriler, ilanId];
      localStorage.setItem("favoriler", JSON.stringify(yeni));
      setFavoriMi(!favoriMi);
      window.dispatchEvent(new Event("favoriGuncellendi"));
    }

    setYukleniyor(false);
  };

  return { favoriMi, toggle, yukleniyor };
}

export function getFavoriler(): string[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("favoriler") || "[]");
}
