import { useState, useEffect } from 'react'
import { auth, provider, firebaseReady, onAuthStateChanged, signInWithPopup, signOut } from './firebase'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('landing')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('sumopod_api_key') || '')
  const [apiModel, setApiModel] = useState(() => localStorage.getItem('sumopod_model') || 'gpt-4o-mini')
  const [apiEndpoint, setApiEndpoint] = useState(() => localStorage.getItem('sumopod_endpoint') || 'https://ai.sumopod.com/v1')
  const [detectedModels, setDetectedModels] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sumopod_detected_models') || '[]') } catch { return [] }
  })

  useEffect(() => {
    if (!firebaseReady || !auth) {
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

  const goToApp = () => setPage('dashboard')

  const saveSettings = (key, model, endpoint, detected) => {
    setApiKey(key)
    setApiModel(model)
    setApiEndpoint(endpoint)
    if (detected) setDetectedModels(detected)
    localStorage.setItem('sumopod_api_key', key)
    localStorage.setItem('sumopod_model', model)
    localStorage.setItem('sumopod_endpoint', endpoint)
    if (detected) localStorage.setItem('sumopod_detected_models', JSON.stringify(detected))
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

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent
          user={user} page={page} setPage={setPage}
          login={login} logout={logout} goToApp={goToApp}
          apiKey={apiKey} apiModel={apiModel}
          apiEndpoint={apiEndpoint}
          detectedModels={detectedModels}
          saveSettings={saveSettings}
        />
      </ToastProvider>
    </ErrorBoundary>
  )
}

function AppContent({ user, page, setPage, login, logout, goToApp, apiKey, apiModel, apiEndpoint, detectedModels, saveSettings }) {
  if (page === 'landing' && !user) {
    return <LandingPage onLogin={login} onEnter={goToApp} />
  }

  const activeUser = user || {
    displayName: localStorage.getItem('threadboost_name') || 'Guest',
    email: 'guest@local',
    photoURL: null,
  }

  if (page === 'settings') {
    return (
      <Settings
        user={activeUser}
        apiKey={apiKey}
        apiModel={apiModel}
        apiEndpoint={apiEndpoint}
        detectedModels={detectedModels}
        onSave={saveSettings}
        onLogout={() => setPage('landing')}
        onBack={() => setPage('dashboard')}
      />
    )
  }

  return (
    <Dashboard
      user={activeUser}
      apiKey={apiKey}
      apiModel={apiModel}
      onLogout={() => setPage('landing')}
      onSettings={() => setPage('settings')}
    />
  )
}

export default App
