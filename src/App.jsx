import { useState, useEffect, useRef } from 'react'
import { auth, firebaseReady, onAuthStateChanged, signInWithPopup, signOut } from './firebase'
import { callSumopod } from './api'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('landing')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('sumopod_api_key') || '')
  const [apiModel, setApiModel] = useState(() => localStorage.getItem('sumopod_model') || 'gpt-4o-mini')
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    if (!firebaseReady || !auth) {
      setLoading(false)
      setDemoMode(true)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async () => {
    if (!firebaseReady || !auth) {
      alert('Firebase belum dikonfigurasi. Edit src/firebase.js dengan config Firebase kamu.')
      return
    }
    try {
      await signInWithPopup(auth, provider)
    } catch (e) {
      console.error(e)
      if (e.code === 'auth/api-key-not-valid') {
        alert('API Key Firebase tidak valid.')
      }
    }
  }

  const logout = async () => {
    if (signOut && auth) {
      await signOut(auth)
    }
    setPage('landing')
  }

  const enterDemo = () => {
    setDemoMode(true)
    setPage('dashboard')
  }

  const saveApiKey = (key, model) => {
    setApiKey(key)
    setApiModel(model)
    localStorage.setItem('sumopod_api_key', key)
    localStorage.setItem('sumopod_model', model)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/20 animate-pulse" />
        </div>
      </div>
    )
  }

  if (page === 'landing' && !user && !demoMode) {
    return <LandingPage onLogin={login} onEnter={enterDemo} isDemo={!firebaseReady} />
  }

  if (demoMode && !user) {
    if (page === 'settings') {
      return (
        <Settings
          user={{ displayName: 'Demo User', email: 'demo@local', photoURL: null }}
          apiKey={apiKey}
          apiModel={apiModel}
          onSave={saveApiKey}
          onLogout={() => { setDemoMode(false); setPage('landing') }}
          onBack={() => setPage('dashboard')}
          isDemo
        />
      )
    }
    return (
      <Dashboard
        user={{ displayName: 'Demo User', email: 'demo@local', photoURL: null }}
        apiKey={apiKey}
        apiModel={apiModel}
        onLogout={() => { setDemoMode(false); setPage('landing') }}
        onSettings={() => setPage('settings')}
        isDemo
      />
    )
  }

  if (page === 'settings') {
    return (
      <Settings
        user={user}
        apiKey={apiKey}
        apiModel={apiModel}
        onSave={saveApiKey}
        onLogout={logout}
        onBack={() => setPage('dashboard')}
      />
    )
  }

  return (
    <Dashboard
      user={user}
      apiKey={apiKey}
      apiModel={apiModel}
      onLogout={logout}
      onSettings={() => setPage('settings')}
    />
  )
}

export default App
