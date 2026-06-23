import { ClipboardList, Upload, Search, CheckCircle2, UserCheck, BookOpen, Phone, Mail } from 'lucide-react';

const steps = [
  { no: 1, icon: ClipboardList, title: 'Isi Formulir Online', desc: 'Lengkapi data diri, pilih jurusan (DKV, MPLB, atau Teknik Otomotif), dan isi data orang tua melalui formulir pendaftaran online.', color: 'from-red-500 to-orange-400' },
  { no: 2, icon: Upload, title: 'Siapkan Berkas', desc: 'Siapkan dokumen persyaratan: ijazah, rapor semester 1–5, pas foto berlatar merah, KTP orang tua, dan kartu keluarga.', color: 'from-orange-400 to-yellow-400' },
  { no: 3, icon: Search, title: 'Verifikasi Berkas', desc: 'Panitia PPDB akan memeriksa kelengkapan dan keabsahan seluruh dokumen yang telah disiapkan.', color: 'from-yellow-400 to-green-400' },
  { no: 4, icon: CheckCircle2, title: 'Tes Seleksi', desc: 'Calon peserta yang lulus verifikasi berkas akan mengikuti tes seleksi masuk yang diselenggarakan sekolah.', color: 'from-green-400 to-teal-500' },
  { no: 5, icon: UserCheck, title: 'Pengumuman Hasil', desc: 'Hasil seleksi diumumkan melalui website ini. Gunakan nomor pendaftaran untuk mengecek status.', color: 'from-teal-500 to-blue-500' },
  { no: 6, icon: BookOpen, title: 'Daftar Ulang', desc: 'Peserta yang diterima wajib melakukan daftar ulang sesuai jadwal dan memulai perjalanan belajar bersama kami.', color: 'from-blue-500 to-violet-500' },
];

const syarat = [
  'Fotokopi Ijazah/STTB SMP/MTs (dilegalisir)',
  'Fotokopi Rapor semester 1 – 5',
  'Pas foto 3×4 berlatar merah (4 lembar)',
  'Fotokopi Kartu Keluarga',
  'Fotokopi KTP Orang Tua/Wali',
  'Surat Keterangan Sehat dari dokter',
];

const jadwal = [
  { label: 'Pendaftaran Online', val: '1 Juli – 31 Agustus 2025' },
  { label: 'Verifikasi Berkas', val: '1 – 10 September 2025' },
  { label: 'Tes Seleksi', val: '15 September 2025' },
  { label: 'Pengumuman', val: '20 September 2025' },
  { label: 'Daftar Ulang', val: '21 – 30 September 2025' },
];

export default function Alur() {
  return (
    <section id="alur" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
            Prosedur Pendaftaran
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-gray-900 mb-4">
            Alur Pendaftaran PPDB
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Ikuti 6 langkah mudah untuk mendaftarkan diri ke SMK Media Teknologi.
            Untuk informasi lebih lanjut, hubungi panitia kami.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.no} className="card-tilt bg-gray-50 rounded-2xl p-6 border border-gray-100 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color}`} />
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                      Langkah {s.no}
                    </p>
                    <h3 className="font-display font-bold text-gray-900 text-base mb-1.5">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Syarat + Jadwal */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Syarat */}
          <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-7 text-white shadow-xl shadow-orange-200">
            <h3 className="font-display font-black text-xl mb-5">Persyaratan Dokumen</h3>
            <ul className="space-y-3">
              {syarat.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Jadwal */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-7 text-white shadow-xl shadow-blue-200">
            <h3 className="font-display font-black text-xl mb-5">Jadwal Kegiatan PPDB</h3>
            <div className="space-y-3">
              {jadwal.map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between bg-white/15 rounded-xl px-4 py-2.5 text-sm">
                  <span className="text-white/80 font-medium">{label}</span>
                  <span className="font-bold text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gray-900 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-white text-lg mb-1">Ada pertanyaan tentang PPDB?</p>
            <p className="text-gray-400 text-sm">Hubungi panitia kami langsung untuk informasi lebih lanjut</p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <a
              href="https://wa.me/6289535784102"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-white font-bold text-sm rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4" /> WhatsApp
            </a>
            <a
              href="mailto:tugas.mediatek@gmail.com"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition-colors border border-white/20"
            >
              <Mail className="w-4 h-4" /> Email Kami
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
