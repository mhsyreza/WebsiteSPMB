import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, ShieldCheck } from 'lucide-react';

type Page = 'home' | 'daftar' | 'cek' | 'admin';
interface Props { onNav: (p: Page) => void; }

export default function Footer({ onNav }: Props) {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Ticker */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 py-2.5 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-track text-white text-xs font-bold gap-12">
            {Array.from({ length: 2 }).flatMap(() => [
              '🎓 PPDB 2025/2026 DIBUKA',
              '📋 Kuota Terbatas – Segera Daftar!',
              '✅ 3 Jurusan Unggulan: DKV · MPLB · Teknik Otomotif',
              '📅 Pendaftaran: 1 Juli – 31 Agustus 2025',
              '🏆 Akreditasi A · Islamic Technopreneur Vocational School',
              '📍 Bojonggede, Kabupaten Bogor, Jawa Barat',
            ]).map((t, i) => (
              <span key={i} className="mx-8">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logoweb.png" alt="Logo SMK Media Teknologi" className="h-14 w-14 object-contain" />
            <div>
              <p className="font-display font-black text-white text-lg leading-tight">SMK Media Teknologi</p>
              <p className="text-yellow-400 text-xs">Yayasan Pendidikan Islam Nurul Falah</p>
              <p className="text-gray-500 text-[10px]">Islamic Technopreneur Vocational School</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Sekolah Menengah Kejuruan yang berfokus pada pembentukan generasi yang beriman,
            berakhlak mulia, dan kompeten. Mengintegrasikan pendidikan karakter Islami dengan
            pembelajaran vokasi yang relevan dengan kebutuhan dunia kerja.
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/smkmediatek"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/@Smkmediatek"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <button className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-display font-bold text-white mb-4">PPDB Online</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Pendaftaran Baru', page: 'daftar' as Page },
              { label: 'Cek Status Pendaftaran', page: 'cek' as Page },
            ].map(({ label, page }) => (
              <li key={label}>
                <button onClick={() => onNav(page)} className="text-gray-400 hover:text-orange-400 transition-colors">
                  {label}
                </button>
              </li>
            ))}
            <li className="pt-2 border-t border-gray-800">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Jurusan</p>
            </li>
            {[
              'Desain Komunikasi Visual (DKV)',
              'Manajemen Perkantoran & LB (MPLB)',
              'Teknik Otomotif',
            ].map(l => (
              <li key={l} className="text-gray-500 text-xs">{l}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-bold text-white mb-4">Kontak Kami</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5 text-gray-400">
              <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>
                Jalan Jambu Kel No.10, RT.02/RW.08, Pabuaran,
                Kec. Bojonggede, Kab. Bogor, Jawa Barat 16922
              </span>
            </li>
            <li className="flex items-center gap-2.5 text-gray-400">
              <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
              <a href="https://wa.me/6289535784102" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                +62 8953 5784 1025
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-gray-400">
              <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <a href="mailto:tugas.mediatek@gmail.com" className="hover:text-blue-400 transition-colors">
                tugas.mediatek@gmail.com
              </a>
            </li>
          </ul>

          <div className="mt-5 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
            <a
              href="https://wa.me/6289535784102"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-400 text-xs font-bold hover:text-green-300 transition-colors"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Ada Pertanyaan? Chat WA Langsung
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 SMK Media Teknologi · Yayasan Pendidikan Islam Nurul Falah. Hak Cipta Dilindungi.</p>
          <button
            onClick={() => onNav('admin')}
            className="flex items-center gap-1.5 hover:text-gray-300 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Portal Administrator
          </button>
        </div>
      </div>
    </footer>
  );
}
