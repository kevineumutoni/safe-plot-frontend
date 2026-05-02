import { useState, useEffect, useRef } from 'react'
import BaMasoLoader from '../ui/Loader'

const QA = {
  rw: [
    {
      q: 'Kigali Master Plan 2050 ni iki?',
      a: `Kigali Master Plan 2050 ni gahunda y'iterambere ry'umujyi wa Kigali kugeza mu 2050. Igabanya Kigali mu turere dutandukanye:

🔴 Zone y'inkukuma (WB) — Nta bwubatsi bwemewe. Irinzwe na REMA.
🟠 Zone y'ubuhinzi (AG) — Ubuhinzi gusa, nta nzu.
🟢 Zone y'amazu (R1/R2) — Yemewe kubaka floors 2–4.

⚠️ Kubaka mu zone ifite uburinzi bishobora gutera:
- Gusenya inzu nta nishingura
- Inzitizi za amategeko

✅ Inama: Baza RLMUA mbere yo kugura ubutaka.`,
    },
    {
      q: 'Ubutaka bwizewe bugaragazwa bite?',
      a: `Ubutaka bwizewe bufite ibimenyetso 5:

✅ 1. UBUREBURE — Hejuru ya metero 30+ kuruta ikibaya
✅ 2. UBUSESEKARA BUTO — Munsi ya degire 15
✅ 3. KURE Y'INKUKUMA — Nibura metero 100
✅ 4. ZONE YEMEWE — R1 cyangwa R2 ya Master Plan 2050
✅ 5. IBIKORWA REMEZO — Inzira, amazi, amashanyarazi

📍 Ahantu heza muri Kigali:
- Gisozi · Kimironko Hill · Kanombe Plateau · Bumbogo`,
    },
    {
      q: "Ingaruka zo kubaka hafi y'inkukuma?",
      a: `Ingaruka nkuru 5:

🌊 1. INONDATION — Amazi atemba arasenya inzu buri mwaka muri Nyabugogo na Gikondo.
⚠️ 2. GUSENYA NTA NISHINGURA — Leta irashobora gusenya inzu yawe nta bihembo.
💰 3. GUTA AMAFARANGA — Nta bihembo kubera ntabwo wagombaga kubaka aho.
🦟 4. INDWARA — Imalaria, Cholera n'izindi ndwara z'amazi.
📋 5. AMATEGEKO — Ibyaha munsi ya Law No. 04/2005.`,
    },
    {
      q: "Intera y'inkukuma nishyiraho?",
      a: `Amategeko y'u Rwanda:

📏 Inkukuma — metero 100 nibura (metero 200 ni byiza)
📏 Inzuzi nini — metero 50 nibura
📏 Inzuzi nto — metero 30 nibura
🏭 Inganda — metero 100–500
⚡ Amashanyarazi manini — metero 30

🔑 Baza REMA/RLMUA icyemezo cy'imipaka mbere yo gutanga amafaranga.`,
    },
  ],
  en: [
    {
      q: 'What is the Kigali Master Plan 2050?',
      a: `The Kigali Master Plan 2050 guides city development until 2050. It divides Kigali into zones:

🔴 Wetland Buffer (WB) — No construction. Protected under REMA Law No. 04/2005.
🟠 Agricultural (AG) — Farming only, no housing.
🟢 Residential (R1/R2) — Approved for 2–4 floor buildings.

⚠️ Building in a protected zone risks:
- Forced demolition without compensation
- Criminal prosecution

✅ Always verify the zone at RLMUA before any payment.`,
    },
    {
      q: 'What does safe construction land look like?',
      a: `Safe land has 5 key characteristics:

✅ 1. ELEVATION — More than 30m above the valley floor
✅ 2. GENTLE SLOPE — Less than 15 degrees
✅ 3. WETLAND DISTANCE — At least 100m from any wetland
✅ 4. APPROVED ZONE — R1 or R2 in Master Plan 2050
✅ 5. INFRASTRUCTURE — Roads, water, electricity in place

📍 Safe areas in Kigali:
- Gisozi · Kimironko Hill · Kanombe Plateau · Northern Bumbogo`,
    },
    {
      q: 'Consequences of building near wetlands?',
      a: `5 serious consequences:

🌊 1. FLOODING — Water destroys homes every rainy season in Nyabugogo & Gikondo.
⚠️ 2. FORCED DEMOLITION — Government can demolish without compensation.
💰 3. TOTAL LOSS — No payment because you had no right to build there.
🦟 4. DISEASE — Malaria, Cholera and water-borne illness for the family.
📋 5. CRIMINAL OFFENCE — Violates Rwanda Environment Law No. 04/2005.`,
    },
    {
      q: 'How far from a wetland must I build?',
      a: `Rwanda law requires:

📏 Wetlands — minimum 100m (200m recommended)
📏 Major rivers — minimum 50m
📏 Small streams — minimum 30m
🏭 Industrial areas — 100–500m depending on type
⚡ High-voltage lines — minimum 30m

🔑 Get an official boundary letter from REMA or RLMUA before making any payment — your most important legal protection.`,
    },
  ],
}

interface Props { lang: string }

