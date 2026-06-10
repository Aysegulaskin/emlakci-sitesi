"use client";

import { useState, useEffect } from "react";

export function useFavori(ilanId: string) {
  const [favoriMi, setFavoriMi] = useState(false);

  useEffect(() => {
    const favoriler = JSON.parse(localStorage.getItem("favoriler") || "[]");
    setFavoriMi(favoriler.includes(ilanId));
  }, [ilanId]);

  const toggle = () => {
    const favoriler: string[] = JSON.parse(
      localStorage.getItem("favoriler") || "[]"
    );
    let yeniFavoriler: string[];

    if (favoriler.includes(ilanId)) {
      yeniFavoriler = favoriler.filter((id) => id !== ilanId);
    } else {
      yeniFavoriler = [...favoriler, ilanId];
    }

    localStorage.setItem("favoriler", JSON.stringify(yeniFavoriler));
    setFavoriMi(!favoriMi);

    // Custom event fırlat
    window.dispatchEvent(new Event("favoriGuncellendi"));
  };

  return { favoriMi, toggle };
}

export function getFavoriler(): string[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("favoriler") || "[]");
}
