import { useEffect, useState } from 'react'
import type { RiskColor } from '../../types'

const CFG: Record<RiskColor, { text: string; ring: string; bg: string; glow: string }> = {
  GREEN:  { text: '#034b1d', ring: '#034c1e', bg: 'rgba(34,197,94,0.08)',  glow: '0 0 32px rgba(34,197,94,0.2)'  },
  ORANGE: { text: '#f97316', ring: '#f97316', bg: 'rgba(249,115,22,0.08)', glow: '0 0 32px rgba(249,115,22,0.2)' },
  RED:    { text: '#ef4444', ring: '#ef4444', bg: 'rgba(239,68,68,0.08)',  glow: '0 0 32px rgba(239,68,68,0.2)'  },
}

interface Props {
  color: RiskColor
  score: number
  labelRw: string
  labelEn: string
  lang: string
}

export default function RiskBadge({ color, score, labelRw, labelEn, lang }: Props) {
  const [displayed, setDisplayed] = useState(0)
  const c = CFG[color]
  const label = lang === 'rw' ? labelRw : labelEn

  // Animate counter up
  useEffect(() => {
    setDisplayed(0)
    const step = score / 40
    let cur = 0
    const t = setInterval(() => {
      cur = Math.min(score, cur + step)
      setDisplayed(Math.round(cur))
      if (cur >= score) clearInterval(t)
    }, 25)
    return () => clearInterval(t)
  }, [score])

  const size = 110
  const cx = size / 2
  const r = 44
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - displayed / 100)

  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.ring}40`,
      borderRadius: 20,
      padding: 20,
      textAlign: 'center',
      boxShadow: c.glow,
    }}>
      {/* SVG circle progress */}
      <div style={{ position: 'relative', width: size, height: size, margin: '0 auto 12px' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
          <circle cx={cx} cy={cx} r={r} fill="none"
            stroke={c.ring} strokeWidth={6}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 6px ${c.ring})` }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)', textAlign: 'center',
        }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: c.text, lineHeight: 1 }}>{displayed}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>/100</div>
        </div>
      </div>
      {/* Label */}
      <div style={{
        display: 'inline-flex', padding: '4px 16px', borderRadius: 999,
        background: c.bg, border: `1px solid ${c.ring}40`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: c.text, letterSpacing: '0.04em' }}>
          {label}
        </span>
      </div>
    </div>
  )
}