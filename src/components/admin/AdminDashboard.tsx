import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Users, Bell, Settings, LogOut, ChevronDown, ChevronUp,
  Check, X, Eye, Trash2, Plus, Search, Filter, ToggleLeft, ToggleRight,
  FileText, TrendingUp, Clock, UserCheck
} from 'lucide-react';
import { supabase, type Pendaftaran, type Pengumuman, type PpdbSettings } from '../../lib/supabase';

type Tab = 'dashboard' | 'pendaftaran' | 'pengumuman' | 'settings';

interface Props { onLogout: () => void; }

const JURUSAN_LABEL: Record<string, string> = {
  DKV: 'Desain Komunikasi Visual',
  MPLB: 'Manajemen Perkantoran',
  Otomotif: 'Teknik Otomotif',
};

const statusBadge = (s: string) => {
  const m: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    diterima: 'bg-green-100 text-green-700',
    ditolak: 'bg-red-100 text-red-700',
  };
  const l: Record<string, string> = { pending: 'Menunggu', diterima: 'Diterima', ditolak: 'Ditolak' };
  return <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${m[s] ?? 'bg-gray-100 text-gray-600'}`}>{l[s] ?? s}</span>;
};

export default function AdminDashboard({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [pendaftaran, setPendaftaran] = useState<Pendaftaran[]>([]);
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [settings, setSettings] = useState<PpdbSettings | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('');
  const [selected, setSelected] = useState<Pendaftaran | null>(null);
  const [loadingAction, setLoadingAction] = useState('');
  const [newAnn, setNewAnn] = useState({ judul: '', isi: '', penting: false });
  const [addingAnn, setAddingAnn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  const fetchAll = useCallback(async () => {
    const [p, ann, s, user] = await Promise.all([
      supabase.from('pendaftaran').select('*').order('created_at', { ascending: false }),
      supabase.from('pengumuman').select('*').order('created_at', { ascending: false }),
      supabase.from('ppdb_settings').select('*').maybeSingle(),
      supabase.auth.getUser(),
    ]);
    if (p.data) setPendaftaran(p.data);
    if (ann.data) setPengumuman(ann.data);
    if (s.data) setSettings(s.data);
    if (user.data.user) setAdminEmail(user.data.user.email ?? '');
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateStatus = async (id: string, status: string) => {
    setLoadingAction(id);
    await supabase.from('pendaftaran').update({ status }).eq('id', id);
    await fetchAll();
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as any } : prev);
    setLoadingAction('');
  };

  const deletePendaftaran = async (id: string) => {
    if (!confirm('Hapus data pendaftaran ini?')) return;
    await supabase.from('pendaftaran').delete().eq('id', id);
    setSelected(null);
    await fetchAll();
  };

  const saveAnn = async () => {
    if (!newAnn.judul.trim() || !newAnn.isi.trim()) return;
    await supabase.from('pengumuman').insert([newAnn]);
    setNewAnn({ judul: '', isi: '', penting: false });
    setAddingAnn(false);
    await fetchAll();
  };

  const deleteAnn = async (id: string) => {
    if (!confirm('Hapus pengumuman ini?')) return;
    await supabase.from('pengumuman').delete().eq('id', id);
    await fetchAll();
  };

  const saveSettings = async () => {
    if (!settings) return;
    await supabase.from('ppdb_settings').update({ ...settings, updated_at: new Date().toISOString() }).eq('id', settings.id);
    alert('Pengaturan berhasil disimpan!');
    await fetchAll();
  };

  const filtered = pendaftaran.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.nama_lengkap.toLowerCase().includes(q) || p.nomor_pendaftaran?.toLowerCase().includes(q) || p.nomor_hp?.toLowerCase().includes(q);
    const matchStatus = !filterStatus || p.status === filterStatus;
    const matchJurusan = !filterJurusan || p.jurusan === filterJurusan;
    return matchSearch && matchStatus && matchJurusan;
  });

  const stats = {
    total: pendaftaran.length,
    pending: pendaftaran.filter(p => p.status === 'pending').length,
    diterima: pendaftaran.filter(p => p.status === 'diterima').length,
    dkv: pendaftaran.filter(p => p.jurusan === 'DKV').length,
    mplb: pendaftaran.filter(p => p.jurusan === 'MPLB').length,
    otomotif: pendaftaran.filter(p => p.jurusan === 'Otomotif').length,
  };

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pendaftaran', label: 'Data Pendaftaran', icon: Users },
    { id: 'pengumuman', label: 'Pengumuman', icon: Bell },
    { id: 'settings', label: 'Pengaturan PPDB', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-950 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img src="/logoweb.png" alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <p className="font-display font-black text-white text-sm leading-tight">SMK Media Teknologi</p>
              <p className="text-orange-400 text-[10px]">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === id
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-orange-900/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" /> {label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {adminEmail[0]?.toUpperCase() ?? 'A'}
            </div>
            <p className="text-gray-300 text-xs truncate">{adminEmail || 'Administrator'}</p>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-black text-lg text-gray-900">
              {navItems.find(n => n.id === tab)?.label}
            </h1>
            <p className="text-xs text-gray-400">PPDB 2025/2026 · SMK Media Teknologi</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${settings?.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {settings?.is_open ? '● Pendaftaran Buka' : '● Pendaftaran Tutup'}
            </span>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-auto">

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Pendaftar', val: stats.total, icon: Users, from: 'from-red-500', to: 'to-orange-400' },
                  { label: 'Menunggu', val: stats.pending, icon: Clock, from: 'from-amber-500', to: 'to-yellow-400' },
                  { label: 'Diterima', val: stats.diterima, icon: UserCheck, from: 'from-green-500', to: 'to-emerald-400' },
                  { label: 'Pengumuman', val: pengumuman.length, icon: Bell, from: 'from-blue-500', to: 'to-cyan-400' },
                ].map(({ label, val, icon: Icon, from, to }) => (
                  <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-display font-black text-3xl text-gray-900">{val}</p>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                  </div>
                ))}
              </div>

              {/* Jurusan breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" /> Sebaran Pendaftar per Jurusan
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Desain Komunikasi Visual', key: 'dkv', color: 'bg-violet-500', kuota: settings?.kuota_dkv ?? 36 },
                    { label: 'Manajemen Perkantoran & LB', key: 'mplb', color: 'bg-sky-500', kuota: settings?.kuota_mplb ?? 36 },
                    { label: 'Teknik Otomotif', key: 'otomotif', color: 'bg-orange-500', kuota: settings?.kuota_otomotif ?? 36 },
                  ].map(({ label, key, color, kuota }) => {
                    const count = (stats as Record<string, number>)[key];
                    const pct = Math.min(Math.round((count / kuota) * 100), 100);
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold text-gray-700">{label}</span>
                          <span className="text-gray-500 font-mono">{count} / {kuota}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-display font-bold text-gray-800 mb-4">Pendaftar Terbaru</h3>
                <div className="space-y-2">
                  {pendaftaran.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {p.nama_lengkap[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-800 truncate">{p.nama_lengkap}</p>
                        <p className="text-xs text-gray-400">{p.nomor_pendaftaran} · {JURUSAN_LABEL[p.jurusan] ?? p.jurusan}</p>
                      </div>
                      {statusBadge(p.status)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PENDAFTARAN ── */}
          {tab === 'pendaftaran' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-48 border border-gray-200 rounded-xl px-3">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, nomor, HP..."
                    className="flex-1 py-2 text-sm outline-none" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                  <option value="">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="diterima">Diterima</option>
                  <option value="ditolak">Ditolak</option>
                </select>
                <select value={filterJurusan} onChange={e => setFilterJurusan(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                  <option value="">Semua Jurusan</option>
                  <option value="DKV">DKV</option>
                  <option value="MPLB">MPLB</option>
                  <option value="Otomotif">Otomotif</option>
                </select>
                <span className="flex items-center gap-1 text-xs text-gray-400 font-medium px-2">
                  <Filter className="w-3.5 h-3.5" /> {filtered.length} data
                </span>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wide">No. Daftar</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wide">Nama</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Jurusan</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Asal Sekolah</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                        <th className="px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wide text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Belum ada data pendaftaran</td></tr>
                      ) : filtered.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-gray-500 font-medium">{p.nomor_pendaftaran}</td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800">{p.nama_lengkap}</p>
                            <p className="text-xs text-gray-400">{p.nomor_hp}</p>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{p.jurusan}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{p.asal_sekolah}</td>
                          <td className="px-4 py-3">{statusBadge(p.status)}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <button onClick={() => setSelected(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Detail">
                                <Eye className="w-4 h-4" />
                              </button>
                              {p.status === 'pending' && (
                                <>
                                  <button onClick={() => updateStatus(p.id, 'diterima')} disabled={loadingAction === p.id} className="p-1.5 rounded-lg hover:bg-green-50 text-green-500 transition-colors" title="Terima">
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => updateStatus(p.id, 'ditolak')} disabled={loadingAction === p.id} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Tolak">
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button onClick={() => deletePendaftaran(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Hapus">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── PENGUMUMAN ── */}
          {tab === 'pengumuman' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setAddingAnn(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-400 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Tambah Pengumuman
                </button>
              </div>

              {addingAnn && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-slide-up">
                  <h3 className="font-display font-bold text-gray-800 mb-4">Pengumuman Baru</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Judul</label>
                      <input value={newAnn.judul} onChange={e => setNewAnn(a => ({ ...a, judul: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Isi</label>
                      <textarea value={newAnn.isi} onChange={e => setNewAnn(a => ({ ...a, isi: e.target.value }))} rows={4}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newAnn.penting} onChange={e => setNewAnn(a => ({ ...a, penting: e.target.checked }))} className="rounded" />
                      <span className="text-sm font-semibold text-gray-700">Tandai sebagai penting</span>
                    </label>
                    <div className="flex gap-3">
                      <button onClick={saveAnn} className="px-5 py-2 bg-green-500 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity">Simpan</button>
                      <button onClick={() => setAddingAnn(false)} className="px-5 py-2 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors">Batal</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {pengumuman.map(a => (
                  <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {a.penting && <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase">Penting</span>}
                        <span className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                      <p className="font-bold text-gray-800 mb-1">{a.judul}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{a.isi}</p>
                    </div>
                    <button onClick={() => deleteAnn(a.id)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors flex-shrink-0 h-fit">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && settings && (
            <div className="max-w-xl space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h3 className="font-display font-bold text-gray-800">Pengaturan PPDB</h3>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Tahun Ajaran</label>
                  <input value={settings.tahun_ajaran} onChange={e => setSettings(s => s ? { ...s, tahun_ajaran: e.target.value } : s)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Status Pendaftaran</label>
                  <button
                    onClick={() => setSettings(s => s ? { ...s, is_open: !s.is_open } : s)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                      settings.is_open ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-600'
                    }`}
                  >
                    {settings.is_open ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    {settings.is_open ? 'Pendaftaran DIBUKA' : 'Pendaftaran DITUTUP'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Kuota DKV', key: 'kuota_dkv' },
                    { label: 'Kuota MPLB', key: 'kuota_mplb' },
                    { label: 'Kuota Otomotif', key: 'kuota_otomotif' },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                      <input type="number" value={(settings as Record<string, any>)[key]} onChange={e => setSettings(s => s ? { ...s, [key]: +e.target.value } : s)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Tanggal Buka', key: 'tanggal_buka' },
                    { label: 'Tanggal Tutup', key: 'tanggal_tutup' },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                      <input type="date" value={(settings as Record<string, any>)[key] ?? ''} onChange={e => setSettings(s => s ? { ...s, [key]: e.target.value } : s)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>
                  ))}
                </div>

                <button onClick={saveSettings} className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-400 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                  Simpan Pengaturan
                </button>
              </div>

              {/* Export */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-display font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" /> Export Data
                </h3>
                <p className="text-sm text-gray-500 mb-4">Download data pendaftaran dalam format CSV.</p>
                <button
                  onClick={() => {
                    const header = ['Nomor', 'Nama', 'NISN', 'Jurusan', 'HP', 'Asal Sekolah', 'Status', 'Tanggal'];
                    const rows = pendaftaran.map(p => [
                      p.nomor_pendaftaran, p.nama_lengkap, p.nisn ?? '', p.jurusan, p.nomor_hp ?? '',
                      p.asal_sekolah ?? '', p.status, new Date(p.created_at).toLocaleDateString('id-ID'),
                    ]);
                    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'ppdb-data.csv'; a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white text-sm font-bold rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <FileText className="w-4 h-4" /> Download CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div>
                <p className="font-display font-black text-lg text-gray-900">{selected.nama_lengkap}</p>
                <p className="text-xs font-mono text-gray-400">{selected.nomor_pendaftaran}</p>
              </div>
              <div className="flex items-center gap-2">
                {statusBadge(selected.status)}
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 text-sm">
              {[
                {
                  title: 'Data Diri',
                  rows: [
                    ['NISN', selected.nisn], ['NIK', selected.nik],
                    ['Tempat Lahir', selected.tempat_lahir],
                    ['Tanggal Lahir', selected.tanggal_lahir ? new Date(selected.tanggal_lahir).toLocaleDateString('id-ID') : null],
                    ['Jenis Kelamin', selected.jenis_kelamin], ['Agama', selected.agama],
                    ['Alamat', selected.alamat], ['No. HP', selected.nomor_hp], ['Email', selected.email],
                  ],
                },
                {
                  title: 'Sekolah & Jurusan',
                  rows: [
                    ['Jurusan', JURUSAN_LABEL[selected.jurusan] ?? selected.jurusan],
                    ['Asal Sekolah', selected.asal_sekolah], ['Tahun Lulus', selected.tahun_lulus],
                  ],
                },
                {
                  title: 'Orang Tua',
                  rows: [
                    ['Nama Ayah', selected.nama_ayah], ['Pekerjaan Ayah', selected.pekerjaan_ayah],
                    ['Nama Ibu', selected.nama_ibu], ['Pekerjaan Ibu', selected.pekerjaan_ibu],
                    ['No. HP Ortu', selected.nomor_hp_ortu],
                  ],
                },
              ].map(section => (
                <div key={section.title}>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{section.title}</p>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-xl p-3">
                    {section.rows.map(([k, v]) => (
                      <div key={k as string}>
                        <span className="text-[10px] text-gray-400 block">{k}</span>
                        <span className="font-semibold text-gray-800 text-xs">{v ?? '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Action buttons */}
              {selected.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => updateStatus(selected.id, 'diterima')} className="flex-1 py-2.5 bg-green-500 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Terima
                  </button>
                  <button onClick={() => updateStatus(selected.id, 'ditolak')} className="flex-1 py-2.5 bg-red-500 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <X className="w-4 h-4" /> Tolak
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
