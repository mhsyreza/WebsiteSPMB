import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

type Page = 'home' | 'daftar' | 'cek' | 'admin';

interface Props {
  current: Page;
  onNav: (p: Page) => void;
}

export default function Navbar({ current, onNav }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Beranda', target: 'home' as Page },
    { label: 'Jurusan', anchor: '#jurusan' },
    { label: 'Visi & Misi', anchor: '#visi-misi' },
    { label: 'Alur Daftar', anchor: '#alur' },
    { label: 'Pengumuman', anchor: '#pengumuman' },
    { label: 'Cek Pendaftaran', target: 'cek' as Page },
  ];

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-6">
        {/* Logo */}
        <button
          onClick={() => { onNav('home'); setOpen(false); }}
          className="flex items-center gap-2.5 flex-shrink-0"
        >
          <img src="/logoweb.png" alt="Logo" className="h-11 w-11 object-contain" />
          <div className="leading-none text-left">
            <p className={`font-display font-black text-sm ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              SMK Media Teknologi
            </p>
            <p className={`text-[10px] font-semibold ${scrolled ? 'text-orange-500' : 'text-yellow-300'}`}>
              PPDB 2025/2026 · Bojonggede, Bogor
            </p>
          </div>
        </button>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1 ml-auto">
          {links.map((l) =>
            l.target ? (
              <button
                key={l.label}
                onClick={() => { onNav(l.target!); setOpen(false); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  current === l.target
                    ? 'text-orange-500 bg-orange-50'
                    : scrolled
                    ? 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.label}
              </button>
            ) : (
              <button
                key={l.label}
                onClick={() => scrollTo(l.anchor!)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  scrolled
                    ? 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.label}
              </button>
            )
          )}
        </nav>

        {/* CTA button */}
        <button
          onClick={() => onNav('daftar')}
          className="hidden md:flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold text-white
            bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 shine-btn btn-ripple
            shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform ml-2"
        >
          Daftar Sekarang <ChevronRight className="w-4 h-4" />
        </button>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden ml-auto p-2 rounded-lg transition-colors ${
            scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
          }`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-xl animate-slide-up">
          <div className="px-4 py-4 flex flex-col gap-1">
            {links.map((l) =>
              l.target ? (
                <button
                  key={l.label}
                  onClick={() => { onNav(l.target!); setOpen(false); }}
                  className={`text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    current === l.target ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {l.label}
                </button>
              ) : (
                <button
                  key={l.label}
                  onClick={() => scrollTo(l.anchor!)}
                  className="text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  {l.label}
                </button>
              )
            )}
            <button
              onClick={() => { onNav('daftar'); setOpen(false); }}
              className="mt-2 w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-500 to-orange-500"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