export default function MapChatWidget({ lang }: Props) {
  const [open,    setOpen]    = useState(false)
  const [msgs,    setMsgs]    = useState<{ role: 'user' | 'ai'; text: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [badge,   setBadge]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const qs = QA[lang as 'rw' | 'en'] ?? QA.en

  // Show attention badge after 3 s
  useEffect(() => {
    const t = setTimeout(() => setBadge(true), 3000)
    return () => clearTimeout(t)
  }, [])

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  const greet = () => {
    if (msgs.length === 0) {
      setMsgs([{
        role: 'ai',
        text: lang === 'rw'
          ? '👋 Muraho! Ndi Ba Maso. Kanda ikibazo hepfo kugira ngo ubone igisubizo cyihuse.'
          : '👋 Hello! I am Ba Maso. Click a question below for an instant expert answer.',
      }])
    }
  }

  const handleQ = async (qa: { q: string; a: string }) => {
    if (loading) return
    setMsgs(m => [...m, { role: 'user', text: qa.q }])
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setMsgs(m => [...m, { role: 'ai', text: qa.a }])
  }

  const toggle = () => {
    if (!open) greet()
    setOpen(o => !o)
    setBadge(false)
  }

  return (
    <div style={{ position: 'absolute', bottom: 52, right: 12, zIndex: 1100 }}>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'absolute', bottom: 64, right: 0,
          width: 310, maxHeight: 440,
          display: 'flex', flexDirection: 'column',
          background: '#0f1510',
          border: '1px solid rgba(34,197,94,0.35)',
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(0,0,0,0.75)',
        }}>

          {/* Header */}
          <div style={{
            padding: '11px 14px', flexShrink: 0,
            background: '#141c15',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#e8f5ee', fontFamily: "'Sora',sans-serif" }}>Ba Maso AI</span>
              <span style={{ fontSize: 9, color: 'rgba(232,245,238,0.4)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.06em' }}>LIVE</span>
            </div>
            <button onClick={toggle} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(232,245,238,0.4)', fontSize: 20, lineHeight: 1, fontFamily: 'inherit' }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 6px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'ai' ? 'flex-start' : 'flex-end' }}>
                <div style={{
                  maxWidth: '92%',
                  background: m.role === 'ai' ? 'rgba(255,255,255,0.04)' : 'rgba(34,197,94,0.15)',
                  border: `1px solid ${m.role === 'ai' ? 'rgba(255,255,255,0.07)' : 'rgba(34,197,94,0.3)'}`,
                  borderRadius: m.role === 'ai' ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                  padding: '8px 11px',
                }}>
                  {m.role === 'ai' && (
                    <div style={{ fontSize: 8, fontWeight: 700, color: '#22c55e', marginBottom: 3, letterSpacing: '0.1em', fontFamily: "'JetBrains Mono',monospace" }}>
                      BA MASO AI
                    </div>
                  )}
                  <p style={{ fontSize: 12, color: '#e8f5ee', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap', fontFamily: "'Sora',sans-serif" }}>
                    {m.text}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: '4px 12px 12px 12px',
                  padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <BaMasoLoader size={22} />
                  <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, fontFamily: "'Sora',sans-serif" }}>
                    {lang === 'rw' ? 'Iratekereza...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Pre-prompt buttons */}
          <div style={{
            padding: '8px 10px 12px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: '#0f1510',
            display: 'flex', flexDirection: 'column', gap: 5,
          }}>
            <div style={{ fontSize: 9, color: 'rgba(232,245,238,0.3)', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 2, fontFamily: "'Sora',sans-serif" }}>
              {lang === 'rw' ? 'Ibibazo bisanzwe:' : 'Quick questions:'}
            </div>
            {qs.map((qa, i) => (
              <button
                key={i}
                onClick={() => handleQ(qa)}
                disabled={loading}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(34,197,94,0.18)',
                  borderRadius: 8, padding: '7px 10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  color: 'rgba(232,245,238,0.7)',
                  fontSize: 11, textAlign: 'left', lineHeight: 1.45,
                  fontFamily: "'Sora',sans-serif",
                  opacity: loading ? 0.5 : 1, transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    const b = e.currentTarget
                    b.style.background = 'rgba(34,197,94,0.1)'
                    b.style.color = '#e8f5ee'
                    b.style.borderColor = 'rgba(34,197,94,0.45)'
                  }
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget
                  b.style.background = 'rgba(255,255,255,0.03)'
                  b.style.color = 'rgba(232,245,238,0.7)'
                  b.style.borderColor = 'rgba(34,197,94,0.18)'
                }}
              >
                <span style={{ color: '#22c55e', fontWeight: 800, marginRight: 5 }}>{i + 1}.</span>
                {qa.q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── The white chat bubble button ── */}
      <button
        onClick={toggle}
        title={lang === 'rw' ? 'Baza AI' : 'Ask AI'}
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: open ? '#22c55e' : 'white',
          border: open ? '2px solid rgba(34,197,94,0.4)' : '2px solid rgba(34,197,94,0.3)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open
            ? '0 4px 20px rgba(34,197,94,0.45)'
            : '0 4px 20px rgba(0,0,0,0.6)',
          transition: 'all 0.2s',
          position: 'relative',
          fontSize: 22,
        }}
      >
        {/* Chat icon SVG — shows white on open (green bg), green on closed (white bg) */}
        {open ? (
          <span style={{ color: 'white', fontSize: 22, fontWeight: 900, lineHeight: 1 }}>×</span>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
              fill="#22c55e"
            />
            <circle cx="8"  cy="10" r="1.2" fill="white" />
            <circle cx="12" cy="10" r="1.2" fill="white" />
            <circle cx="16" cy="10" r="1.2" fill="white" />
          </svg>
        )}

        {/* Notification dot */}
        {badge && !open && (
          <div style={{
            position: 'absolute', top: -2, right: -2,
            width: 16, height: 16, borderRadius: '50%',
            background: '#ef4444',
            border: '2.5px solid #0b0f0c',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, fontWeight: 900, color: 'white',
          }}>!</div>
        )}
      </button>
    </div>
  )
}