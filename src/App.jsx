import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Auth from './Auth'
import TapDashboard from './TapDashboard'
import './TapDashboard.css'
const features = [
  {
    number: '01',
    title: 'BUILD YOUR PRESENCE',
    description: 'Create your identity and establish your place in a new digital community.',
    icon: '◈',
  },
  {
    number: '02',
    title: 'COMPLETE MISSIONS',
    description: 'Discover opportunities, complete missions and collect experience points.',
    icon: '✳',
  },
  {
    number: '03',
    title: 'RISE THROUGH LEVELS',
    description: 'Grow your profile, unlock achievements and make your progress visible.',
    icon: '↗',
  },
]

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (!error) setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="loading-screen">VOLTIX<span>.</span></div>
  }

  if (!session) return <Landing />

  return <Dashboard session={session} logout={logout} />
}

function Landing() {
  const [showAuth, setShowAuth] = useState(false)

  if (showAuth) return <Auth />

  return (
    <main className="landing">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-overlay" />

      <nav className="top-nav">
        <a className="brand" href="#">
          VOLTI<span>X</span>
        </a>

        <div className="nav-links">
          <a href="#about">ABOUT</a>
          <a href="#features">FEATURES</a>
          <a href="#experience">EXPERIENCE</a>
        </div>

        <button className="nav-cta" onClick={() => setShowAuth(true)}>
          GET STARTED <span>↗</span>
        </button>
      </nav>

      <section className="hero" id="about">
        <div className="hero-content">
          <div className="status-label">
            <span className="status-dot" />
            A NEW DIGITAL EXPERIENCE
          </div>

          <h1>
            YOUR WORLD.
            <br />
            <span>YOUR ENERGY.</span>
          </h1>

          <p className="hero-description">
            Connect with a new generation of digital experiences.
            Build your presence, complete missions and grow with VOLTIX.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => setShowAuth(true)}
            >
              ENTER VOLTIX <span>↗</span>
            </button>

            <a className="secondary-link" href="#features">
              EXPLORE THE PLATFORM <span>↓</span>
            </a>
          </div>

          <div className="hero-note">
            <span>✳</span> BUILT FOR THE NEXT GENERATION
          </div>
        </div>

        <div className="hero-art" id="experience">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />

          <div className="core-glow" />

          <div className="core">
            <div className="core-inner">
              <span>V</span>
              <small>VOLTIX</small>
            </div>
          </div>

          <div className="floating-card card-top">
            <span className="mini-icon">✳</span>
            <div>
              <strong>NEW ERA</strong>
              <small>IS LOADING</small>
            </div>
          </div>

          <div className="floating-card card-bottom">
            <span className="mini-icon cyan">↗</span>
            <div>
              <strong>LEVEL UP</strong>
              <small>YOUR PRESENCE</small>
            </div>
          </div>

          <div className="art-caption">EST. 2026 / DIGITAL FRONTIER</div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE VOLTIX ECOSYSTEM</span>
            <h2>MORE THAN A PLATFORM<span>.</span></h2>
          </div>

          <p>
            A space where your digital presence becomes
            an opportunity to grow.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <div className="feature-top">
                <span>{feature.number} / 03</span>
                <span className="feature-icon">{feature.icon}</span>
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="feature-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <span className="eyebrow">THE FUTURE IS YOURS</span>
        <h2>READY TO ENTER?</h2>
        <button
          className="primary-button"
          onClick={() => setShowAuth(true)}
        >
          CREATE YOUR ACCOUNT <span>↗</span>
        </button>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#">VOLTI<span>X</span></a>
        <span>© 2026 VOLTIX. ALL RIGHTS RESERVED.</span>
        <span>ENERGY OF THE FUTURE.</span>
      </footer>
    </main>
  )
}

function Dashboard({ session, logout }) {
  return <TapDashboard session={session} logout={logout} />
}
