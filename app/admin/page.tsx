import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminIlanDashboard from "@/components/AdminIlanDashboard";

export const metadata = {
  title: "Admin Panel | EmlakPro",
};

async function getAdminIlanlar() {
  const ilanlar = await prisma.ilan.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      resimler: { orderBy: { sira: "asc" } },
      ozellikler: true,
    },
  });

  return ilanlar.map((ilan) => ({
    ...ilan,
    createdAt: ilan.createdAt.toISOString(),
  }));
}

export default async function AdminPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/giris");
  }

  const ilanlar = await getAdminIlanlar();

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Yönetici Paneli</p>
              <h1 className="text-3xl font-semibold text-slate-900">İlan Yönetim Paneli</h1>
              <p className="mt-2 text-slate-600 max-w-2xl">
                Bu panelden ilanları hızlıca düzenleyebilir, silebilir ve yeni ilan ekleyebilirsiniz.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-100 p-5">
              <p className="text-sm text-slate-500">Giriş yapan kullanıcı</p>
              <p className="mt-1 text-lg font-medium text-slate-900">{session.user?.name ?? session.user?.email}</p>
              <p className="mt-1 text-sm text-slate-500">Rol: {session.user?.role ?? "ADMIN"}</p>
              <div className="mt-4">
                <a
                  href="/admin/kullanicilar"
                  className="inline-flex rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition"
                >
                  Yönetici Hesapları
                </a>
              </div>
            </div>
          </div>
        </div>

        <AdminIlanDashboard ilanlar={ilanlar} />
      </div>
    </main>
  );
}
