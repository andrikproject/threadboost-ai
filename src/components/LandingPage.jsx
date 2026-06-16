import { useState } from 'react'

const problems = [
  { icon: '🤖', title: 'Hasil AI Terlalu Kaku', desc: 'Tulisan terlalu formal, kaku, dan rapi kayak template robot.' },
  { icon: '⚡', title: 'Hook Kurang Hidup', desc: 'Kalimat pembuka klise bikin orang scrolling lewat.' },
  { icon: '🛍️', title: 'Jualan Terasa Maksa', desc: 'Soft selling malah kaku kayak brosur sales korporat.' },
  { icon: '🧠', title: 'Ide Susah Jadi Utas', desc: 'Punya ide mentah tapi bingung ngerangkai jadi draf.' },
  { icon: '❌', title: 'Kepala Sering Kosong', desc: 'Pengen konsisten posting tapi sering blank ide.' },
]

const features = [
  { icon: '🛡️', title: 'Anti AI Looks Method', desc: 'Filter khusus untuk menghilangkan pola kaku AI. Hasil 100% natural.' },
  { icon: '📖', title: 'The Storytelling Mode', desc: 'Ubah cerita personal jadi utas bertingkat yang bikin pembaca ketagihan.' },
  { icon: '🛍️', title: 'The Marketing Mode', desc: 'Susun utas promosi soft-selling yang memikat audiens.' },
  { icon: '💬', title: 'The Engagement Mode', desc: 'Bikin utas interaksi santai, opini, humor khas tongkrongan lokal.' },
  { icon: '🔗', title: 'Shopee Affiliate Maker', desc: 'Ubah link produk Shopee jadi utas review natural & persuasif.' },
  { icon: '🤫', title: 'Secret Viral Thread', desc: 'Metode rahasia bikin utas viral saat ide mentok.' },
  { icon: '🌀', title: 'Viral Thread Spinner', desc: 'Tulis ulang postingan viral dengan gaya dan niche kamu.' },
  { icon: '👥', title: 'Multi-Persona Switcher', desc: 'Kelola banyak akun dengan persona & gaya berbeda.' },
]

const benefits = [
  '🧠 Nggak blank tiap mau posting',
  '📦 Punya stok utas harian',
  '⚡ Bikin utas tinggal klik-klik aja',
  '🛡️ Hasil AI nggak keliatan AI banget',
  '🛍️ Bisa soft selling lebih halus',
  '💸 Utas affiliate lebih natural',
  '👤 Konsisten bangun personal branding',
  '⌛ Hemat waktu mikir struktur',
]

export default function LandingPage({ onLogin, onEnter }) {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden bg-[#0a0a0f]">
      {/* ─── Aurora Background ─── */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb" />
        <div className="aurora-orb" />
        <div className="aurora-orb" />
        <div className="aurora-orb" />
        <div className="aurora-orb" />
      </div>

      {/* ─── Stars / Twinkles ─── */}
      <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="twinkle absolute w-[2px] h-[2px] bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * -5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10">
        {/* ─── Glass Header ─── */}
        <header className="fixed top-3 left-3 right-3 z-50 max-w-5xl mx-auto glass rounded-2xl px-5 py-3 flex items-center justify-between animate-fade-up">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-cyan-500/20">
              TB
            </span>
            <span className="font-bold text-lg tracking-tight">
              Thread<span className="aurora-text">Boost</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm text-white/60">
            <a href="#problem" className="hover:text-white/90 transition-colors">Problem</a>
            <a href="#features" className="hover:text-white/90 transition-colors">Fitur</a>
            <a href="#benefits" className="hover:text-white/90 transition-colors">Manfaat</a>
          </nav>
          <button
            onClick={() => setShowLogin(true)}
            className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-white/10 hover:border-white/20 cursor-pointer"
          >
            Masuk
          </button>
        </header>

        {/* ─── Hero ─── */}
        <section className="relative pt-36 pb-24 px-4 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-pink-500/10 text-cyan-300 text-xs font-bold px-4 py-2 rounded-full border border-cyan-500/20 mb-6 backdrop-blur-sm animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI yang Paham Warga Threads Indonesia
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Utas Threads Viral{' '}
            <span className="aurora-text">Tanpa Stres</span>
            <br />
            Nulis Sempurna
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            ThreadBoost AI bantu kamu mengubah ide, topik, link, atau bahan mentah
            jadi utas Threads Indonesia yang <span className="text-white/80">natural, relate,</span> dan siap posting.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => setShowLogin(true)} className="aurora-btn px-8 py-3.5 font-bold cursor-pointer">
              Mulai Gratis
            </button>
            <button onClick={onEnter} className="px-8 py-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all border border-white/10 hover:border-white/20 cursor-pointer">
              Langsung Pakai →
            </button>
            <a href="#features" className="px-8 py-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all border border-white/10 hover:border-white/20 inline-flex items-center cursor-pointer">
              Lihat Fitur
            </a>
          </div>

          <div className="flex flex-wrap gap-6 justify-center mt-8 text-sm text-white/30 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-cyan-400" /> Login via Google
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-violet-400" /> Mobile-friendly
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-pink-400" /> BYO API Key
            </span>
          </div>
        </section>

        {/* ─── Problems ─── */}
        <section id="problem" className="py-24 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-14 animate-fade-up">
            <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-3">Masalah Sebenarnya</div>
            <h2 className="text-3xl md:text-5xl font-bold">Bikin Utas AI yang Terasa <span className="aurora-text">"Manusiawi"</span> Itu Sulit</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {problems.map((p, i) => (
              <div
                key={i}
                className="soft-card p-6 animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="font-bold text-sm mb-2 text-white/90">{p.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Features ─── */}
        <section id="features" className="py-24 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-14 animate-fade-up">
            <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-3">Powerful Features</div>
            <h2 className="text-3xl md:text-5xl font-bold">Senjata <span className="aurora-text">Content Creator</span> Threads</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="soft-card p-6 group animate-fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="font-bold text-sm mb-2 text-white/90">{f.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Benefits ─── */}
        <section id="benefits" className="py-24 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-14 animate-fade-up">
            <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-3">Manfaat</div>
            <h2 className="text-3xl md:text-5xl font-bold">Bikin Utas Tinggal <span className="aurora-text">Klik-klik</span> Aja</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="glass-light rounded-xl px-5 py-4 text-sm text-white/80 animate-fade-up hover:bg-white/[0.05] transition-colors"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {b}
              </div>
            ))}
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="py-12 px-4 text-center text-sm text-white/20 border-t border-white/[0.03]">
          <p>ThreadBoost AI &copy; 2026 — Dibuat dengan <span className="text-cyan-400">❤</span> untuk kreator Indonesia</p>
        </footer>
      </div>

      {/* ─── Login Modal ─── */}
      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLogin(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="glass-strong rounded-3xl p-8 max-w-sm w-full animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-2xl font-bold mx-auto mb-5 shadow-xl shadow-cyan-500/20">
                TB
              </div>
              <h2 className="text-xl font-bold">Masuk ke ThreadBoost</h2>
              <p className="text-sm text-white/40 mt-1">Gunakan akun Google kamu</p>
            </div>
            <button
              onClick={onLogin}
              className="w-full py-3.5 bg-white hover:bg-white/90 text-neutral-900 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Masuk dengan Google
            </button>
            <button
              onClick={() => { setShowLogin(false); onEnter() }}
              className="w-full mt-3 py-3 text-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer"
            >
              Atau langsung pakai →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
