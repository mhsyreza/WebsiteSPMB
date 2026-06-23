import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import Jurusan from './components/Jurusan';
import VisiMisi from './components/VisiMisi';
import Alur from './components/Alur';
import Pengumuman from './components/Pengumuman';
import Footer from './components/Footer';
import FormPendaftaran from './components/FormPendaftaran';
import CekPendaftaran from './components/CekPendaftaran';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

type Page = 'home' | 'daftar' | 'cek' | 'admin';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const nav = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    nav('home');
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Admin routes
  if (page === 'admin') {
    if (session) return <AdminDashboard onLogout={logout} />;
    return <AdminLogin onNav={nav} onLoggedIn={() => nav('admin')} />;
  }

  // Daftar page
  if (page === 'daftar') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar current="daftar" onNav={nav} />
        <div className="pt-16">
          <FormPendaftaran onNav={nav} />
        </div>
        <Footer onNav={nav} />
      </div>
    );
  }

  // Cek page
  if (page === 'cek') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar current="cek" onNav={nav} />
        <div className="pt-16">
          <CekPendaftaran onNav={nav} />
        </div>
        <Footer onNav={nav} />
      </div>
    );
  }

  // Home page
  return (
    <div className="min-h-screen">
      <Navbar current="home" onNav={nav} />
      <Hero onNav={nav} />
      <StatsBar />
      <Jurusan onNav={nav} />
      <VisiMisi />
      <Alur />
      <Pengumuman />
      <Footer onNav={nav} />
    </div>
  );
}
