import { useState } from 'react';
import { Search, ChevronLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { supabase, type Pendaftaran } from '../lib/supabase';

type Page = 'home' | 'daftar' | 'cek' | 'admin';
interface Props { onNav: (p: Page) => void; }

const statusMap = {
  pending:  { icon: Clock,        bg: 'bg-amber-50',  border: 'border-amber-400',  text: 'text-amber-700',  label: 'Menunggu Verifikasi' },
  diterima: { icon: CheckCircle,  bg: 'bg-green-50',  border: 'border-green-400',  text: 'text-green-700',  label: 'Diterima' },
  ditolak:  { icon: XCircle,      bg: 'bg-red-50',    border: 'border-red-400',    text: 'text-red-700',    label: 'Tidak Diterima' },
};

const JURUSAN_LABEL: Record<string, string> = {
  DKV: 'Desain Komunikasi Visual',
  MPLB: 'Manajemen Perkantoran dan Layanan Bisnis',
  Otomotif: 'Teknik Otomotif',
};

export default function CekPendaftaran({ onNav }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Pendaftaran | null>(null);
  const [notFound, setNotFound] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setNotFound(false); setData(null);
    const { data: row } = await supabase
      .from('pendaftaran')
      .select('*')
      .eq('nomor_pendaftaran', query.trim().toUpperCase())
      .maybeSingle();
    if (row) setData(row);
    else setNotFound(true);
    setLoading(false);
  };

  const cfg = data ? statusMap[data.status as keyof typeof statusMap] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => onNav('home')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Beranda
        </button>

        <div className="text-center mb-8">
          <h1 className="font-display font-black text-3xl text-gray-900 mb-2">Cek Status Pendaftaran</h1>
          <p className="text-gray-500 text-sm">Masukkan nomor pendaftaran yang Anda terima saat mendaftar</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex gap-3">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Contoh: PPDB-2025-0001"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all font-mono"
            />
            <button
              onClick={search}
              disabled={loading || !query.trim()}
              className="px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
              Cari
            </button>
          </div>
        </div>

        {/* Not found */}
        {notFound && !loading && (
          <div className="bg-white rounded-2xl shadow p-8 text-center border border-gray-100 animate-slide-up">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-600">Data tidak ditemukan</p>
            <p className="text-sm text-gray-400 mt-1">Periksa kembali nomor pendaftaran Anda.</p>
          </div>
        )}

        {/* Result */}
        {data && cfg && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
            {/* Status banner */}
            <div className={`${cfg.bg} ${cfg.border} border-b px-6 py-5 flex items-center gap-4`}>
              <cfg.icon className={`w-8 h-8 ${cfg.text}`} />
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Status Pendaftaran</p>
                <p className={`font-display font-black text-xl ${cfg.text}`}>{cfg.label}</p>
                {data.catatan && <p className="text-sm text-gray-600 mt-1">{data.catatan}</p>}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">No. Pendaftaran</p>
                <p className="font-mono font-black text-gray-700 text-sm">{data.nomor_pendaftaran}</p>
              </div>
            </div>

            {/* Detail */}
            <div className="p-6 space-y-5">
              <Section title="Data Diri">
                <Row label="Nama Lengkap" value={data.nama_lengkap} />
                <Row label="NISN" value={data.nisn ?? '-'} />
                <Row label="Jenis Kelamin" value={data.jenis_kelamin ?? '-'} />
                <Row label="Tempat, Tgl Lahir" value={`${data.tempat_lahir ?? '-'}, ${data.tanggal_lahir ? new Date(data.tanggal_lahir).toLocaleDateString('id-ID') : '-'}`} />
                <Row label="Agama" value={data.agama ?? '-'} />
                <Row label="No. HP" value={data.nomor_hp ?? '-'} />
              </Section>

              <Section title="Sekolah & Jurusan">
                <Row label="Jurusan Pilihan" value={JURUSAN_LABEL[data.jurusan] ?? data.jurusan} span />
                <Row label="Asal Sekolah" value={data.asal_sekolah ?? '-'} />
                <Row label="Tahun Lulus" value={data.tahun_lulus ?? '-'} />
              </Section>

              <Section title="Orang Tua / Wali">
                <Row label="Nama Ayah" value={data.nama_ayah ?? '-'} />
                <Row label="Nama Ibu" value={data.nama_ibu ?? '-'} />
                <Row label="No. HP Ortu" value={data.nomor_hp_ortu ?? '-'} />
              </Section>

              <p className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100">
                Terdaftar: {new Date(data.created_at).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{title}</p>
      <div className="grid sm:grid-cols-2 gap-y-2 gap-x-4 bg-gray-50 rounded-xl p-4">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={span ? 'sm:col-span-2' : ''}>
      <span className="text-[11px] text-gray-400 block">{label}</span>
      <span className="font-semibold text-gray-800 text-sm">{value}</span>
    </div>
  );
}
