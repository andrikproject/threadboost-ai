import { useState, useEffect } from 'react'
import { auth, provider, firebaseReady, onAuthStateChanged, signInWithPopup, signOut } from './firebase'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('landing')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('sumopod_api_key') || '')
  const [apiModel, setApiModel] = useState(() => localStorage.getItem('sumopod_model') || 'gpt-4o-mini')

  useEffect(() => {
    if (!firebaseReady || !auth) {
      // Firebase not configured — langsung akses sebagai guest
      setLoading(false)
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

  const goToApp = () => {
    setPage('dashboard')
  }

  const guestUser = () => ({
    displayName: localStorage.getItem('threadboost_name') || 'Guest',
    email: 'guest@local',
    photoURL: null,
  })

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

  // Landing page
  if (page === 'landing' && !user) {
    return <LandingPage onLogin={login} onEnter={goToApp} />
  }

  // Guest mode (Firebase not configured)
  const activeUser = user || guestUser()

  if (page === 'settings') {
    return (
      <Settings
        user={activeUser}
        apiKey={apiKey}
        apiModel={apiModel}
        onSave={saveApiKey}
        onLogout={() => { setPage('landing') }}
        onBack={() => setPage('dashboard')}
      />
    )
  }

  return (
    <Dashboard
      user={activeUser}
      apiKey={apiKey}
      apiModel={apiModel}
      onLogout={() => { setPage('landing') }}
      onSettings={() => setPage('settings')}
    />
  )
}

export default App
