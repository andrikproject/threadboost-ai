import { useState, useRef, useEffect } from 'react'
import { callSumopod, callSumopodJSON } from '../api'

const modes = [
  { id: 'storytelling', icon: '📖', label: 'Storytelling', color: 'from-violet-500 to-purple-600' },
  { id: 'marketing', icon: '🛍️', label: 'Marketing', color: 'from-rose-500 to-pink-600' },
  { id: 'engagement', icon: '💬', label: 'Engagement', color: 'from-amber-500 to-orange-600' },
  { id: 'affiliate', icon: '🔗', label: 'Shopee Affiliate', color: 'from-emerald-500 to-green-600' },
  { id: 'secret', icon: '🤫', label: 'Secret Viral', color: 'from-fuchsia-500 to-pink-600' },
  { id: 'spinner', icon: '🌀', label: 'Thread Spinner', color: 'from-cyan-500 to-blue-600' },
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
  { id: 'bisnis', name: 'Seller Digital', niche: 'Digital product, passive income', style: 'Persuasif,亲切' },
  { id: 'affiliate', name: 'Affiliate Marketer', niche: 'Shopee, e-commerce, rekomendasi produk', style: 'Review personal, tulus' },
  { id: 'kreator', name: 'Kreator Konten', niche: 'Humor, opini, trending topic', style: 'Santai, ceplas-ceplos' },
]

