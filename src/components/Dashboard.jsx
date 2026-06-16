import { useState, useRef, useEffect } from 'react'
import { callSumopod } from '../api'

const modes = [
  { id: 'storytelling', icon: '📖', label: 'Storytelling', color: 'from-cyan-500 to-blue-600' },
  { id: 'marketing', icon: '🛍️', label: 'Marketing', color: 'from-rose-500 to-pink-600' },
  { id: 'engagement', icon: '💬', label: 'Engagement', color: 'from-amber-500 to-orange-600' },
  { id: 'affiliate', icon: '🔗', label: 'Shopee Affiliate', color: 'from-emerald-500 to-green-600' },
  { id: 'secret', icon: '🤫', label: 'Secret Viral', color: 'from-fuchsia-500 to-pink-600' },
  { id: 'spinner', icon: '🌀', label: 'Thread Spinner', color: 'from-cyan-500 to-violet-600' },
  { id: 'persona', icon: '👥', label: 'Multi-Persona', color: 'from-indigo-500 to-violet-600' },
  { id: 'daily', icon: '🔔', label: 'Daily Reminder', color: 'from-teal-500 to-emerald-600' },
]

const quickTools = [
  { id: 'humanize', icon: '✨', label: 'Humanize' },
  { id: 'punchline', icon: '🥊', label: 'Punchline Booster' },
  { id: 'softsell', icon: '🤝', label: 'Convert Soft-Selling' },
  { id: 'clean', icon: '🧹', label: 'Clean Caption' },
]

const personaTemplates = [
  { id: 'personal', name: 'Personal Branding', niche: 'Self-development, lifestyle', style: 'Santai, reflektif' },
  { id: 'bisnis', name: 'Seller Digital', niche: 'Digital product, passive income', style: 'Persuasif' },
  { id: 'affiliate', name: 'Affiliate Marketer', niche: 'Shopee, e-commerce', style: 'Review personal, tulus' },
  { id: 'kreator', name: 'Kreator Konten', niche: 'Humor, opini, trending', style: 'Santai, ceplas-ceplos' },
]

