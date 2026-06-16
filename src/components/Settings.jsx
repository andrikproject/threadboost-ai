import { useState } from 'react'

export default function Settings({ user, apiKey, apiModel, onSave, onLogout, onBack, isDemo }) {
  const [key, setKey] = useState(apiKey)
  const [model, setModel] = useState(apiModel || 'gpt-4o-mini')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave(key, model)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="relative min-h-screen text-white bg-[#0a0a0f]">
      {/* ─── Aurora Background ─── */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb" />
        <div className="aurora-orb" />
        <div className="aurora-orb" />
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10">
        {/* ─── Glass Header ─── */}
        <header className="relative z-30 glass-strong border-b border-white/[0.04] px-4 py-3 flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer text-sm text-white/60 hover:text-white"
            >
              ←
            </button>
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
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 flex items-center justify-center text-xl">
                  👤
                </div>
              )}
              <div>
                <p className="font-bold text-white/90">{user.displayName || 'Demo User'}</p>
                <p className="text-sm text-white/40">{user.email}</p>
                {isDemo && (
                  <span className="inline-block mt-1 text-[10px] bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold border border-amber-500/20">
                    MODE DEMO
                  </span>
                )}
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
              {/* Endpoint */}
              <div>
                <label className="block text-sm font-bold text-white/70 mb-1.5">API Endpoint</label>
                <div className="soft-input px-4 py-3 text-sm text-white/40 font-mono cursor-default">
                  https://ai.sumopod.com/v1
                </div>
                <p className="text-xs text-white/30 mt-1.5">OpenAI-compatible endpoint — sudah diatur otomatis</p>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-bold text-white/70 mb-1.5">
                  API Key <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  placeholder="sk-..."
                  className="soft-input w-full px-4 py-3 text-sm"
                />
                <p className="text-xs text-white/30 mt-1.5">Dapatkan API key dari dashboard Sumopod</p>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-bold text-white/70 mb-1.5">Model</label>
                <select
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="soft-input w-full px-4 py-3 text-sm appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22rgba%28255%2C255%2C255%2C0.3%29%22%3E%3Cpath%20d%3D%22M6%208L1%203h10z%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10"
                >
                  <option value="gpt-4o-mini" className="bg-[#14141e]">GPT-4o-mini (Cepat &amp; Hemat)</option>
                  <option value="gpt-4o" className="bg-[#14141e]">GPT-4o (Paling Pintar)</option>
                  <option value="gpt-4o-mini-search-preview" className="bg-[#14141e]">GPT-4o-mini Search</option>
                  <option value="claude-sonnet-4" className="bg-[#14141e]">Claude Sonnet 4</option>
                  <option value="gemini-2.5-flash" className="bg-[#14141e]">Gemini 2.5 Flash</option>
                  <option value="deepseek-chat" className="bg-[#14141e]">DeepSeek V3</option>
                </select>
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                className="aurora-btn w-full py-3.5 font-bold cursor-pointer flex items-center justify-center gap-2"
              >
                {saved ? (
                  <>
                    <span>✓</span> Tersimpan!
                  </>
                ) : (
                  'Simpan Pengaturan'
                )}
              </button>
            </div>
          </section>

          {/* ─── Logout ─── */}
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={onLogout}
              className="w-full py-3.5 border border-rose-500/20 text-rose-400/80 rounded-xl font-bold hover:bg-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
