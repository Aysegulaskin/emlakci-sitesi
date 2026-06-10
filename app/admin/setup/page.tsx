import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminSetupForm from "@/components/AdminSetupForm";

export const metadata = {
  title: "Admin Kurulum | EmlakPro",
};

export const dynamic = "force-dynamic";

async function adminExists() {
  return (await prisma.user.count()) > 0;
}

export default async function AdminSetupPage() {
  if (await adminExists()) {
    redirect("/admin/giris");
  }

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-lg">
          <div className="mb-8 text-center">
            <p className="text-sm text-slate-500">İlk Yönetici Oluşturma</p>
            <h1 className="text-3xl font-semibold text-slate-900">EmlakPro Yönetici Hesabı</h1>
            <p className="mt-2 text-slate-600">
              Bu sayfadan sadece ilk yönetici hesabını oluşturabilirsiniz. Sonrasında giriş yapın.
            </p>
          </div>
          <AdminSetupForm />
        </div>
      </div>
    </main>
  );
}
