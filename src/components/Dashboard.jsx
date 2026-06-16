import { useState, useRef, useEffect, useCallback } from 'react'
import { callSumopod } from '../api'
import { useToast } from './Toast'

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */

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

const templates = [
  { mode: 'storytelling', icon: '📖', title: 'Pertama Kali', input: 'Ceritakan pengalaman pertama kali kamu melakukan sesuatu yang berkesan', extra: 'Bikin hook yang relatable banget' },
  { mode: 'storytelling', icon: '💔', title: 'Kegagalan', input: 'Cerita tentang kegagalan yang akhirnya jadi pelajaran berharga', extra: 'Tone reflektif dan inspiring' },
  { mode: 'marketing', icon: '🛍️', title: 'Promo Produk', input: 'Produk skincare lokal yang lagi viral, affordable, results in 2 weeks', extra: 'Soft selling, kayak sharing pengalaman pribadi' },
  { mode: 'marketing', icon: '💼', title: 'Jasa/Skill', input: 'Jasa desain grafis untuk UMKM, harga terjangkau', extra: 'Fokus ke pain point owner UMKM' },
  { mode: 'engagement', icon: '🔥', title: 'Hot Take', input: 'Pendapat tentang work from home vs work from office, mana lebih produktif?', extra: 'Bikin pro-kontra yang engaging' },
  { mode: 'engagement', icon: '😂', title: 'Humor', input: 'Kejadian lucu pas naik KRL/angkot di jam sibuk', extra: 'Humor ringan, relatable' },
  { mode: 'affiliate', icon: '🔗', title: 'Review Produk', input: 'TWS murah Rp50-100rb yang kualitasnya gak kalah sama mahal', extra: 'Honest review, sebut plus minus' },
  { mode: 'secret', icon: '🤫', title: 'Kontroversi', input: 'Kenapa menurutku overthinking itu sebenarnya privilege', extra: 'Hook yang bikin orang berhenti scrolling' },
  { mode: 'daily', icon: '📅', title: 'Ide Harian', input: 'Content creator pemula di niche teknologi', extra: 'Fokus ke tips dan trik' },
  { mode: 'spinner', icon: '🌀', title: 'Rewrite Viral', input: 'Gue dulu mikir jadi content creator itu gampang. Pas nyoba, baru ngerasa susahnya. Bikin konten tiap hari? Capek. Edit video berjam-jam? Nyesek. Tapi pas liat comment orang yang bilang "makasih, ini ngebantu banget", semua capek ilang. Sekarang gue paham, konsistensi > kesempurnaan.', extra: 'Ubah ke gaya storytelling yang lebih hangat dan personal' },
]

const personaTemplates = [
  { id: 'personal', name: 'Personal Branding', niche: 'Self-development, lifestyle', style: 'Santai, reflektif' },
  { id: 'bisnis', name: 'Seller Digital', niche: 'Digital product, passive income', style: 'Persuasif' },
  { id: 'affiliate', name: 'Affiliate Marketer', niche: 'Shopee, e-commerce', style: 'Review personal, tulus' },
  { id: 'kreator', name: 'Kreator Konten', niche: 'Humor, opini, trending', style: 'Santai, ceplas-ceplos' },
]

const badges = [
  { id: 'first', icon: '🌟', name: 'First Thread', desc: 'Generate thread pertama', check: s => s >= 1 },
  { id: 'ten', icon: '💪', name: '10 Threads Club', desc: 'Generate 10 thread', check: s => s >= 10 },
  { id: 'storyteller', icon: '📖', name: 'Storyteller', desc: 'Pakai mode Storytelling', check: s => s.modesUsed?.storytelling },
  { id: 'marketer', icon: '📈', name: 'Marketer', desc: 'Pakai mode Marketing', check: s => s.modesUsed?.marketing },
  { id: 'quick', icon: '⚡', name: 'Quick Thinker', desc: 'Pakai semua Quick Tools', check: s => s.quickToolsCount >= 4 },
  { id: 'viral', icon: '🔥', name: 'Viral Seeker', desc: 'Pakai mode Secret Viral', check: s => s.modesUsed?.secret },
  { id: 'spinner', icon: '🌀', name: 'Rewriter', desc: 'Pakai mode Thread Spinner', check: s => s.modesUsed?.spinner },
  { id: 'daily', icon: '📅', name: 'Planner', desc: 'Pakai mode Daily Reminder', check: s => s.modesUsed?.daily },
  { id: 'persona', icon: '🎭', name: 'Shape Shifter', desc: 'Pakai mode Multi-Persona', check: s => s.modesUsed?.persona },
]

