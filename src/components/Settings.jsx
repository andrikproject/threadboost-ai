import { useState } from 'react'
import { fetchModels } from '../api'

export default function Settings({ user, apiKey, apiModel, apiEndpoint, detectedModels, onSave, onLogout, onBack }) {
  const [key, setKey] = useState(apiKey)
  const [model, setModel] = useState(apiModel || 'gpt-4o-mini')
  const [endpoint, setEndpoint] = useState(apiEndpoint || 'https://ai.sumopod.com/v1')
  const [detected, setDetected] = useState(detectedModels || [])
  const [saved, setSaved] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [detectError, setDetectError] = useState('')

  const handleSave = () => {
    onSave(key, model, endpoint, detected)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDetect = async () => {
    if (!key) { setDetectError('Isi API Key dulu!'); return }
    if (!endpoint) { setDetectError('Isi API Endpoint dulu!'); return }
    setDetecting(true)
    setDetectError('')
    try {
      const models = await fetchModels(endpoint, key)
      setDetected(models)
      if (models.length > 0) setModel(models[0].id)
      setDetectError(`✅ ${models.length} model ditemukan!`)
    } catch (e) {
      setDetectError(`❌ ${e.message}`)
    } finally {
      setDetecting(false)
    }
  }

  return (
    <div className="relative min-h-screen text-white bg-[#0a0a0f]">
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb" /><div className="aurora-orb" /><div className="aurora-orb" />
      </div>

      <div className="relative z-10">
        <header className="relative z-30 glass-strong border-b border-white/[0.04] px-4 py-3 flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer text-sm text-white/60 hover:text-white">←</button>
            <h1 className="font-bold text-lg">Pengaturan</h1>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          {/* ─── Profile ─── */}
          <section className="soft-card p-6 animate-fade-up">
            <div className="flex items-center gap-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <h2 className="font-bold text-xs text-white/40 uppercase tracking-[0.15em]">Akun</h2>
            </div>
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-14 h-14 rounded-2xl ring-2 ring-white/10 object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 flex items-center justify-center text-xl">👤</div>
              )}
              <div>
                <p className="font-bold text-white/90">{user.displayName || 'Pengguna'}</p>
                <p className="text-sm text-white/40">{user.email}</p>
              </div>
            </div>
          </section>

          {/* ─── API Settings ─── */}
          <section className="soft-card p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <h2 className="font-bold text-xs text-white/40 uppercase tracking-[0.15em]">AI Settings</h2>
            </div>

            <div className="space-y-5">
              {/* Custom Endpoint */}
              <div>
                <label className="block text-sm font-bold text-white/70 mb-1.5">API Endpoint</label>
                <input type="url" value={endpoint} onChange={e => setEndpoint(e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  className="soft-input w-full px-4 py-3 text-sm font-mono" />
                <p className="text-xs text-white/30 mt-1.5">OpenAI-compatible endpoint. Contoh: <code className="text-cyan-400/60">https://ai.sumopod.com/v1</code></p>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-bold text-white/70 mb-1.5">API Key <span className="text-rose-400">*</span></label>
                <input type="password" value={key} onChange={e => setKey(e.target.value)}
                  placeholder="sk-..." className="soft-input w-full px-4 py-3 text-sm" />
              </div>

              {/* Auto-Detect Models */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-bold text-white/70">Model</label>
                  <button onClick={handleDetect} disabled={detecting}
                    className="text-xs text-violet-400 hover:text-violet-300 bg-violet-500/10 px-3 py-1.5 rounded-lg border border-violet-500/20 transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5">
                    {detecting ? <>
                      <div className="w-3 h-3 rounded-full border border-violet-400/30 border-t-violet-400 animate-spin" />
                      Mendeteksi...
                    </> : '🔄 Deteksi Model'}
                  </button>
                </div>

                {detected.length > 0 ? (
                  <select value={model} onChange={e => setModel(e.target.value)}
                    className="soft-input w-full px-4 py-3 text-sm appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22rgba%28255%2C255%2C255%2C0.3%29%22%3E%3Cpath%20d%3D%22M6%208L1%203h10z%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10">
                    {detected.map(m => (
                      <option key={m.id} value={m.id} className="bg-[#14141e]">{m.id}</option>
                    ))}
                  </select>
                ) : (
                  <select value={model} onChange={e => setModel(e.target.value)}
                    className="soft-input w-full px-4 py-3 text-sm appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22rgba%28255%2C255%2C255%2C0.3%29%22%3E%3Cpath%20d%3D%22M6%208L1%203h10z%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10">
                    <option value="gpt-4o-mini" className="bg-[#14141e]">gpt-4o-mini</option>
                    <option value="gpt-4o" className="bg-[#14141e]">gpt-4o</option>
                    <option value="claude-sonnet-4" className="bg-[#14141e]">claude-sonnet-4</option>
                    <option value="gemini-2.5-flash" className="bg-[#14141e]">gemini-2.5-flash</option>
                    <option value="deepseek-chat" className="bg-[#14141e]">deepseek-chat</option>
                  </select>
                )}

                {detectError && (
                  <p className={`text-xs mt-1.5 ${detectError.startsWith('✅') ? 'text-emerald-400' : detectError.startsWith('❌') ? 'text-rose-400' : 'text-white/30'}`}>
                    {detectError}
                  </p>
                )}
              </div>

              <button onClick={handleSave} className="aurora-btn w-full py-3.5 font-bold cursor-pointer flex items-center justify-center gap-2">
                {saved ? '✓ Tersimpan!' : 'Simpan Pengaturan'}
              </button>
            </div>
          </section>

          {/* ─── Logout ─── */}
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={onLogout} className="w-full py-3.5 border border-rose-500/20 text-rose-400/80 rounded-xl font-bold hover:bg-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer">Keluar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
