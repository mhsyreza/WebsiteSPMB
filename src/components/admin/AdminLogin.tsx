import { useState } from 'react';
import { Eye, EyeOff, Lock, Shield, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Page = 'home' | 'daftar' | 'cek' | 'admin';
interface Props {
  onNav: (p: Page) => void;
  onLoggedIn: () => void;
}

export default function AdminLogin({ onNav, onLoggedIn }: Props) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      setErr('Email atau password salah. Silakan coba lagi.');
    } else {
      onLoggedIn();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* BG blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <button onClick={() => onNav('home')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Website
        </button>

        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-red-900/40 animate-glow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display font-black text-2xl text-white mb-1">Portal Admin</h1>
            <p className="text-gray-400 text-sm">SMK Media Teknologi — PPDB 2025/2026</p>
          </div>

          <form onSubmit={login} className="space-y-4">
            {err && (
              <div className="bg-red-500/15 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
                {err}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@smkmediatek.sch.id"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} required value={pass} onChange={e => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-900/30 hover:opacity-90 transition-opacity disabled:opacity-60 mt-2 btn-ripple"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-6">Akses terbatas untuk administrator</p>
        </div>
      </div>
    </div>
  );
}
