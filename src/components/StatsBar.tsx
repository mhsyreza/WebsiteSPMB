import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

const schoolStats = [
  { label: 'Guru Tersertifikasi', val: 11, gradient: 'from-blue-500 to-cyan-400', icon: '👨‍🏫', suffix: '' },
  { label: 'Program Keahlian', val: 3, gradient: 'from-violet-500 to-pink-500', icon: '📚', suffix: '' },
  { label: 'Alumni', val: 2500, gradient: 'from-green-500 to-emerald-400', icon: '🎓', suffix: '+' },
  { label: 'Siswa Aktif', val: 400, gradient: 'from-orange-500 to-red-400', icon: '👥', suffix: '+' },
];

const ppdbItems = [
  { label: 'Total Pendaftar', key: 'total', gradient: 'from-red-500 to-orange-400', icon: '📋' },
  { label: 'Desain Komunikasi Visual', key: 'dkv', gradient: 'from-purple-500 to-pink-500', icon: '🎨' },
  { label: 'Manajemen Perkantoran', key: 'mplb', gradient: 'from-blue-500 to-cyan-400', icon: '💼' },
  { label: 'Teknik Otomotif', key: 'otomotif', gradient: 'from-green-500 to-emerald-400', icon: '🔧' },
  { label: 'Diterima', key: 'diterima', gradient: 'from-emerald-500 to-teal-400', icon: '✅' },
  { label: 'Menunggu Verifikasi', key: 'pending', gradient: 'from-yellow-500 to-amber-400', icon: '⏳' },
];

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setVal(Math.round(eased * to));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref} className="animate-count">{val}{suffix}</span>;
}

export default function StatsBar() {
  const [stats, setStats] = useState({ total: 0, dkv: 0, mplb: 0, otomotif: 0, diterima: 0, pending: 0 });

  useEffect(() => {
    supabase.from('pendaftaran').select('jurusan,status').then(({ data }) => {
      if (!data) return;
      setStats({
        total: data.length,
        dkv: data.filter(d => d.jurusan === 'DKV').length,
        mplb: data.filter(d => d.jurusan === 'MPLB').length,
        otomotif: data.filter(d => d.jurusan === 'Otomotif').length,
        diterima: data.filter(d => d.status === 'diterima').length,
        pending: data.filter(d => d.status === 'pending').length,
      });
    });
  }, []);

  return (
    <>
      {/* School Stats */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-gradient-to-r from-blue-500 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
              Tentang Kami
            </span>
            <h2 className="font-display font-black text-4xl text-gray-900 mb-4">SMK Media Teknologi</h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              SMK Media Teknologi merupakan sekolah menengah kejuruan yang berfokus pada pembentukan generasi yang
              <strong className="text-gray-700"> beriman, berakhlak mulia, dan kompeten</strong>. Dengan menjunjung tinggi
              nilai-nilai keislaman, kami mengintegrasikan pendidikan karakter Islami dengan pembelajaran vokasi
              yang relevan dengan kebutuhan dunia kerja.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {schoolStats.map(({ label, val, gradient, icon, suffix }) => (
              <div key={label} className="card-tilt bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
                <div className="text-3xl mb-3">{icon}</div>
                <p className={`font-display font-black text-4xl bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-1`}>
                  <Counter to={val} suffix={suffix} />
                </p>
                <p className="text-gray-500 text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>

          {/* About section */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-yellow-400/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Islamic Technopreneur Vocational School
              </span>
              <h3 className="font-display font-black text-3xl text-white mb-4 leading-tight">
                Beriman, Berakhlak Mulia &amp; Kompeten
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Sejak berdiri pada tahun 2007 atas naungan Yayasan Nurul Falah, SMK Media Teknologi hadir
                di tengah masyarakat Bojonggede untuk menyediakan pendidikan vokasi berkualitas yang tidak
                hanya mengedepankan kompetensi kejuruan, tetapi juga pembentukan karakter Islami.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Didukung tenaga pendidik profesional dan lingkungan belajar yang religius, kami berkomitmen
                mencetak lulusan yang <strong className="text-white">siap kerja, berdaya saing, dan berakhlak baik</strong>.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Tahun Berdiri', val: '2007', icon: '🏫' },
                { label: 'Akreditasi', val: 'A', icon: '🏆' },
                { label: 'Kurikulum', val: 'Merdeka', icon: '📖' },
                { label: 'Izin Dinas Pendidikan', val: '2008', icon: '📜' },
              ].map(({ label, val, icon }) => (
                <div key={label} className="bg-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{icon}</div>
                  <p className="font-display font-black text-xl text-white">{val}</p>
                  <p className="text-gray-400 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PPDB Stats */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display font-black text-3xl text-gray-900 mb-2">Statistik PPDB 2025/2026</h2>
            <p className="text-gray-500 text-sm">Data pendaftaran diperbarui secara real-time</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {ppdbItems.map(({ label, key, gradient, icon }) => (
              <div key={key} className="card-tilt bg-white rounded-2xl shadow-md border border-gray-100 p-5 text-center">
                <div className="text-2xl mb-2">{icon}</div>
                <p className={`font-display font-black text-3xl bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-1`}>
                  <Counter to={(stats as Record<string, number>)[key]} />
                </p>
                <p className="text-gray-500 text-[11px] font-medium leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
