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
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-4 py-3 flex items-center justify-between max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-neutral-400 hover:text-white transition cursor-pointer">← Kembali</button>
          <h1 className="font-bold text-lg">Pengaturan</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Profile */}
        <section className="bg-neutral-900/50 rounded-2xl p-6 border border-white/5">
          <h2 className="font-bold text-sm text-neutral-400 uppercase tracking-wider mb-4">Akun</h2>
          <div className="flex items-center gap-4">
            <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-bold">{user.displayName}</p>
              <p className="text-sm text-neutral-500">{user.email}</p>
            </div>
          </div>
        </section>

        {/* API Settings */}
        <section className="bg-neutral-900/50 rounded-2xl p-6 border border-white/5">
          <h2 className="font-bold text-sm text-neutral-400 uppercase tracking-wider mb-4">AI Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1.5">API Endpoint</label>
              <div className="bg-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-400 font-mono">
                https://ai.sumopod.com/v1
              </div>
              <p className="text-xs text-neutral-600 mt-1">OpenAI-compatible endpoint — sudah diatur otomatis</p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5">API Key <span className="text-rose-500">*</span></label>
              <input
                type="password"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="sk-sumopod-xxxx..."
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition"
              />
              <p className="text-xs text-neutral-600 mt-1">Dapatkan API key dari dashboard Sumopod</p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5">Model</label>
              <select
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                <option value="gpt-4o-mini">GPT-4o-mini (Cepat & Hemat)</option>
                <option value="gpt-4o">GPT-4o (Paling Pintar)</option>
                <option value="gpt-4o-mini-search-preview">GPT-4o-mini Search</option>
                <option value="claude-sonnet-4">Claude Sonnet 4</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="deepseek-chat">DeepSeek V3</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl font-bold hover:scale-[1.02] transition cursor-pointer"
            >
              {saved ? '✓ Tersimpan!' : 'Simpan Pengaturan'}
            </button>
          </div>
        </section>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full py-3 border border-rose-500/30 text-rose-400 rounded-xl font-bold hover:bg-rose-500/10 transition cursor-pointer"
        >
          Keluar
        </button>
      </div>
    </div>
  )
}
