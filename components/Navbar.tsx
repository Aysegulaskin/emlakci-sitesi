"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Home, Search, Heart, Mail, Phone, User, LogOut, LogIn } from "lucide-react";

export default function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false);
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Üst bar */}
      <div className="bg-blue-700 text-white text-sm">
        <div className="container mx-auto px-4 py-1.5 flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            0850 123 45 67
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            info@emlakpro.com.tr
          </span>
        </div>
      </div>

      {/* Ana nav */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center group-hover:bg-blue-800 transition-colors">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Emlak<span className="text-blue-700">Pro</span>
            </span>
          </Link>

          {/* Desktop menü */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">Ana Sayfa</Link>
            <Link href="/ilanlar?tip=SATILIK" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">Satılık</Link>
            <Link href="/ilanlar?tip=KIRALIK" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">Kiralık</Link>
            <Link href="/ilanlar" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">Tüm İlanlar</Link>
            <Link href="/iletisim" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">İletişim</Link>
            {isAdmin && (
              <Link href="/admin" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">Admin</Link>
            )}
          </div>

          {/* Sağ butonlar */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/favoriler" className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 font-medium transition-colors px-3 py-2">
              <Heart className="w-4 h-4" />
              Favoriler
            </Link>

            {session ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {session.user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 font-medium transition-colors px-3 py-2"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/giris" className="flex items-center gap-1.5 text-gray-600 hover:text-blue-700 font-medium transition-colors px-3 py-2">
                  <LogIn className="w-4 h-4" />
                  Giriş
                </Link>
                <Link href="/kayit" className="flex items-center gap-1.5 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 font-medium transition-colors">
                  Kayıt Ol
                </Link>
              </div>
            )}

            <Link href="/ilanlar" className="flex items-center gap-1.5 border border-blue-700 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium transition-colors">
              <Search className="w-4 h-4" />
              İlan Ara
            </Link>
          </div>

          {/* Mobil menü butonu */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuAcik(!menuAcik)}
          >
            {menuAcik ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobil menü */}
        {menuAcik && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4 flex flex-col gap-4">
            <Link href="/" className="text-gray-700 font-medium" onClick={() => setMenuAcik(false)}>Ana Sayfa</Link>
            <Link href="/ilanlar?tip=SATILIK" className="text-gray-700 font-medium" onClick={() => setMenuAcik(false)}>Satılık</Link>
            <Link href="/ilanlar?tip=KIRALIK" className="text-gray-700 font-medium" onClick={() => setMenuAcik(false)}>Kiralık</Link>
            <Link href="/ilanlar" className="text-gray-700 font-medium" onClick={() => setMenuAcik(false)}>Tüm İlanlar</Link>
            <Link href="/favoriler" className="text-gray-700 font-medium" onClick={() => setMenuAcik(false)}>Favoriler</Link>
            <Link href="/iletisim" className="text-gray-700 font-medium" onClick={() => setMenuAcik(false)}>İletişim</Link>
            {isAdmin && <Link href="/admin" className="text-gray-700 font-medium" onClick={() => setMenuAcik(false)}>Admin</Link>}
            {session ? (
              <button
                onClick={() => { setMenuAcik(false); signOut({ callbackUrl: "/" }); }}
                className="text-left text-red-600 font-medium"
              >
                Çıkış Yap ({session.user?.name})
              </button>
            ) : (
              <>
                <Link href="/giris" className="text-gray-700 font-medium" onClick={() => setMenuAcik(false)}>Giriş Yap</Link>
                <Link href="/kayit" className="text-gray-700 font-medium" onClick={() => setMenuAcik(false)}>Kayıt Ol</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
