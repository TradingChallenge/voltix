import { useState } from 'react'
import { supabase } from './lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
  emailRedirectTo: window.location.origin,
  data: {
    referral_code: new URLSearchParams(
      window.location.search
    ).get('ref')?.trim().toUpperCase() || null
  }
}
        })

        if (error) throw error
        setMessage('Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error
        setMessage('Welcome to VOLTIX!')
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <nav className="top-nav">
        <a className="brand" href="#">
          VOLTI<span>X</span>
        </a>
        <span className="nav-status">
          <i /> THE FUTURE IS OPEN
        </span>
      </nav>

      <section className="auth-layout">
        <div className="auth-showcase">
          <div className="eyebrow">
            <span className="sparkle">✦</span> A NEW DIGITAL EXPERIENCE
          </div>

          <h1>
            CONNECT.
            <br />
            <span>GROW.</span>
            <br />
            GO BEYOND.
          </h1>

          <p className="showcase-text">
            Discover a new way to connect, complete missions
            and grow with the VOLTIX community.
          </p>

          <div className="showcase-stats">
            <div>
              <strong>01</strong>
              <span>Connect</span>
            </div>
            <div>
              <strong>02</strong>
              <span>Complete</span>
            </div>
            <div>
              <strong>03</strong>
              <span>Level Up</span>
            </div>
          </div>

          <div className="glow-orb" />
        </div>

        <div className="auth-panel">
          <div className="panel-icon">✦</div>

          <span className="panel-label">WELCOME TO VOLTIX</span>

          <h2>
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>

          <p className="panel-description">
            {mode === 'signup'
              ? 'Join the community. Your journey starts here.'
              : 'Sign in to continue your journey.'}
          </p>

          <form onSubmit={handleSubmit}>
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading
                ? 'PLEASE WAIT...'
                : mode === 'signup'
                  ? 'CREATE ACCOUNT →'
                  : 'SIGN IN →'}
            </button>
          </form>

          {message && <div className="auth-message">{message}</div>}

          <div className="auth-switch">
            {mode === 'signup'
              ? 'Already have an account?'
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup')
                setMessage('')
              }}
            >
              {mode === 'signup' ? 'Sign in' : 'Create account'}
            </button>
          </div>

          <div className="secure-note">
            <span>⌑</span> SECURE ACCESS · VOLTIX
          </div>
        </div>
      </section>

      <footer className="auth-footer">
        <span>© 2026 VOLTIX</span>
        <span>ENERGY OF THE FUTURE.</span>
      </footer>
    </main>
  )
}
