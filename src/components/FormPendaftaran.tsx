import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, User, GraduationCap, Users, Check, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Page = 'home' | 'daftar' | 'cek' | 'admin';
interface Props { onNav: (p: Page) => void; }

type StepId = 1 | 2 | 3 | 4;

const JURUSAN = [
  { value: 'DKV', label: 'Desain Komunikasi Visual', icon: '🎨', color: 'border-violet-400 bg-violet-50' },
  { value: 'MPLB', label: 'Manajemen Perkantoran dan Layanan Bisnis', icon: '💼', color: 'border-sky-400 bg-sky-50' },
  { value: 'Otomotif', label: 'Teknik Otomotif', icon: '🔧', color: 'border-orange-400 bg-orange-50' },
];

interface FormState {
  nama_lengkap: string; nisn: string; nik: string; tempat_lahir: string;
  tanggal_lahir: string; jenis_kelamin: string; agama: string; alamat: string;
  nomor_hp: string; email: string; asal_sekolah: string; tahun_lulus: string;
  jurusan: string; nama_ayah: string; nama_ibu: string; pekerjaan_ayah: string;
  pekerjaan_ibu: string; nomor_hp_ortu: string;
}

const blank: FormState = {
  nama_lengkap:'', nisn:'', nik:'', tempat_lahir:'', tanggal_lahir:'',
  jenis_kelamin:'', agama:'', alamat:'', nomor_hp:'', email:'',
  asal_sekolah:'', tahun_lulus:'', jurusan:'', nama_ayah:'', nama_ibu:'',
  pekerjaan_ayah:'', pekerjaan_ibu:'', nomor_hp_ortu:'',
};

const ic = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all bg-white';
const lc = 'block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide';

