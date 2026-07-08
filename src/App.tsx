import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Starz Cosmic Oracle</h1>
        <p className="tagline">Celestial insights await...</p>
      </header>

      <main className="app-main">
        <div className="card">
          <p>Welcome to your cosmic journey.</p>
          <button onClick={() => setCount((c) => c + 1)}>
            Stars aligned: {count}
          </button>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with React + TypeScript + Vite</p>
      </footer>
    </div>
  )
}

export default App