/* ═══════════════════════════════════════
   REAL TIME CLOCK
   ═══════════════════════════════════════ */

function RealTimeClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
  const h = String(now.getHours()).padStart(2,'0'), m = String(now.getMinutes()).padStart(2,'0'), s = String(now.getSeconds()).padStart(2,'0')
  return (
    <div className="flex items-center gap-2 text-white/50 text-xs font-mono tracking-wider">
      <span className="hidden sm:inline">{days[now.getDay()]}, {now.getDate()} {months[now.getMonth()]} {now.getFullYear()}</span>
      <span className="flex items-center gap-1.5 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.05]">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{h}:{m}:{s}</span>
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════
   THREAD PREVIEW MODAL
   ═══════════════════════════════════════ */

function ThreadPreview({ slides, onClose }) {
  return (
    <div className="thread-preview-overlay" onClick={onClose}>
      <div className="thread-preview-card" onClick={e => e.stopPropagation()}>
        <div className="threads-header">
          <div className="threads-avatar">U</div>
          <div>
            <div className="threads-name">User</div>
            <div className="threads-handle">@user • Threads</div>
          </div>
        </div>
        {slides.map((s, i) => (
          <div key={i} className="threads-slide">
            <span className="threads-slide-num">{i + 1}</span>
            {s.trim()}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   BADGES PANEL
   ═══════════════════════════════════════ */

function BadgesPanel({ stats }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <h3 className="font-bold text-xs text-white/40 uppercase tracking-[0.1em]">Badge</h3>
      </div>
      <div className="badge-grid">
        {badges.map(b => {
          const unlocked = b.check(stats)
          return (
            <div key={b.id} className={`badge-item ${unlocked ? 'unlocked' : 'locked'}`} title={b.desc}>
              <span className="badge-icon">{b.icon}</span>
              <span className="badge-name">{b.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   TEMPLATES MODAL
   ═══════════════════════════════════════ */

function TemplatesModal({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="glass-strong rounded-2xl p-5 max-w-lg w-full max-h-[70vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">🎯 Contoh Thread</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 cursor-pointer text-lg">✕</button>
        </div>
        <div className="template-grid">
          {templates.map((t, i) => (
            <button key={i} className="template-card" onClick={() => onSelect(t)}>
              <div className="text-lg mb-1">{t.icon}</div>
              <div className="font-bold text-xs text-white/80">{t.title}</div>
              <div className="text-[10px] text-white/30 mt-0.5">{t.mode}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   CUSTOM PERSONA MODAL
   ═══════════════════════════════════════ */

function CustomPersonaModal({ onSave, onClose }) {
  const [name, setName] = useState('')
  const [niche, setNiche] = useState('')
  const [style, setStyle] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="glass-strong rounded-2xl p-6 max-w-sm w-full animate-scale-in" onClick={e => e.stopPropagation()}>
        <h3 className="font-bold mb-4">🎭 Persona Baru</h3>
        <div className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama persona" className="soft-input w-full px-4 py-2.5 text-sm" />
          <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Niche (e.g. Self-development)" className="soft-input w-full px-4 py-2.5 text-sm" />
          <input value={style} onChange={e => setStyle(e.target.value)} placeholder="Gaya (e.g. Santai, reflektif)" className="soft-input w-full px-4 py-2.5 text-sm" />
          <button onClick={() => { if (name && niche && style) { onSave({ id: Date.now().toString(), name, niche, style }); onClose() } }} className="aurora-btn w-full py-2.5 font-bold text-sm cursor-pointer">
            Simpan Persona
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   SLIDE LOADING
   ═══════════════════════════════════════ */

function SlideLoading() {
  return (
    <div className="space-y-3">
      {[1,2,3].map(i => (
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

/* ═══════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════ */

export default function Dashboard({ user, apiKey, apiModel, onLogout, onSettings }) {
  const toast = useToast()
  const [activeMode, setActiveMode] = useState('storytelling')
  const [input, setInput] = useState('')
  const [extra, setExtra] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [favorites, setFavorites] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [personas, setPersonas] = useState(() => {
    try { return JSON.parse(localStorage.getItem('threadboost_personas') || '[]') } catch { return [] }
  })
  const [selectedPersona, setSelectedPersona] = useState(personaTemplates[0])
  const [shopeeLink, setShopeeLink] = useState('')
  const [viralInput, setViralInput] = useState('')
  const [modePanel, setModePanel] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showCustomPersona, setShowCustomPersona] = useState(false)
  const [stats, setStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('threadboost_stats') || '{"total":0,"modesUsed":{},"quickToolsCount":0}') } catch { return { total: 0, modesUsed: {}, quickToolsCount: 0 } }
  })
  const resultRef = useRef(null)
  const quickRef = useRef(null)

  /* ─── Load stored data ─── */
  useEffect(() => {
    try {
      setHistory(JSON.parse(localStorage.getItem('threadboost_history') || '[]'))
      setFavorites(JSON.parse(localStorage.getItem('threadboost_favorites') || '[]'))
      const saved = JSON.parse(localStorage.getItem('threadboost_personas') || '[]')
      if (saved.length) {
        setPersonas(saved)
        setSelectedPersona(saved[0])
      }
    } catch {}
  }, [])

  /* ─── Auto-save draft ─── */
  useEffect(() => {
    if (input || extra) {
      const timer = setTimeout(() => {
        localStorage.setItem('threadboost_draft', JSON.stringify({ mode: activeMode, input, extra, shopeeLink, viralInput }))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [input, extra, activeMode, shopeeLink, viralInput])

  /* ─── Restore draft ─── */
  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem('threadboost_draft'))
      if (draft) {
        setActiveMode(draft.mode || 'storytelling')
        setInput(draft.input || '')
        setExtra(draft.extra || '')
        if (draft.shopeeLink) setShopeeLink(draft.shopeeLink)
        if (draft.viralInput) setViralInput(draft.viralInput)
      }
    } catch {}
  }, [])

  /* ─── Keyboard shortcut ─── */
  useEffect(() => {
    const handler = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        generateThread()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeMode, input, extra, apiKey, shopeeLink, viralInput, selectedPersona])

  const updateStats = useCallback((mode, isQuickTool) => {
    setStats(prev => {
      const next = {
        total: prev.total + 1,
        modesUsed: { ...prev.modesUsed, [mode]: true },
        quickToolsCount: isQuickTool ? (prev.quickToolsCount || 0) + 1 : (prev.quickToolsCount || 0),
      }
      localStorage.setItem('threadboost_stats', JSON.stringify(next))
      return next
    })
  }, [])

  const saveToHistory = (mode, inputText, output) => {
    const entry = { id: Date.now(), mode, input: inputText, output, createdAt: new Date().toISOString() }
    const updated = [entry, ...history].slice(0, 50)
    setHistory(updated)
    localStorage.setItem('threadboost_history', JSON.stringify(updated))
  }

  const systemPrompts = {
    storytelling: `Kamu adalah penulis utas Threads Indonesia. Buat utas storytelling yang natural, gaul, khas anak Threads Indonesia, ada hook kuat di awal, cerita mengalir dengan emosi, pake diksi sehari-hari. Akhiri dengan call-to-action yang engaging. Format: tiap slide dipisah "---"`,
    marketing: `Kamu adalah copywriter Threads Indonesia ahli soft-selling. Fokus ke pain point, baru selipkan solusi. Natural, relatable, panggil audiens "lu". Hook kuat, storytelling, closing soft-sell. Format: tiap slide dipisah "---"`,
    engagement: `Buat utas interaksi Threads Indonesia: topik hangat/opini/humor relatable, gaya santai, ajak diskusi, pancing reply dengan pertanyaan open-ended. Format: tiap slide dipisah "---"`,
    affiliate: `Kamu affiliate marketer Threads Indonesia. Ubah produk/link jadi utas review kayak cerita pengalaman pribadi, natural, jujur. Cantumin link di slide terakhir secara halus. Format: tiap slide dipisah "---"`,
    secret: `Kreator viral Threads Indonesia. Hook kontroversial/relatable, cerita bikin penasaran, plot twist, gaya ceplas-ceplos berani. Format: tiap slide dipisah "---"`,
    spinner: `Kreator jago rewrite. Tulis ulang utas dengan gaya berbeda, struktur diubah, hook baru lebih kuat, pertahankan esensi. Format: tiap slide dipisah "---"`,
  }

  const generateThread = async () => {
    if (!input.trim() && activeMode !== 'spinner') { setError('Masukkan ide/topik dulu!'); return }
    if (!apiKey) { setError('Atur API Key dulu di Pengaturan!'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const useInput = activeMode === 'spinner' ? viralInput : input
      let prompt = '', sysPrompt = systemPrompts[activeMode] || systemPrompts.storytelling
      switch (activeMode) {
        case 'storytelling': case 'marketing': case 'engagement': case 'secret':
          prompt = `Topik/Ide: "${useInput}"\n${extra ? `Instruksi Tambahan: "${extra}"` : ''}\n\nBuatkan utas Threads Indonesia yang engaging.`
          break
        case 'affiliate':
          prompt = `Produk: ${useInput}\n${shopeeLink ? `Link: ${shopeeLink}` : ''}\n${extra ? `Info tambahan: "${extra}"` : ''}\n\nBuat utas review natural.`
          break
        case 'spinner':
          prompt = `Utas asli:\n"${viralInput}"\n\n${extra ? `Gaya/niche target: "${extra}"` : ''}\n\nTulis ulang dengan gaya berbeda.`
          break
        case 'persona':
          sysPrompt = `Kamu adalah ${selectedPersona.name} dengan niche ${selectedPersona.niche} dan gaya ${selectedPersona.style}.`
          prompt = `Topik: "${useInput}"\n${extra ? `Instruksi: "${extra}"` : ''}\n\nBuat utas Threads dengan persona ini.`
          break
        case 'daily':
          prompt = `Buatkan 5 ide utas Threads harian tentang: "${useInput}".\n${extra ? `Tambahan: "${extra}"` : ''}\n\nFormat: tiap ide dengan hook dan deskripsi singkat. Pisahkan dengan "---"`
          break
      }
      const content = await callSumopod(prompt, sysPrompt, apiKey, apiModel)
      setResult(content)
      saveToHistory(activeMode, useInput, content)
      updateStats(activeMode, false)
      toast('✅ Thread berhasil dibuat!', 'success')
    } catch (e) { setError(e.message); toast(e.message, 'error') }
    finally { setLoading(false) }
  }

  const applyQuickTool = async (tool) => {
    if (!result && !input.trim()) { setError('Hasilkan utas dulu atau masukkan teks!'); return }
    setLoading(true); setError('')
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
      updateStats(tool, true)
      toast('✨ Tools applied!', 'success')
    } catch (e) { setError(e.message); toast(e.message, 'error') }
    finally { setLoading(false) }
  }

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result).then(() => {
        toast('📋 Tersalin ke clipboard!', 'success')
      }).catch(() => {})
    }
  }

  const toggleFavorite = (id) => {
    const isFav = favorites.includes(id)
    const updated = isFav ? favorites.filter(f => f !== id) : [...favorites, id]
    setFavorites(updated)
    localStorage.setItem('threadboost_favorites', JSON.stringify(updated))
    toast(isFav ? '⭐ Dihapus dari favorit' : '⭐ Ditambahkan ke favorit!', 'star')
  }

  const exportThread = () => {
    if (!result) return
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `thread-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast('📤 File terdownload!', 'success')
  }

  const applyTemplate = (t) => {
    setActiveMode(t.mode)
    if (t.mode === 'spinner') setViralInput(t.input)
    else setInput(t.input)
    if (t.extra) setExtra(t.extra)
    setShowTemplates(false)
    toast('🎯 Template siap! Tinggal generate', 'info')
  }

  const saveCustomPersona = (p) => {
    const updated = [...personas, p]
    setPersonas(updated)
    setSelectedPersona(p)
    localStorage.setItem('threadboost_personas', JSON.stringify(updated))
    toast('🎭 Persona baru tersimpan!', 'success')
  }

  const threadStats = result ? {
    chars: result.length,
    slides: result.split('---').length,
    readTime: Math.max(1, Math.round(result.split(' ').length / 200)),
  } : null

  const filteredHistory = history.filter(h => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return h.input.toLowerCase().includes(q) || h.output?.toLowerCase().includes(q) || h.mode.toLowerCase().includes(q)
  })

  const currentMode = modes.find(m => m.id === activeMode)
  const previewSlides = result ? result.split('---') : []

  return (
    <div className="relative min-h-screen text-white bg-[#0a0a0f]">
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb" /><div className="aurora-orb" /><div className="aurora-orb" />
      </div>

      {/* ─── HEADER ─── */}
      <header className="relative z-30 glass-strong border-b border-white/[0.04] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold shadow-lg shadow-cyan-500/20">TB</span>
          <span className="font-bold">Thread<span className="aurora-text">Boost</span></span>
        </div>
        <div className="flex items-center gap-3">
          <RealTimeClock />
          <button onClick={onSettings} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer text-sm" title="Pengaturan">⚙️</button>
          <button onClick={onLogout} className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-bold transition-all cursor-pointer">Keluar</button>
        </div>
      </header>

      {/* ─── MOBILE MODE PICKER ─── */}
      <button onClick={() => setModePanel(!modePanel)} className="relative z-20 lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/[0.04] text-sm">
        <span className="flex items-center gap-2"><span>{currentMode?.icon}</span><span className="font-bold">{currentMode?.label}</span></span>
        <span className="text-white/30 text-xs">{modePanel ? '▲' : '▼'}</span>
      </button>
      {modePanel && (
        <div className="relative z-20 lg:hidden px-3 py-3 bg-white/[0.02] border-b border-white/[0.04] animate-fade-up">
          <div className="grid grid-cols-4 gap-1.5">
            {modes.map(m => (
              <button key={m.id} onClick={() => { setActiveMode(m.id); setModePanel(false) }}
                className={`p-2 rounded-xl text-center transition-all cursor-pointer ${activeMode === m.id ? 'bg-gradient-to-br ' + m.color + ' text-white shadow-lg scale-105' : 'glass-tab'}`}>
                <div className="text-base mb-0.5">{m.icon}</div>
                <div className="text-[8px] font-bold leading-tight opacity-70">{m.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── LEFT COLUMN ─── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Mode Tabs (Desktop) */}
          <div className="hidden lg:grid grid-cols-8 gap-2">
            {modes.map(m => (
              <button key={m.id} onClick={() => setActiveMode(m.id)}
                className={`p-2.5 rounded-xl text-center transition-all cursor-pointer ${activeMode === m.id ? `bg-gradient-to-br ${m.color} text-white shadow-lg scale-105` : 'glass-tab'}`}>
                <div className="text-lg mb-0.5">{m.icon}</div>
                <div className="text-[9px] font-bold leading-tight opacity-70">{m.label}</div>
              </button>
            ))}
          </div>

          {/* ─── INPUT PANEL ─── */}
          <div className="soft-card p-5 md:p-6 space-y-4 animate-fade-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{currentMode?.icon}</span>
                <h2 className="font-bold text-lg bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{currentMode?.label}</h2>
              </div>
              <button onClick={() => setShowTemplates(true)} className="text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition-all cursor-pointer">
                🎯 Contoh
              </button>
            </div>

            {activeMode === 'persona' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {personas.map(p => (
                    <button key={p.id} onClick={() => setSelectedPersona(p)}
                      className={`p-3 rounded-xl text-left text-xs transition-all cursor-pointer ${selectedPersona.id === p.id ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/30' : 'glass-tab border border-white/[0.04]'}`}>
                      <div className="font-bold text-white/90 mb-1">{p.name}</div>
                      <div className="text-[10px] text-white/40">{p.niche}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowCustomPersona(true)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">
                  + Buat Persona Baru
                </button>
              </div>
            )}

            {activeMode === 'affiliate' && (
              <input type="text" value={shopeeLink} onChange={e => setShopeeLink(e.target.value)} placeholder="Link Shopee (opsional)" className="soft-input w-full px-4 py-2.5 text-sm" />
            )}
            {activeMode === 'spinner' && (
              <textarea value={viralInput} onChange={e => setViralInput(e.target.value)} placeholder="Tempel utas asli..." rows={4} className="soft-input w-full px-4 py-3 text-sm resize-none" />
            )}

            <textarea value={activeMode === 'spinner' ? viralInput : input}
              onChange={e => { if (activeMode === 'spinner') setViralInput(e.target.value); else setInput(e.target.value) }}
              placeholder={activeMode === 'storytelling' ? 'Ceritakan ide atau pengalamanmu...' :
                activeMode === 'marketing' ? 'Produk/layanan yang mau dipromosikan?' :
                activeMode === 'engagement' ? 'Topik opini/humor...' :
                activeMode === 'affiliate' ? 'Nama atau deskripsi produk...' :
                activeMode === 'secret' ? 'Ide liar/topik yang pengen diviralkan...' :
                activeMode === 'spinner' ? '' :
                activeMode === 'persona' ? 'Topik utas...' :
                activeMode === 'daily' ? 'Topik/niche untuk ide harian...' : 'Masukkan ide...'}
              rows={4} className="soft-input w-full px-4 py-3 text-sm resize-none"
            />

            <input type="text" value={extra} onChange={e => setExtra(e.target.value)} placeholder="Instruksi tambahan (opsional)..." className="soft-input w-full px-4 py-2.5 text-sm" />

            {/* Stats bar */}
            {threadStats && (
              <div className="stats-bar">
                <span className="stats-item">📝 {threadStats.chars} karakter</span>
                <span className="stats-item">📄 {threadStats.slides} slide</span>
                <span className="stats-item">⏱ {threadStats.readTime}m baca</span>
              </div>
            )}

            <button onClick={generateThread} disabled={loading}
              className="aurora-btn w-full py-3.5 font-bold cursor-pointer disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Generating...
              </> : `🚀 Buat Utas ${currentMode?.label || ''}`}
            </button>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-300 flex items-center gap-2">
                <span>⚠️</span><span>{error}</span>
                {error.includes('API Key') && <button onClick={onSettings} className="ml-auto underline text-rose-200 whitespace-nowrap cursor-pointer">Atur sekarang</button>}
              </div>
            )}
          </div>

          {/* ─── QUICK TOOLS ─── */}
          <div className="soft-card p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.15em] mb-3">Quick Refinement Tools</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickTools.map(t => (
                <button key={t.id} onClick={() => applyQuickTool(t.id)} disabled={loading}
                  className="glass-tab p-3 rounded-xl text-xs font-bold text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-center transition-all">
                  <span className="block text-lg mb-1">{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── RIGHT: RESULT ─── */}
        <div className="space-y-5" ref={resultRef}>
          <div className="soft-card p-5 min-h-[300px] animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white/70 uppercase tracking-[0.1em]">Hasil Utas</h3>
              {result && (
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setShowPreview(true)} className="text-xs text-white/50 hover:text-white bg-white/[0.04] px-2.5 py-1.5 rounded-lg border border-white/[0.06] transition-all cursor-pointer" title="Preview Threads">👁</button>
                  <button onClick={exportThread} className="text-xs text-white/50 hover:text-white bg-white/[0.04] px-2.5 py-1.5 rounded-lg border border-white/[0.06] transition-all cursor-pointer" title="Export .txt">📤</button>
                  <button onClick={() => toggleFavorite(history[0]?.id)} className="text-xs text-white/50 hover:text-amber-400 bg-white/[0.04] px-2.5 py-1.5 rounded-lg border border-white/[0.06] transition-all cursor-pointer" title="Favorit">
                    {history[0] && favorites.includes(history[0].id) ? '⭐' : '☆'}
                  </button>
                  <button onClick={copyResult} className="text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition-all cursor-pointer">
                    📋 Salin
                  </button>
                </div>
              )}
            </div>

            {loading ? <SlideLoading /> : result ? (
              <div className="space-y-3 text-sm leading-relaxed whitespace-pre-wrap" ref={quickRef}>
                {result.split('---').map((slide, i) => (
                  <div key={i} className="glass-light rounded-xl p-4 border-l-2"
                    style={{ borderLeftColor: ['#06b6d4','#8b5cf6','#ec4899','#14b8a6','#f59e0b'][i%5] }}>
                    <div className="text-[10px] text-white/30 font-bold mb-2 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold"
                        style={{ background: ['rgba(6,182,212,0.15)','rgba(139,92,246,0.15)','rgba(236,72,153,0.15)','rgba(20,184,166,0.15)','rgba(245,158,11,0.15)'][i%5],
                                 color: ['#06b6d4','#8b5cf6','#ec4899','#14b8a6','#f59e0b'][i%5] }}>{i+1}</span>
                      Slide {i+1}/{result.split('---').length}
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
                <p className="text-xs mt-1 text-white/10">Shortcut: <kbd className="px-1.5 py-0.5 bg-white/[0.05] rounded text-[10px]">Ctrl+Enter</kbd></p>
              </div>
            )}
          </div>

          {/* ─── BADGES ─── */}
          <div className="soft-card p-5 animate-fade-up" style={{ animationDelay: '0.12s' }}>
            <BadgesPanel stats={stats} />
          </div>

          {/* ─── HISTORY ─── */}
          {history.length > 0 && (
            <div className="soft-card p-5 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-white/70 uppercase tracking-[0.1em]">Riwayat</h3>
                <span className="text-[10px] text-white/20">{filteredHistory.length} item</span>
              </div>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="🔍 Cari riwayat..." className="soft-input w-full px-3 py-2 text-xs mb-3" />
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(searchQuery ? filteredHistory : history).slice(0, 10).map(h => (
                  <div key={h.id} onClick={() => { setResult(h.output); setInput(h.input); setActiveMode(h.mode) }}
                    className="glass-tab border border-white/[0.03] p-2.5 rounded-xl cursor-pointer group">
                    <div className="flex items-center gap-2 text-xs">
                      <span>{modes.find(m => m.id === h.mode)?.icon || '💬'}</span>
                      <span className="font-bold text-white/80 truncate group-hover:text-white transition-colors flex-1">{h.input.slice(0, 40)}</span>
                      <button onClick={e => { e.stopPropagation(); toggleFavorite(h.id) }} className="text-[10px] cursor-pointer">
                        {favorites.includes(h.id) ? '⭐' : '☆'}
                      </button>
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

      {/* ─── MODALS ─── */}
      {showTemplates && <TemplatesModal onSelect={applyTemplate} onClose={() => setShowTemplates(false)} />}
      {showPreview && <ThreadPreview slides={previewSlides} onClose={() => setShowPreview(false)} />}
      {showCustomPersona && <CustomPersonaModal onSave={saveCustomPersona} onClose={() => setShowCustomPersona(false)} />}
    </div>
  )
}
