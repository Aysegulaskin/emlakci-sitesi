import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminGirisForm from "@/components/AdminGirisForm";

export const metadata = {
  title: "Admin Girişi | EmlakPro",
};

async function noAdminExists() {
  return (await prisma.user.count()) === 0;
}

export default async function AdminGirisPage() {
  const session = await auth();
  if (session) {
    redirect("/admin");
  }

  const showSetup = await noAdminExists();

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-lg">
          <div className="mb-8 text-center">
            <p className="text-sm text-slate-500">Yönetici Girişi</p>
            <h1 className="text-3xl font-semibold text-slate-900">EmlakPro Admin Paneli</h1>
            <p className="mt-2 text-slate-600">Lütfen e-posta ve şifrenizle giriş yapın.</p>
          </div>
          <AdminGirisForm />
          {showSetup && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-700">
              <p>Henüz yönetici hesabı yoksa</p>
              <a href="/admin/setup" className="font-semibold text-blue-700 hover:text-blue-800">
                buradan ilk yöneticiyi oluşturabilirsiniz.
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