function SlideLoading() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
          <div className="shimmer-line h-3 w-12 mb-3" />
          <div className="shimmer-line h-3 w-full mb-2" />
          <div className="shimmer-line h-3 w-3/4 mb-2" />
          <div className="shimmer-line h-3 w-5/6" />
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ user, apiKey, apiModel, onLogout, onSettings, isDemo }) {
  const [activeMode, setActiveMode] = useState('storytelling')
  const [input, setInput] = useState('')
  const [extra, setExtra] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [personas] = useState(personaTemplates)
  const [selectedPersona, setSelectedPersona] = useState(personas[0])
  const [shopeeLink, setShopeeLink] = useState('')
  const [viralInput, setViralInput] = useState('')
  const [modePanel, setModePanel] = useState(false)
  const resultRef = useRef(null)
  const quickRef = useRef(null)

  useEffect(() => {
    try {
      const h = JSON.parse(localStorage.getItem('threadboost_history') || '[]')
      setHistory(h)
    } catch {}
  }, [])

  const saveToHistory = (mode, inputText, output) => {
    const entry = { id: Date.now(), mode, input: inputText, output, createdAt: new Date().toISOString() }
    const updated = [entry, ...history].slice(0, 50)
    setHistory(updated)
    localStorage.setItem('threadboost_history', JSON.stringify(updated))
  }

  const systemPrompts = {
    storytelling: `Kamu adalah penulis utas Threads Indonesia. 
Buat utas storytelling yang:
- Natural, gaul, khas anak Threads Indonesia
- Ada hook kuat di awal
- Cerita mengalir dengan emosi
- Gak formal, pake diksi sehari-hari
- Pake bahasa Indonesia campur slang wajar
- Akhiri dengan call-to-action yang engaging
Format: tiap slide/utas dipisah dengan baris "---"`,
    marketing: `Kamu adalah copywriter Threads Indonesia ahli soft-selling.
Buat utas promosi yang:
- Fokus ke pain point, baru selipkan solusi
- Gak kaya iklan, lebih kayak sharing pengalaman
- Natural, relatable
- Panggil audiens "lu" bukan "Anda"
- Hook kuat, storytelling, baru closing soft-sell
Format: tiap slide dipisah "---"`,
    engagement: `Buat utas interaksi untuk Threads Indonesia:
- Topik hangat, opini, atau humor relatable
- Gaya santai khas tongkrongan
- Ajak diskusi di akhir
- Pancing reply dengan pertanyaan open-ended
Format: tiap slide dipisah "---"`,
    affiliate: `Kamu adalah affiliate marketer Threads Indonesia.
Ubah produk/link ini jadi utas review yang:
- Kayak cerita pengalaman pribadi
- Sebut manfaat tanpa over-selling
- Natural, jujur, pake gaya "gw pake ini dan honest review"
- Cantumin link di slide terakhir secara halus
Format: tiap slide dipisah "---"`,
    secret: `Kamu adalah kreator viral Threads Indonesia.
Buat utas yang berpotensi viral dengan:
- Hook kontroversial atau relatable banget
- Cerita yang bikin orang penasaran
- Plot twist atau ending surprising
- Gaya ceplas-ceplos, berani, beda
Format: tiap slide dipisah "---"`,
    spinner: `Kamu adalah kreator Threads yang jago rewrite.
Tulis ulang utas berikut dengan:
- Gaya bahasa dan diksi yang berbeda
- Struktur yang diubah
- Hook baru yang lebih kuat
- Tetap pertahankan esensi pesan aslinya
Format: tiap slide dipisah "---"`,
  }

  const generateThread = async () => {
    if (!input.trim() && activeMode !== 'spinner') {
      setError('Masukkan ide/topik dulu!')
      return
    }
    if (!apiKey) {
      setError('Atur API Key dulu di Pengaturan!')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      let prompt = ''
      let sysPrompt = systemPrompts[activeMode] || systemPrompts.storytelling

      switch (activeMode) {
        case 'storytelling':
        case 'marketing':
        case 'engagement':
        case 'secret':
          prompt = `Topik/Ide: "${input}"\n${extra ? `Instruksi Tambahan: "${extra}"` : ''}\n\nBuatkan utas Threads Indonesia yang engaging.`
          break
        case 'affiliate':
          prompt = `Produk: ${input}\n${shopeeLink ? `Link: ${shopeeLink}` : ''}\n${extra ? `Info tambahan: "${extra}"` : ''}\n\nBuat utas review natural.`
          break
        case 'spinner':
          prompt = `Utas asli:\n"${viralInput}"\n\n${extra ? `Gaya/niche target: "${extra}"` : ''}\n\nTulis ulang dengan gaya berbeda.`
          break
        case 'persona':
          sysPrompt = `Kamu adalah ${selectedPersona.name} dengan niche ${selectedPersona.niche} dan gaya ${selectedPersona.style}.`
          prompt = `Topik: "${input}"\n${extra ? `Instruksi: "${extra}"` : ''}\n\nBuat utas Threads dengan persona ini.`
          break
        case 'daily':
          prompt = `Buatkan 5 ide utas Threads harian tentang: "${input}".\n${extra ? `Tambahan: "${extra}"` : ''}\n\nFormat: tiap ide dengan hook dan deskripsi singkat. Pisahkan dengan "---"`
          break
      }

      const content = await callSumopod(prompt, sysPrompt, apiKey, apiModel)
      setResult(content)
      saveToHistory(activeMode, input, content)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const applyQuickTool = async (tool) => {
    if (!result && !input.trim()) {
      setError('Hasilkan utas dulu atau masukkan teks!')
      return
    }

    setLoading(true)
    setError('')

    const textToProcess = result || input
    const tools = {
      humanize: `Humanize teks berikut. Buat lebih natural, kurangin kata formal, tambahin diksi santai khas Threads Indonesia:\n\n${textToProcess}`,
      punchline: `Tambahin punchline yang stronger di hook dan closing dari teks ini. Bikin lebih nendang:\n\n${textToProcess}`,
      softsell: `Ubah teks ini jadi soft-selling yang lebih halus. Jangan kaya iklan, lebih kayak sharing:\n\n${textToProcess}`,
      clean: `Bersihin teks ini dari kata-kata berlebihan, clickbait, atau klise. Bikin lebih to the point:\n\n${textToProcess}`,
    }

    try {
      const content = await callSumopod(tools[tool], 'Kamu adalah editor Threads Indonesia.', apiKey, apiModel)
      setResult(content)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result).catch(() => {})
    }
  }

  const currentMode = modes.find(m => m.id === activeMode)

  return (
    <div className="relative min-h-screen text-white bg-[#0a0a0f]">
      {/* ─── Aurora Background ─── */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb" />
        <div className="aurora-orb" />
        <div className="aurora-orb" />
      </div>

      {/* ─── Glass Header ─── */}
      <header className="relative z-30 glass-strong border-b border-white/[0.04] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold shadow-lg shadow-cyan-500/20">
            TB
          </span>
          <span className="font-bold">Thread<span className="aurora-text">Boost</span></span>
          {isDemo && (
            <span className="text-[10px] bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold border border-amber-500/20">
              DEMO
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSettings}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer text-sm"
            title="Pengaturan"
          >
            ⚙️
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-bold transition-all cursor-pointer"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* ─── Mobile Mode Picker ─── */}
      <button
        onClick={() => setModePanel(!modePanel)}
        className="relative z-20 lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/[0.04] text-sm"
      >
        <span className="flex items-center gap-2">
          <span>{currentMode?.icon}</span>
          <span className="font-bold">{currentMode?.label}</span>
        </span>
        <span className="text-white/30 text-xs">{modePanel ? '▲' : '▼'}</span>
      </button>

      {modePanel && (
        <div className="relative z-20 lg:hidden px-3 py-3 bg-white/[0.02] border-b border-white/[0.04] animate-fade-up">
          <div className="grid grid-cols-4 gap-1.5">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => { setActiveMode(m.id); setModePanel(false) }}
                className={`p-2 rounded-xl text-center transition-all cursor-pointer ${
                  activeMode === m.id
                    ? 'bg-gradient-to-br ' + m.color + ' text-white shadow-lg scale-105'
                    : 'glass-tab'
                }`}
              >
                <div className="text-base mb-0.5">{m.icon}</div>
                <div className="text-[8px] font-bold leading-tight opacity-70">{m.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Main Content ─── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Left Column ─── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Mode Tabs (Desktop) */}
          <div className="hidden lg:grid grid-cols-8 gap-2">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`p-2.5 rounded-xl text-center transition-all cursor-pointer ${
                  activeMode === m.id
                    ? `bg-gradient-to-br ${m.color} text-white shadow-lg scale-105`
                    : 'glass-tab'
                }`}
              >
                <div className="text-lg mb-0.5">{m.icon}</div>
                <div className="text-[9px] font-bold leading-tight opacity-70">{m.label}</div>
              </button>
            ))}
          </div>

          {/* ─── Input Panel ─── */}
          <div className="soft-card p-5 md:p-6 space-y-4 animate-fade-up">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-xl">{currentMode?.icon}</span>
              <h2 className="font-bold text-lg bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {currentMode?.label}
              </h2>
            </div>

            {/* Persona selector */}
            {activeMode === 'persona' && (
              <div className="grid grid-cols-2 gap-2">
                {personas.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPersona(p)}
                    className={`p-3 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      selectedPersona.id === p.id
                        ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                        : 'glass-tab border border-white/[0.04]'
                    }`}
                  >
                    <div className="font-bold text-white/90 mb-1">{p.name}</div>
                    <div className="text-[10px] text-white/40">{p.niche}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Shopee link */}
            {activeMode === 'affiliate' && (
              <input
                type="text"
                value={shopeeLink}
                onChange={e => setShopeeLink(e.target.value)}
                placeholder="Link Shopee (opsional)"
                className="soft-input w-full px-4 py-2.5 text-sm"
              />
            )}

            {/* Spinner extra textarea */}
            {activeMode === 'spinner' && (
              <textarea
                value={viralInput}
                onChange={e => setViralInput(e.target.value)}
                placeholder="Tempel utas asli yang mau di-rewrite..."
                rows={4}
                className="soft-input w-full px-4 py-3 text-sm resize-none"
              />
            )}

            {/* Main input */}
            <textarea
              value={activeMode === 'spinner' ? viralInput : input}
              onChange={e => {
                if (activeMode === 'spinner') setViralInput(e.target.value)
                else setInput(e.target.value)
              }}
              placeholder={
                activeMode === 'storytelling' ? 'Ceritakan ide atau pengalamanmu...' :
                activeMode === 'marketing' ? 'Produk/layanan apa yang mau dipromosikan?' :
                activeMode === 'engagement' ? 'Topik opini/humor yang mau diangkat...' :
                activeMode === 'affiliate' ? 'Nama atau deskripsi produk...' :
                activeMode === 'secret' ? 'Ide liar/topik yang pengen diviralkan...' :
                activeMode === 'spinner' ? '' :
                activeMode === 'persona' ? 'Topik utas yang mau dibuat...' :
                activeMode === 'daily' ? 'Topik/niche untuk ide harian...' :
                'Masukkan ide...'
              }
              rows={4}
              className="soft-input w-full px-4 py-3 text-sm resize-none"
            />

            {/* Extra instructions */}
            <input
              type="text"
              value={extra}
              onChange={e => setExtra(e.target.value)}
              placeholder="Instruksi tambahan (opsional)..."
              className="soft-input w-full px-4 py-2.5 text-sm"
            />

            {/* Generate button */}
            <button
              onClick={generateThread}
              disabled={loading}
              className="aurora-btn w-full py-3.5 font-bold cursor-pointer disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Generating...
                </>
              ) : (
                `🚀 Buat Utas ${currentMode?.label || ''}`
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-300 flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
                {error.includes('API Key') && (
                  <button onClick={onSettings} className="ml-auto underline text-rose-200 hover:text-rose-100 whitespace-nowrap">
                    Atur sekarang
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ─── Quick Tools ─── */}
          <div className="soft-card p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.15em] mb-3">
              Quick Refinement Tools
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickTools.map(t => (
                <button
                  key={t.id}
                  onClick={() => applyQuickTool(t.id)}
                  disabled={loading}
                  className="glass-tab p-3 rounded-xl text-xs font-bold text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-center transition-all"
                >
                  <span className="block text-lg mb-1">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Right: Result Panel ─── */}
        <div className="space-y-5" ref={resultRef}>
          <div className="soft-card p-5 min-h-[300px] animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white/70 uppercase tracking-[0.1em]">Hasil Utas</h3>
              {result && (
                <button
                  onClick={copyResult}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 cursor-pointer"
                >
                  📋 Salin
                </button>
              )}
            </div>

            {loading ? (
              <SlideLoading />
            ) : result ? (
              <div className="space-y-3 text-sm leading-relaxed whitespace-pre-wrap" ref={quickRef}>
                {result.split('---').map((slide, i) => (
                  <div
                    key={i}
                    className="glass-light rounded-xl p-4 border-l-2"
                    style={{ borderLeftColor: ['#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'][i % 5] }}
                  >
                    <div className="text-[10px] text-white/30 font-bold mb-2 flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold"
                        style={{ background: ['rgba(6,182,212,0.15)', 'rgba(139,92,246,0.15)', 'rgba(236,72,153,0.15)', 'rgba(20,184,166,0.15)', 'rgba(245,158,11,0.15)'][i % 5],
                                 color: ['#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'][i % 5] }}
                      >
                        {i + 1}
                      </span>
                      Slide {i + 1} / {result.split('---').length}
                    </div>
                    {slide.trim()}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-white/30 text-sm">
                <div className="text-5xl mb-5 opacity-30">💬</div>
                <p>Hasil utas akan muncul di sini</p>
                <p className="text-xs mt-2 text-white/20">Pilih mode, masukkan ide, klik generate</p>
              </div>
            )}
          </div>

          {/* ─── History ─── */}
          {history.length > 0 && (
            <div className="soft-card p-5 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <h3 className="font-bold text-sm text-white/70 uppercase tracking-[0.1em] mb-3">Riwayat</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.slice(0, 10).map(h => (
                  <div
                    key={h.id}
                    onClick={() => {
                      setResult(h.output)
                      setInput(h.input)
                      setActiveMode(h.mode)
                    }}
                    className="glass-tab border border-white/[0.03] p-2.5 rounded-xl cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span>{modes.find(m => m.id === h.mode)?.icon || '💬'}</span>
                      <span className="font-bold text-white/80 truncate group-hover:text-white transition-colors">
                        {h.input.slice(0, 40)}
                      </span>
                    </div>
                    <div className="text-[10px] text-white/30 mt-1">
                      {new Date(h.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
