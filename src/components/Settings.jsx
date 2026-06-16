import { useState } from 'react'

export default function Settings({ user, apiKey, apiModel, onSave, onLogout, onBack }) {
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
                  <optgroup label="🤖 OpenAI">
                    <option value="gpt-4o-mini" className="bg-[#14141e]">GPT-4o-mini (Cepat & Hemat)</option>
                    <option value="gpt-4o" className="bg-[#14141e]">GPT-4o (Paling Pintar)</option>
                    <option value="gpt-4o-mini-search-preview" className="bg-[#14141e]">GPT-4o-mini Search</option>
                    <option value="gpt-4.1" className="bg-[#14141e]">GPT-4.1</option>
                    <option value="gpt-4.1-mini" className="bg-[#14141e]">GPT-4.1-mini</option>
                    <option value="gpt-4.1-nano" className="bg-[#14141e]">GPT-4.1-nano</option>
                    <option value="gpt-4-turbo" className="bg-[#14141e]">GPT-4 Turbo</option>
                    <option value="o3-mini" className="bg-[#14141e]">o3-mini</option>
                    <option value="o1" className="bg-[#14141e]">o1</option>
                    <option value="o1-mini" className="bg-[#14141e]">o1-mini</option>
                  </optgroup>
                  <optgroup label="🧠 Anthropic">
                    <option value="claude-sonnet-4" className="bg-[#14141e]">Claude Sonnet 4</option>
                    <option value="claude-haiku-3.5" className="bg-[#14141e]">Claude Haiku 3.5</option>
                    <option value="claude-opus-4" className="bg-[#14141e]">Claude Opus 4</option>
                    <option value="claude-3.5-haiku" className="bg-[#14141e]">Claude 3.5 Haiku</option>
                    <option value="claude-3-opus" className="bg-[#14141e]">Claude 3 Opus</option>
                    <option value="claude-3-sonnet" className="bg-[#14141e]">Claude 3 Sonnet</option>
                  </optgroup>
                  <optgroup label="🟢 Google Gemini">
                    <option value="gemini-2.5-flash" className="bg-[#14141e]">Gemini 2.5 Flash</option>
                    <option value="gemini-2.5-pro" className="bg-[#14141e]">Gemini 2.5 Pro</option>
                    <option value="gemini-2.0-flash" className="bg-[#14141e]">Gemini 2.0 Flash</option>
                    <option value="gemini-2.0-flash-lite" className="bg-[#14141e]">Gemini 2.0 Flash Lite</option>
                    <option value="gemini-1.5-pro" className="bg-[#14141e]">Gemini 1.5 Pro</option>
                    <option value="gemini-1.5-flash" className="bg-[#14141e]">Gemini 1.5 Flash</option>
                  </optgroup>
                  <optgroup label="🔵 Meta Llama">
                    <option value="llama-4-maverick" className="bg-[#14141e]">Llama 4 Maverick</option>
                    <option value="llama-4-scout" className="bg-[#14141e]">Llama 4 Scout</option>
                    <option value="llama-3.3-70b" className="bg-[#14141e]">Llama 3.3 70B</option>
                    <option value="llama-3.1-8b" className="bg-[#14141e]">Llama 3.1 8B</option>
                    <option value="llama-3.1-70b" className="bg-[#14141e]">Llama 3.1 70B</option>
                    <option value="llama-3.1-405b" className="bg-[#14141e]">Llama 3.1 405B</option>
                  </optgroup>
                  <optgroup label="🎯 DeepSeek">
                    <option value="deepseek-chat" className="bg-[#14141e]">DeepSeek V3</option>
                    <option value="deepseek-reasoner" className="bg-[#14141e]">DeepSeek R1</option>
                    <option value="deepseek-v4" className="bg-[#14141e]">DeepSeek V4</option>
                    <option value="deepseek-v4-flash" className="bg-[#14141e]">DeepSeek V4 Flash</option>
                  </optgroup>
                  <optgroup label="🌀 Mistral">
                    <option value="mistral-large" className="bg-[#14141e]">Mistral Large</option>
                    <option value="mistral-small" className="bg-[#14141e]">Mistral Small</option>
                    <option value="mistral-nemo" className="bg-[#14141e]">Mistral Nemo</option>
                    <option value="codestral" className="bg-[#14141e]">Codestral</option>
                  </optgroup>
                  <optgroup label="🔥 Lainnya">
                    <option value="qwen3-235b-a22b" className="bg-[#14141e]">Qwen3 235B</option>
                    <option value="qwen3-30b-a3b" className="bg-[#14141e]">Qwen3 30B</option>
                    <option value="qwen-turbo" className="bg-[#14141e]">Qwen Turbo</option>
                    <option value="command-r7b" className="bg-[#14141e]">Command R7B</option>
                    <option value="command-r-plus" className="bg-[#14141e]">Command R+</option>
                    <option value="command-a" className="bg-[#14141e]">Command A</option>
                    <option value="grok-3" className="bg-[#14141e]">Grok 3</option>
                    <option value="grok-3-mini" className="bg-[#14141e]">Grok 3 Mini</option>
                    <option value="grok-2" className="bg-[#14141e]">Grok 2</option>
                    <option value="reka-core" className="bg-[#14141e]">Reka Core</option>
                    <option value="reka-flash" className="bg-[#14141e]">Reka Flash</option>
                  </optgroup>
                </select>
                <p className="text-xs text-white/30 mt-1.5">Pilih model AI — ketersediaan tergantung provider Sumopod</p>
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
