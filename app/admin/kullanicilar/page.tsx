import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminUserForm from "@/components/AdminUserForm";

export const metadata = {
  title: "Yönetici Hesapları | EmlakPro",
};

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/giris");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="rounded-3xl bg-white p-10 shadow-lg">
            <div className="mb-6">
              <p className="text-sm text-slate-500">Yönetici Hesapları</p>
              <h1 className="text-3xl font-semibold text-slate-900">Admin paneline kullanıcı ekle</h1>
              <p className="mt-2 text-slate-600">
                Buradan yeni yönetici hesabı oluşturabilir, toplamda en fazla 5 yönetici hesabı barındırabilirsiniz.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <AdminUserForm />
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-medium text-slate-700">Mevcut Yönetici Sayısı</p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">{users.length}/5</p>
                <div className="mt-6 space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      <p className="text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString("tr-TR")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
