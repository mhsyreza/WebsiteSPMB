import { Target, Eye, Star } from 'lucide-react';

const misi = [
  'Menyelenggarakan pembelajaran berbasis nilai-nilai Islam yang mengintegrasikan ilmu pengetahuan, teknologi, dan akhlakul karimah.',
  'Mengembangkan kompetensi keahlian siswa sesuai standar industri melalui kurikulum yang relevan dan terus diperbarui.',
  'Membangun kemitraan strategis dengan dunia usaha dan industri untuk mendukung praktik kerja dan penyerapan lulusan.',
  'Menyediakan lingkungan belajar yang kondusif, religius, dan mendukung kreativitas serta inovasi siswa.',
  'Mencetak lulusan yang berkarakter, mandiri, berdaya saing, dan siap menghadapi tantangan era global.',
];

export default function VisiMisi() {
  return (
    <section id="visi-misi" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
            Identitas Sekolah
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-gray-900 mb-4">
            Visi &amp; Misi
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Landasan dan arah tujuan SMK Media Teknologi dalam mencetak generasi unggul
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Visi */}
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-purple-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-3">Visi</p>
              <h3 className="font-display font-black text-2xl leading-tight mb-4">
                Terwujudnya SMK yang Islami, Bermutu, dan Berdaya Saing
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Menjadi sekolah menengah kejuruan terkemuka yang menghasilkan lulusan beriman,
                berakhlak mulia, kompeten di bidangnya, serta mampu bersaing di tingkat nasional
                dan internasional berdasarkan nilai-nilai keislaman.
              </p>
            </div>
          </div>

          {/* Misi */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Misi</p>
                <p className="font-display font-bold text-gray-900">Langkah Nyata Kami</p>
              </div>
            </div>
            <div className="space-y-3">
              {misi.map((m, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-[11px] font-black flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{m}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sejarah singkat */}
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-xl mb-3">Sejarah Singkat</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                Yayasan Nurul Falah yang sudah berdiri pada tahun <strong>1997</strong> melanjutkan pengembangan unit
                sekolah pada tingkat menengah atas. SMK Media Teknologi didirikan atas kerjasama Ketua Yayasan
                <strong> Bapak H. Ahmad Dahlan, S.Pd.I</strong> dan <strong>Bapak Nurdin Budiyanto, M.Pd</strong>.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                Pada bulan Juli 2007 mendapatkan izin pendirian SMK dari Dinas Pendidikan Kabupaten Bogor
                <strong> No. 421/414-Disdik Tanggal 10 November 2008</strong>. Di awal pendirian,
                SMK Media Teknologi mengembangkan kompetensi keahlian Multimedia (MM) dan Teknik Sepeda Motor (TSM).
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Pada tahun <strong>2017</strong> berdirilah kompetensi keahlian Administrasi Perkantoran (AP) yang
                kini berkembang menjadi <strong>Manajemen Perkantoran dan Layanan Bisnis (MPLB)</strong>. Saat ini
                SMK Media Teknologi telah mencetak lebih dari <strong>2.500 alumni</strong> yang tersebar di berbagai
                bidang industri.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
