import { ChevronRight, Palette, Briefcase, Wrench } from 'lucide-react';

type Page = 'home' | 'daftar' | 'cek' | 'admin';
interface Props { onNav: (p: Page) => void; }

const jurusan = [
  {
    id: 'DKV',
    name: 'Desain Komunikasi Visual',
    short: 'DKV',
    icon: Palette,
    badge: 'Kuota 36 siswa',
    tagline: 'Mari Berkreasi',
    desc: 'DKV adalah cabang ilmu desain yang mempelajari konsep komunikasi dan ungkapan kreatif, teknik dan media dengan memanfaatkan elemen-elemen visual untuk menyampaikan pesan. Perpaduan seni desain tradisional dengan teknologi digital.',
    tujuan: 'Membekali peserta didik dengan pengetahuan, keterampilan, kreatif, jujur dan mandiri serta sikap profesional kerja agar kompeten di bidang Desain Komunikasi Visual.',
    skills: ['Desain Grafis & Layout', 'Fotografi & Videografi', 'Animasi 2D/3D', 'Branding & Identitas Visual', 'Ilustrasi Digital'],
    career: ['Graphic Designer', 'UI/UX Designer', 'Fotografer', 'Content Creator', 'Animator'],
    img: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    gradClass: 'from-violet-600 to-pink-500',
    light: 'bg-violet-50',
    text: 'text-violet-600',
  },
  {
    id: 'MPLB',
    name: 'Manajemen Perkantoran dan Layanan Bisnis',
    short: 'MPLB',
    icon: Briefcase,
    badge: 'Kuota 36 siswa',
    tagline: 'Siap Kerja!',
    desc: 'MPLB mempelajari segala jenis kegiatan kantor, mulai dari pembukuan, pengarsipan, hingga public relations. Lulusannya siap bekerja di lingkungan perkantoran dan berperan menjaga kelancaran operasional kantor.',
    tujuan: 'Menerapkan dan mengembangkan kemampuan dalam mengelola dokumen kantor, berkomunikasi profesional, mengelola agenda kerja, serta memberikan pelayanan prima kepada pelanggan.',
    skills: ['Administrasi & Pengarsipan', 'Korespondensi Bisnis', 'Manajemen Agenda Pimpinan', 'Layanan Prima (Customer Service)', 'Pengelolaan Kas Kecil'],
    career: ['Sekretaris', 'Administrator', 'Customer Service', 'Manajer Operasional', 'Wirausaha'],
    img: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    gradClass: 'from-sky-500 to-teal-500',
    light: 'bg-sky-50',
    text: 'text-sky-600',
  },
  {
    id: 'Otomotif',
    name: 'Teknik Otomotif',
    short: 'Teknik Otomotif',
    icon: Wrench,
    badge: 'Kuota 36 siswa',
    tagline: 'Siap Jadi Mekanik',
    desc: 'Teknik Otomotif mempelajari tentang bagaimana merancang, membuat dan mengembangkan alat-alat transportasi darat, terutama sepeda motor. Menggabungkan elemen mekanika, listrik, elektronik, dan manajemen.',
    tujuan: 'Membekali peserta didik dengan pengetahuan, sikap, dan keterampilan agar kompeten di bidang Teknik Otomotif sehingga mampu merawat, memperbaiki, dan mengembangkan kendaraan bermotor.',
    skills: ['Perawatan & Perbaikan Mesin', 'Sistem Kelistrikan Kendaraan', 'Elektronika Otomotif', 'Keselamatan Kerja (K3)', 'Tune-Up & Diagnosa'],
    career: ['Teknisi Otomotif', 'Mekanik Profesional', 'Wirausaha Bengkel', 'Quality Control', 'Instruktur Teknik'],
    img: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=800',
    gradClass: 'from-orange-500 to-red-500',
    light: 'bg-orange-50',
    text: 'text-orange-600',
  },
];

export default function Jurusan({ onNav }: Props) {
  return (
    <section id="jurusan" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
            Konsentrasi Keahlian
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-gray-900 mb-4">
            Terdapat 3 Kompetensi Keahlian
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Yang bisa kalian pilih sesuai dengan minat kalian! Setiap jurusan dirancang untuk
            membentuk lulusan yang kompeten, berkarakter, dan siap kerja.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {jurusan.map((j, i) => {
            const Icon = j.icon;
            return (
              <div key={j.id} className="card-tilt bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col"
                style={{ animationDelay: `${i * 0.1}s` }}>
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img src={j.img} alt={j.name} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${j.gradClass} opacity-80`} />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-yellow-300 text-xs font-bold italic mb-0.5">{j.tagline}</span>
                    <span className="text-white/80 text-xs font-bold uppercase tracking-widest">{j.short}</span>
                    <h3 className="text-white font-display font-black text-lg leading-tight">{j.name}</h3>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {j.badge}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{j.desc}</p>

                  <div className="mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Tujuan Keahlian</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{j.tujuan}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kompetensi Utama</p>
                    <ul className="space-y-1.5">
                      {j.skills.map(s => (
                        <li key={s} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${j.gradClass} flex-shrink-0`} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Prospek Karir</p>
                    <div className="flex flex-wrap gap-1.5">
                      {j.career.map(c => (
                        <span key={c} className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${j.light} ${j.text}`}>{c}</span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onNav('daftar')}
                    className={`mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white
                      bg-gradient-to-r ${j.gradClass} shadow-lg hover:scale-[1.02] transition-transform btn-ripple`}
                  >
                    Pilih Jurusan Ini <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
