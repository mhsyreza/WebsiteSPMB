import { useEffect, useRef } from 'react';
import { ChevronRight, Award, BookOpen, Users } from 'lucide-react';

type Page = 'home' | 'daftar' | 'cek' | 'admin';
interface Props { onNav: (p: Page) => void; }

export default function Hero({ onNav }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#f97316','#ef4444','#facc15','#22d3ee','#a78bfa','#34d399'];
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3.5 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: -Math.random() * 0.8 - 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section className="relative hero-gradient min-h-screen flex items-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Radial glow accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          {/* Ticker badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 glass rounded-full px-4 py-1.5 mb-6 animate-slide-up">
            <span className="w-2 h-2 bg-green-400 rounded-full badge-pulse" />
            <span className="text-white text-xs font-semibold tracking-wide">PPDB 2025/2026 · Pendaftaran Dibuka</span>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6 animate-slide-up delay-100">
            Selamat Datang di<br />
            <span style={{background:'linear-gradient(135deg,#fb923c,#facc15)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
              SMK Media
            </span>
            <br />Teknologi!
          </h1>

          <p className="text-white/75 text-lg leading-relaxed max-w-lg mb-8 animate-slide-up delay-200">
            Temukan potensi diri Anda di bidang teknologi bersama SMK Media Teknologi.
            Sekolah <strong className="text-yellow-300">Terakreditasi A</strong> yang membekali Anda
            dengan ilmu dan keterampilan untuk meraih kesuksesan.
          </p>

          <div className="flex flex-wrap gap-3 mb-10 animate-slide-up delay-300">
            <button
              onClick={() => onNav('daftar')}
              className="btn-ripple flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white text-sm
                bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 shine-btn
                shadow-xl shadow-orange-500/40 hover:scale-105 transition-transform"
            >
              Daftar Sekarang <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNav('cek')}
              className="glass px-7 py-3.5 rounded-full font-bold text-white text-sm hover:bg-white/20 transition-all"
            >
              Cek Status Pendaftaran
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 animate-slide-up delay-400">
            {[
              { icon: Users, val: '400+', label: 'Siswa Aktif' },
              { icon: Award, val: '2500+', label: 'Alumni' },
              { icon: BookOpen, val: '11', label: 'Guru Tersertifikasi' },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} className="glass rounded-2xl px-4 py-3 text-center">
                <Icon className="w-5 h-5 text-yellow-300 mx-auto mb-1" />
                <p className="font-display font-black text-xl text-white">{val}</p>
                <p className="text-white/60 text-[10px] font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Logo visual */}
        <div className="flex justify-center items-center animate-slide-up delay-300">
          <div className="relative">
            {/* Orbit rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 rounded-full border-2 border-white/10 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-56 h-56 rounded-full border-2 border-orange-400/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            </div>

            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/30 to-red-600/30 blur-2xl scale-110" />

            <div className="relative animate-float">
              <img
                src="/logoweb.png"
                alt="SMK Media Teknologi"
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain drop-shadow-[0_0_40px_rgba(251,146,60,0.5)] animate-glow rounded-full"
              />
            </div>

            {/* Floating pills */}
            <div className="absolute -top-3 -right-4 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce">
              Akreditasi A
            </div>
            <div className="absolute -bottom-3 -left-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg" style={{ animation: 'floatBob 4s ease-in-out infinite 1s' }}>
              Islamic Technopreneur School
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="wave-bottom">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
