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
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-50 max-w-5xl mx-auto bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-sm font-bold">TB</span>
          <span className="font-bold text-lg">Thread<span className="text-cyan-400">Boost</span></span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-neutral-400">
          <a href="#problem" className="hover:text-white transition">Problem</a>
          <a href="#features" className="hover:text-white transition">Fitur</a>
          <a href="#benefits" className="hover:text-white transition">Manfaat</a>
        </nav>
        <button onClick={() => setShowLogin(true)} className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-bold transition cursor-pointer">Masuk</button>
      </header>

      {/* Hero */}
      <section className="pt-36 pb-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-300 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
          ✨ AI yang Paham Warga Threads Indonesia
        </div>
        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
          Utas Threads Viral{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Tanpa Stres</span>
          {' '}Nulis Sempurna
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-8">
          ThreadBoost AI bantu kamu mengubah ide, topik, link, atau bahan mentah jadi utas Threads Indonesia yang natural, relate, dan siap posting.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={() => setShowLogin(true)} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl font-bold hover:scale-105 transition cursor-pointer">
            Mulai Gratis
          </button>
          <a href="#features" className="px-6 py-3 bg-white/10 hover:bg-white/15 rounded-xl font-bold transition cursor-pointer">
            Lihat Fitur
          </a>
        </div>
        <div className="flex flex-wrap gap-4 justify-center mt-6 text-sm text-neutral-500">
          <span>🔒 Login via Google</span>
          <span>📱 Mobile-friendly</span>
          <span>⚡ BYO API Key</span>
        </div>
      </section>

      {/* Problems */}
      <section id="problem" className="py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Masalah Sebenarnya</div>
          <h2 className="text-3xl md:text-4xl font-bold">Bikin Utas AI yang Terasa "Manusiawi" Itu Sulit</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {problems.map((p, i) => (
            <div key={i} className="bg-neutral-900/50 rounded-2xl p-5 border border-white/5">
              <div className="text-2xl mb-3">{p.icon}</div>
              <h3 className="font-bold text-sm mb-2">{p.title}</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Powerful Features</div>
          <h2 className="text-3xl md:text-4xl font-bold">Senjata Content Creator Threads</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-neutral-900/50 rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 transition">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-sm mb-2">{f.title}</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Manfaat</div>
          <h2 className="text-3xl md:text-4xl font-bold">Bikin Utas Tinggal Klik-klik Aja</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {benefits.map((b, i) => (
            <div key={i} className="bg-neutral-900/50 rounded-xl px-4 py-3 border border-white/5 text-sm">
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowLogin(false)}>
          <div className="bg-neutral-900 rounded-3xl p-8 max-w-sm w-full border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">TB</div>
              <h2 className="text-xl font-bold">Masuk ke ThreadBoost</h2>
              <p className="text-sm text-neutral-400 mt-1">Gunakan akun Google kamu</p>
            </div>
            <button onClick={onLogin} className="w-full py-3 bg-white text-neutral-900 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-neutral-100 transition cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Masuk dengan Google
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-10 px-4 text-center text-sm text-neutral-600 border-t border-white/5">
        <p>ThreadBoost AI &copy; 2026 — For personal use</p>
      </footer>
    </div>
  )
}
