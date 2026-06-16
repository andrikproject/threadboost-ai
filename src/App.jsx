import { useState, useEffect } from 'react'
import { auth, provider, db } from './firebase'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { callSumopod, callSumopodJSON } from './api'
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
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (e) {
      console.error(e)
    }
  }

  const logout = async () => {
    await signOut(auth)
    setPage('landing')
  }

  const saveApiKey = (key, model) => {
    setApiKey(key)
    setApiModel(model)
    localStorage.setItem('sumopod_api_key', key)
    localStorage.setItem('sumopod_model', model)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user && page === 'landing') {
    return <LandingPage onLogin={login} onEnter={() => setPage('landing')} />
  }

  if (!user) {
    return <LandingPage onLogin={login} onEnter={() => setPage('landing')} />
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