export default function Dashboard({ user, apiKey, apiModel, onLogout, onSettings }) {
  const [activeMode, setActiveMode] = useState('storytelling')
  const [input, setInput] = useState('')
  const [extra, setExtra] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [personas, setPersonas] = useState(personaTemplates)
  const [selectedPersona, setSelectedPersona] = useState(personas[0])
  const [shopeeLink, setShopeeLink] = useState('')
  const [viralInput, setViralInput] = useState('')
  const [dailyMissions, setDailyMissions] = useState([])
  const quickRef = useRef(null)

  // Load history from localStorage
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
    if (!input.trim()) {
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
          prompt = `Utas asli:\n"${input}"\n\n${extra ? `Gaya/niche target: "${extra}"` : ''}\n\nTulis ulang dengan gaya berbeda.`
          break
        case 'persona':
          sysPrompt = `Kamu adalah ${selectedPersona.name} dengan niche ${selectedPersona.niche} dan gaya ${selectedPersona.style}.`
          prompt = `Topik: "${input}"\n${extra ? `Instruksi: "${extra}"` : ''}\n\nBuat utas Threads dengan persona ini.`
          break
        case 'daily':
          prompt = `Buatkan 5 ide utas Threads harian tentang: "${input}".\n ${extra ? `Tambahan: "${extra}"` : ''}\n\nFormat: tiap ide dengan hook dan deskripsi singkat. Pisahkan dengan "---"`
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
      navigator.clipboard.writeText(result)
        .then(() => alert('Tersalin!'))
        .catch(() => {})
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Top Bar */}
      <header className="border-b border-white/5 px-4 py-3 flex items-center justify-between sticky top-0 bg-neutral-950/90 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-sm font-bold">TB</span>
          <span className="font-bold">Thread<span className="text-cyan-400">Boost</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onSettings} className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold transition cursor-pointer">⚙️</button>
          <button onClick={onLogout} className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold transition cursor-pointer">Keluar</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Mode Selection & Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mode Tabs */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`p-2 rounded-xl text-center transition cursor-pointer ${
                  activeMode === m.id
                    ? `bg-gradient-to-br ${m.color} text-white shadow-lg scale-105`
                    : 'bg-neutral-900/50 border border-white/5 hover:border-white/20 text-neutral-400'
                }`}
              >
                <div className="text-lg mb-0.5">{m.icon}</div>
                <div className="text-[9px] font-bold leading-tight">{m.label}</div>
              </button>
            ))}
          </div>

          {/* Mode-specific inputs */}
          <div className="bg-neutral-900/50 rounded-2xl p-5 border border-white/5 space-y-4">
            <h2 className="font-bold flex items-center gap-2">
              {modes.find(m => m.id === activeMode)?.icon}
              {modes.find(m => m.id === activeMode)?.label}
            </h2>

            {/* Persona selector */}
            {activeMode === 'persona' && (
              <div className="grid grid-cols-2 gap-2">
                {personas.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPersona(p)}
                    className={`p-3 rounded-xl text-left text-xs transition cursor-pointer ${
                      selectedPersona.id === p.id
                        ? 'bg-cyan-500/20 border border-cyan-500/50'
                        : 'bg-neutral-800 border border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold mb-1">{p.name}</div>
                    <div className="text-[10px] text-neutral-500">{p.niche}</div>
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
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            )}

            {/* Spinner & Viral */}
            {(activeMode === 'spinner') && (
              <textarea
                value={viralInput}
                onChange={e => setViralInput(e.target.value)}
                placeholder="Tempel utas asli yang mau di-rewrite..."
                rows={4}
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 resize-none"
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
              className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 resize-none"
            />

            {/* Extra instructions */}
            <input
              type="text"
              value={extra}
              onChange={e => setExtra(e.target.value)}
              placeholder="Instruksi tambahan (opsional)..."
              className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
            />

            {/* Generate button */}
            <button
              onClick={generateThread}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl font-bold hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                `🚀 Buat Utas ${modes.find(m => m.id === activeMode)?.label || ''}`
              )}
            </button>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-rose-300">
                ❌ {error}
                {error.includes('API Key') && (
                  <button onClick={onSettings} className="ml-2 underline">Atur sekarang</button>
                )}
              </div>
            )}
          </div>

          {/* Quick Tools */}
          <div className="bg-neutral-900/50 rounded-2xl p-5 border border-white/5">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Quick Refinement Tools</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickTools.map(t => (
                <button
                  key={t.id}
                  onClick={() => applyQuickTool(t.id)}
                  disabled={loading}
                  className="p-3 bg-neutral-800 rounded-xl text-xs font-bold hover:bg-neutral-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Result */}
        <div className="space-y-4">
          <div className="bg-neutral-900/50 rounded-2xl p-5 border border-white/5 min-h-[300px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">Hasil Utas</h3>
              {result && (
                <button onClick={copyResult} className="text-xs text-cyan-400 hover:text-cyan-300 transition cursor-pointer">
                  📋 Salin
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mb-4" />
                <p className="text-sm">Menulis utas...</p>
              </div>
            ) : result ? (
              <div className="space-y-3 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {result.split('---').map((slide, i) => (
                  <div key={i} className="bg-neutral-800/50 rounded-xl p-4 border border-white/5">
                    <div className="text-[10px] text-neutral-600 font-bold mb-1">{i + 1}/{result.split('---').length}</div>
                    {slide.trim()}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-neutral-600 text-sm">
                <div className="text-4xl mb-4">💬</div>
                <p>Hasil utas akan muncul di sini</p>
                <p className="text-xs mt-1">Pilih mode, masukkan ide, klik generate</p>
              </div>
            )}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-neutral-900/50 rounded-2xl p-5 border border-white/5">
              <h3 className="font-bold text-sm mb-3">Riwayat</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.slice(0, 10).map(h => (
                  <div
                    key={h.id}
                    onClick={() => {
                      setResult(h.output)
                      setInput(h.input)
                      setActiveMode(h.mode)
                    }}
                    className="p-2.5 bg-neutral-800 rounded-xl cursor-pointer hover:bg-neutral-700 transition"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span>{modes.find(m => m.id === h.mode)?.icon || '💬'}</span>
                      <span className="font-bold truncate">{h.input.slice(0, 40)}</span>
                    </div>
                    <div className="text-[10px] text-neutral-600 mt-1">
                      {new Date(h.createdAt).toLocaleDateString('id-ID')}
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