export default function FormPendaftaran({ onNav }: Props) {
  const [step, setStep] = useState<StepId>(1);
  const [form, setForm] = useState<FormState>(blank);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState<{ nomor: string; nama: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = (): string => {
    if (step === 1) {
      if (!form.nama_lengkap.trim()) return 'Nama lengkap wajib diisi.';
      if (!form.jenis_kelamin) return 'Pilih jenis kelamin.';
      if (!form.agama) return 'Pilih agama.';
      if (!form.tanggal_lahir) return 'Tanggal lahir wajib diisi.';
      if (!form.alamat.trim()) return 'Alamat wajib diisi.';
    }
    if (step === 2) {
      if (!form.nomor_hp.trim()) return 'Nomor HP wajib diisi.';
      if (!form.asal_sekolah.trim()) return 'Asal sekolah wajib diisi.';
      if (!form.jurusan) return 'Pilih jurusan.';
    }
    if (step === 3) {
      if (!form.nama_ayah.trim()) return 'Nama ayah wajib diisi.';
      if (!form.nama_ibu.trim()) return 'Nama ibu wajib diisi.';
      if (!form.nomor_hp_ortu.trim()) return 'Nomor HP orang tua wajib diisi.';
    }
    return '';
  };

  const next = () => {
    const e = validate();
    if (e) { setErr(e); return; }
    setErr('');
    setStep((s) => Math.min(s + 1, 4) as StepId);
  };
  const back = () => { setErr(''); setStep((s) => Math.max(s - 1, 1) as StepId); };

  const submit = async () => {
    setLoading(true); setErr('');
    const { data, error } = await supabase.from('pendaftaran').insert([form]).select('nomor_pendaftaran,nama_lengkap').single();
    if (error || !data) {
      setErr('Gagal menyimpan data. Silakan coba lagi.');
      setLoading(false);
      return;
    }
    setResult({ nomor: data.nomor_pendaftaran, nama: data.nama_lengkap });
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result?.nomor ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { id: 1, label: 'Data Diri', icon: User },
    { id: 2, label: 'Sekolah & Jurusan', icon: GraduationCap },
    { id: 3, label: 'Orang Tua', icon: Users },
    { id: 4, label: 'Konfirmasi', icon: CheckCircle },
  ];

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-slide-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-display font-black text-2xl text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Halo <strong className="text-gray-800">{result.nama}</strong>, pendaftaran Anda telah diterima.
            Simpan nomor pendaftaran berikut untuk memantau status seleksi.
          </p>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-5 mb-6">
            <p className="text-xs text-gray-500 mb-1">Nomor Pendaftaran</p>
            <p className="font-display font-black text-3xl text-red-600 mb-3">{result.nomor}</p>
            <button onClick={copy} className="flex items-center gap-2 mx-auto text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Tersalin!' : 'Salin Nomor'}
            </button>
          </div>
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-left">
            <strong>Penting:</strong> Catat nomor pendaftaran Anda. Gunakan nomor ini untuk mengecek status
            pendaftaran melalui menu "Cek Pendaftaran".
          </p>
          <button onClick={() => onNav('home')} className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-400 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const jurusanObj = JURUSAN.find(j => j.value === form.jurusan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button onClick={() => onNav('home')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Beranda
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-3xl text-gray-900 mb-1">Formulir Pendaftaran PPDB</h1>
          <p className="text-gray-500 text-sm">SMK Media Teknologi · Tahun Ajaran 2025/2026</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    done ? 'bg-green-500 text-white' : active ? 'bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-lg shadow-orange-200' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] font-semibold hidden sm:block ${active ? 'text-orange-500' : 'text-gray-400'}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-10 sm:w-16 h-0.5 mb-4 transition-all ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
          {err && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              {err}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-slide-up">
              <h2 className="font-display font-black text-xl text-gray-900 mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" /> Data Diri Siswa
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={lc}>Nama Lengkap <span className="text-red-500 lowercase normal-case">*</span></label>
                  <input className={ic} placeholder="Sesuai ijazah" value={form.nama_lengkap} onChange={e => set('nama_lengkap', e.target.value)} />
                </div>
                <div>
                  <label className={lc}>NISN</label>
                  <input className={ic} placeholder="Nomor Induk Siswa Nasional" value={form.nisn} onChange={e => set('nisn', e.target.value)} />
                </div>
                <div>
                  <label className={lc}>NIK</label>
                  <input className={ic} placeholder="16 digit NIK" value={form.nik} onChange={e => set('nik', e.target.value)} />
                </div>
                <div>
                  <label className={lc}>Tempat Lahir</label>
                  <input className={ic} placeholder="Kota/Kabupaten" value={form.tempat_lahir} onChange={e => set('tempat_lahir', e.target.value)} />
                </div>
                <div>
                  <label className={lc}>Tanggal Lahir <span className="text-red-500 lowercase normal-case">*</span></label>
                  <input type="date" className={ic} value={form.tanggal_lahir} onChange={e => set('tanggal_lahir', e.target.value)} />
                </div>
                <div>
                  <label className={lc}>Jenis Kelamin <span className="text-red-500 lowercase normal-case">*</span></label>
                  <select className={ic} value={form.jenis_kelamin} onChange={e => set('jenis_kelamin', e.target.value)}>
                    <option value="">— Pilih —</option>
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className={lc}>Agama <span className="text-red-500 lowercase normal-case">*</span></label>
                  <select className={ic} value={form.agama} onChange={e => set('agama', e.target.value)}>
                    <option value="">— Pilih —</option>
                    {['Islam','Kristen','Katolik','Hindu','Budha','Konghucu'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={lc}>Alamat Lengkap <span className="text-red-500 lowercase normal-case">*</span></label>
                  <textarea className={`${ic} resize-none`} rows={3} placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kabupaten/Kota" value={form.alamat} onChange={e => set('alamat', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-slide-up">
              <h2 className="font-display font-black text-xl text-gray-900 mb-5 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-orange-500" /> Data Sekolah & Jurusan
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={lc}>Nomor HP Siswa <span className="text-red-500 lowercase normal-case">*</span></label>
                  <input className={ic} placeholder="08xxxxxxxxxx" value={form.nomor_hp} onChange={e => set('nomor_hp', e.target.value)} />
                </div>
                <div>
                  <label className={lc}>Email</label>
                  <input type="email" className={ic} placeholder="email@contoh.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div>
                  <label className={lc}>Asal Sekolah <span className="text-red-500 lowercase normal-case">*</span></label>
                  <input className={ic} placeholder="Nama SMP/MTs" value={form.asal_sekolah} onChange={e => set('asal_sekolah', e.target.value)} />
                </div>
                <div>
                  <label className={lc}>Tahun Lulus</label>
                  <select className={ic} value={form.tahun_lulus} onChange={e => set('tahun_lulus', e.target.value)}>
                    <option value="">— Pilih —</option>
                    {['2025','2024','2023','2022'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={lc}>Pilihan Jurusan <span className="text-red-500 lowercase normal-case">*</span></label>
                  <div className="space-y-2.5 mt-1">
                    {JURUSAN.map(j => (
                      <label key={j.value} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        form.jurusan === j.value ? j.color + ' border-2' : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}>
                        <input type="radio" name="jurusan" value={j.value} checked={form.jurusan === j.value}
                          onChange={e => set('jurusan', e.target.value)} className="sr-only" />
                        <span className="text-2xl">{j.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-800">{j.label}</p>
                          <p className="text-xs text-gray-500">{j.value}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          form.jurusan === j.value ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                        }`}>
                          {form.jurusan === j.value && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-slide-up">
              <h2 className="font-display font-black text-xl text-gray-900 mb-5 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" /> Data Orang Tua / Wali
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={lc}>Nama Ayah <span className="text-red-500 lowercase normal-case">*</span></label>
                  <input className={ic} value={form.nama_ayah} onChange={e => set('nama_ayah', e.target.value)} />
                </div>
                <div>
                  <label className={lc}>Pekerjaan Ayah</label>
                  <input className={ic} value={form.pekerjaan_ayah} onChange={e => set('pekerjaan_ayah', e.target.value)} />
                </div>
                <div>
                  <label className={lc}>Nama Ibu <span className="text-red-500 lowercase normal-case">*</span></label>
                  <input className={ic} value={form.nama_ibu} onChange={e => set('nama_ibu', e.target.value)} />
                </div>
                <div>
                  <label className={lc}>Pekerjaan Ibu</label>
                  <input className={ic} value={form.pekerjaan_ibu} onChange={e => set('pekerjaan_ibu', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className={lc}>Nomor HP Orang Tua / Wali <span className="text-red-500 lowercase normal-case">*</span></label>
                  <input className={ic} placeholder="08xxxxxxxxxx" value={form.nomor_hp_ortu} onChange={e => set('nomor_hp_ortu', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 – Konfirmasi */}
          {step === 4 && (
            <div className="animate-slide-up space-y-4">
              <h2 className="font-display font-black text-xl text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-500" /> Konfirmasi Data
              </h2>
              <p className="text-sm text-gray-500 mb-4">Periksa kembali data Anda sebelum mengirimkan.</p>

              {[
                {
                  title: 'Data Diri',
                  rows: [
                    ['Nama Lengkap', form.nama_lengkap],
                    ['NISN', form.nisn || '-'],
                    ['NIK', form.nik || '-'],
                    ['Tempat, Tgl Lahir', `${form.tempat_lahir || '-'}, ${form.tanggal_lahir ? new Date(form.tanggal_lahir).toLocaleDateString('id-ID') : '-'}`],
                    ['Jenis Kelamin', form.jenis_kelamin],
                    ['Agama', form.agama],
                    ['Alamat', form.alamat],
                  ],
                },
                {
                  title: 'Sekolah & Jurusan',
                  rows: [
                    ['Jurusan', `${jurusanObj?.icon ?? ''} ${jurusanObj?.label ?? form.jurusan}`],
                    ['Asal Sekolah', form.asal_sekolah],
                    ['Tahun Lulus', form.tahun_lulus || '-'],
                    ['No. HP Siswa', form.nomor_hp],
                    ['Email', form.email || '-'],
                  ],
                },
                {
                  title: 'Orang Tua / Wali',
                  rows: [
                    ['Nama Ayah', form.nama_ayah],
                    ['Pekerjaan Ayah', form.pekerjaan_ayah || '-'],
                    ['Nama Ibu', form.nama_ibu],
                    ['Pekerjaan Ibu', form.pekerjaan_ibu || '-'],
                    ['No. HP Ortu', form.nomor_hp_ortu],
                  ],
                },
              ].map(section => (
                <div key={section.title} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{section.title}</p>
                  <div className="grid sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    {section.rows.map(([k, v]) => (
                      <div key={k}>
                        <span className="text-gray-400">{k}: </span>
                        <span className="font-semibold text-gray-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <strong>Perhatian:</strong> Data yang telah dikirim tidak dapat diubah sendiri. Pastikan semua informasi sudah benar.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={step === 1 ? () => onNav('home') : back}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> {step === 1 ? 'Batal' : 'Sebelumnya'}
            </button>
            {step < 4 ? (
              <button onClick={next} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-400 text-white font-bold text-sm shadow-md hover:opacity-90 transition-opacity btn-ripple">
                Selanjutnya <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold text-sm shadow-md hover:opacity-90 transition-opacity btn-ripple disabled:opacity-60">
                {loading ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {loading ? 'Mengirim...' : 'Kirim Pendaftaran'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
