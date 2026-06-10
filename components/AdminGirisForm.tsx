"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminGirisForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/admin",
    });

    setIsLoading(false);

    if (result?.error) {
      setError("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
      return;
    }

    if (result?.ok) {
      router.push("/admin");
      return;
    }

    setError("Giriş yapılırken bir hata oluştu.");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 text-slate-900">
      {error && <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-700">{error}</div>}
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">E-posta</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">Şifre</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
        />
      </label>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-3xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
      <p className="text-sm text-slate-500">
        Yönetici hesabınız yoksa önce siteye ilk giriş için ilk yönetici hesabını oluşturun. Sonraki yöneticileri admin panelinden ekleyebilirsiniz.
      </p>
    </form>
  );
}
