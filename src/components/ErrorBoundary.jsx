import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white p-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-cyan-500/20">
            TB
          </div>
          <h1 className="text-xl font-bold mb-2">Upss, Ada Error</h1>
          <p className="text-white/40 text-sm mb-6 text-center max-w-sm">
            Maaf, terjadi kesalahan. Coba refresh halaman atau kembali.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="aurora-btn px-6 py-2.5 font-bold text-sm cursor-pointer"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }) }}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm border border-white/10 transition-all cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
          {this.state.error && (
            <details className="mt-6 text-xs text-white/20 max-w-md">
              <summary className="cursor-pointer">Detail Error</summary>
              <pre className="mt-2 p-3 bg-white/[0.03] rounded-lg overflow-auto text-[10px]">
                {this.state.error?.message}
              </pre>
            </details>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
