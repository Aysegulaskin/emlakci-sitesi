"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSetupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const response = await fetch("/api/admin/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    setIsLoading(false);

    if (!response.ok) {
      const result = await response.json();
      setError(result?.error || "Kullanıcı oluşturulurken bir hata oluştu.");
      return;
    }

    router.push("/admin/giris");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 text-slate-900">
      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-700">
          {error}
        </div>
      )}
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">İsim</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">E-posta</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">Şifre</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
        />
      </label>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-3xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoading ? "Oluşturuluyor..." : "Yönetici Oluştur"}
      </button>
      <p className="text-sm text-slate-500">
        Bu işlemle sadece ilk yönetici kaydedilir. Sonraki yönetici için giriş yapıp panelden devam edebilirsiniz.
      </p>
    </form>
  );
}
