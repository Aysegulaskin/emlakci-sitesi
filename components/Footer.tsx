import Link from "next/link";
import { Home, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & açıklama */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Emlak<span className="text-blue-400">Pro</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Hayalinizdeki evi bulmak artık çok daha kolay. Güvenilir ve profesyonel
              emlak hizmetleri için doğru adres.
            </p>
            {/* Sosyal medya hesapları proje gereksinimine göre kaldırıldı */}
          </div>

          {/* Hızlı bağlantılar */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
              <li><Link href="/ilanlar?tip=SATILIK" className="hover:text-white transition-colors">Satılık İlanlar</Link></li>
              <li><Link href="/ilanlar?tip=KIRALIK" className="hover:text-white transition-colors">Kiralık İlanlar</Link></li>
              <li><Link href="/ilanlar" className="hover:text-white transition-colors">Tüm İlanlar</Link></li>
              <li><Link href="/favoriler" className="hover:text-white transition-colors">Favorilerim</Link></li>
              <li><Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* Kategoriler */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kategoriler</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ilanlar?kategori=DAIRE" className="hover:text-white transition-colors">Daire</Link></li>
              <li><Link href="/ilanlar?kategori=VILLA" className="hover:text-white transition-colors">Villa</Link></li>
              <li><Link href="/ilanlar?kategori=ARSA" className="hover:text-white transition-colors">Arsa</Link></li>
              <li><Link href="/ilanlar?kategori=ISYERI" className="hover:text-white transition-colors">İşyeri</Link></li>
              <li><Link href="/ilanlar?kategori=BINA" className="hover:text-white transition-colors">Bina</Link></li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-white font-semibold mb-4">İletişim</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <span>Bağcılar Mah. Emlak Sok. No:12<br />İstanbul, Türkiye</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <a href="tel:08501234567" className="hover:text-white transition-colors">0850 123 45 67</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <a href="mailto:info@emlakpro.com.tr" className="hover:text-white transition-colors">info@emlakpro.com.tr</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <span>© 2024 EmlakPro. Tüm hakları saklıdır.</span>
          <Link href="/admin/giris" className="hover:text-gray-300 transition-colors">Admin Girişi</Link>
        </div>
      </div>
    </footer>
  );
}
