import { useEffect, useRef, useState } from 'react'
import { supabase } from './lib/supabase'

export default function TapDashboard({ session, logout }) {
  const [points, setPoints] = useState(0)
  const [energy, setEnergy] = useState(1000)
  const [boost, setBoost] = useState(1)
  const [tapEffect, setTapEffect] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tapping, setTapping] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const [message, setMessage] = useState('')
  const [referralCode, setReferralCode] = useState('')
const [referralCount, setReferralCount] = useState(0)
const [referralRewards, setReferralRewards] = useState(0)

  const tapLock = useRef(false)
  const maxEnergy = 1000

  const upgradeCosts = {
    1: 1000,
    2: 10000,
    3: 50000,
    4: 250000
}

  useEffect(() => {
    let active = true

    async function loadPlayer() {
      const { data, error } = await supabase.rpc(
        'get_player_state'
      )

      if (!active) return

      if (error) {
        setMessage('Could not load player data. Please refresh.')
      } else if (data) {
        setPoints(Number(data.points))
        setEnergy(Number(data.energy))
        setBoost(Number(data.boost))
      }

      setLoading(false)
    }

    loadPlayer()    
          async function loadReferral() {
        const { data, error } = await supabase.rpc('get_referral_stats')

        if (active && !error && data) {
          setReferralCode(data.referral_code || '')
          setReferralCount(Number(data.referral_count || 0))
          setReferralRewards(Number(data.total_rewards || 0))
        }
      }

      loadPlayer()
      loadReferral()

      return () => {
        active = false
      }
    return () => {
      active = false
    }
  }, [])

  async function handleTap() {
    if (tapLock.current || energy < 1 || loading) return

    tapLock.current = true
    setTapping(true)
    setMessage('')

    try {
      const { data, error } = await supabase.rpc('register_tap')

      if (error) throw error
      if (!data) throw new Error('Invalid server response')

      setPoints(Number(data.points))
      setEnergy(Number(data.energy))
      setBoost(Number(data.boost))

      setTapEffect(true)
      setTimeout(() => setTapEffect(false), 120)

    } catch (error) {
      setMessage(error.message || 'Tap failed. Try again.')
    } finally {
      tapLock.current = false
      setTapping(false)
    }
  }

  async function handleUpgrade() {
    if (upgrading || loading || boost >= 5) return

    setUpgrading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.rpc('upgrade_boost')

      if (error) throw error
      if (!data) throw new Error('Invalid server response')

      setPoints(Number(data.points))
      setBoost(Number(data.boost))

      setMessage(`Boost upgraded successfully! Cost: ${data.cost} PTS`)

    } catch (error) {
      setMessage(error.message || 'Upgrade failed.')
    } finally {
      setUpgrading(false)
    }
  }

  return (
    <main className="tap-dashboard">
      <nav className="tap-nav">
        <a className="brand" href="#">
          VOLTI<span>X</span>
        </a>

        <button className="nav-cta" onClick={logout}>
          LOG OUT ↗
        </button>
      </nav>

      <section className="tap-content">
        <div className="tap-welcome">
          <span className="eyebrow">VOLTIX CLICK-TO-EARN</span>
          <h1>WELCOME BACK</h1>
          <p>{session.user.email}</p>
        </div>

        <div className="tap-points">
          <span>YOUR TOTAL POINTS</span>
          <strong>
            {points.toLocaleString('en-US')} <small>PTS</small>
          </strong>
        </div>

        <div className="tap-arena">
          <span className="tap-label">TAP TO EARN</span>

          <button
            className={`tap-button ${tapEffect ? 'tap-active' : ''}`}
            onClick={handleTap}
            disabled={energy < 1 || loading || tapping}
          >
            <span className="tap-symbol">V</span>
            <span className="tap-brand">VOLTIX</span>
          </button>

          <p>+{boost} POINT{boost > 1 ? 'S' : ''} PER TAP</p>
        </div>

        {message && (
          <p role="alert">{message}</p>
        )}

        <div className="energy-card">
          <div className="energy-heading">
            <span>⚡ ENERGY</span>
            <strong>{energy} / {maxEnergy}</strong>
          </div>

          <div className="energy-track">
            <div
              className="energy-fill"
              style={{
                width: `${(energy / maxEnergy) * 100}%`
              }}
            />
          </div>

          <p>Energy recharges automatically.</p>
        </div>

        <div className="boost-card">
          <div>
            <span className="eyebrow">UPGRADE</span>
            <h2>TAP BOOST</h2>
            <p>Increase your points per tap.</p>
          </div>

          <div className="boost-info">
            <strong>x{boost}</strong>

            <button
              onClick={handleUpgrade}
              disabled={loading || upgrading || boost >= 5}
            >
              {upgrading
                ? 'UPGRADING...'
                : boost >= 5
                  ? 'MAX LEVEL'
                  : `UPGRADE · ${upgradeCosts[boost]} PTS`}
            </button>
          </div>
        </div>
                <div className="referral-card">
          <div>
            <span className="eyebrow">VOLTIX REFERRAL</span>
            <h2>INVITE FRIENDS</h2>
            <p>Invite friends and earn bonus points.</p>
          </div>

          <div className="referral-code">
            <span>{referralCode || 'LOADING...'}</span>
            <button
              disabled={!referralCode}
              onClick={async () => {
                const link = `${window.location.origin}/?ref=${encodeURIComponent(referralCode)}`
                try {
                  await navigator.clipboard.writeText(link)
                  setMessage('Referral link copied!')
                } catch {
                  setMessage('Copy failed. Please copy the link manually.')
                }
              }}
            >
              COPY LINK
            </button>
          </div>

          <div className="referral-stats">
            <div>
              <span>CONFIRMED INVITES</span>
              <strong>{referralCount}</strong>
            </div>
            <div>
              <span>TOTAL REWARDS</span>
              <strong>{referralRewards.toLocaleString('en-US')} PTS</strong>
            </div>
          </div>

          <p className="referral-note">
            1 invite: 200 PTS · 5 invites: +3,000 PTS · 10 invites: +10,000 PTS
          </p>
        </div>
        <div className="tap-footer">
          <span>VOLTIX ECOSYSTEM</span>
          <span>POWER YOUR PROGRESS.</span>
        </div>
      </section>
    </main>
  )
}
