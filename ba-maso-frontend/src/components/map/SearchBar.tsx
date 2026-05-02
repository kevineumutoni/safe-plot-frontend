import { useState, useRef, useEffect } from 'react'

// All known Kigali places with coordinates
const KIGALI_PLACES = [
  { name: 'Bumbogo',      rw: 'Bumbogo',           lat: -1.8700, lng: 30.0800, district: 'Gasabo' },
  { name: 'Gisozi',       rw: 'Gisozi',            lat: -1.9200, lng: 30.0750, district: 'Gasabo' },
  { name: 'Jabana',       rw: 'Jabana',            lat: -1.8900, lng: 30.0900, district: 'Gasabo' },
  { name: 'Jali',         rw: 'Jali',              lat: -1.9050, lng: 30.1100, district: 'Gasabo' },
  { name: 'Kacyiru',      rw: 'Kacyiru',           lat: -1.9300, lng: 30.0650, district: 'Gasabo' },
  { name: 'Kimihurura',   rw: 'Kimihurura',        lat: -1.9370, lng: 30.0780, district: 'Gasabo' },
  { name: 'Kimironko',    rw: 'Kimironko',         lat: -1.9350, lng: 30.1100, district: 'Gasabo' },
  { name: 'Kinyinya',     rw: 'Kinyinya',          lat: -1.9100, lng: 30.1200, district: 'Gasabo' },
  { name: 'Ndera',        rw: 'Ndera',             lat: -1.9100, lng: 30.1300, district: 'Gasabo' },
  { name: 'Nduba',        rw: 'Nduba',             lat: -1.8800, lng: 30.0600, district: 'Gasabo' },
  { name: 'Remera',       rw: 'Remera',            lat: -1.9490, lng: 30.1050, district: 'Gasabo' },
  { name: 'Rusororo',     rw: 'Rusororo',          lat: -1.8950, lng: 30.1000, district: 'Gasabo' },
  { name: 'Rutunga',      rw: 'Rutunga',           lat: -1.8850, lng: 30.0950, district: 'Gasabo' },
  { name: 'Gahanga',      rw: 'Gahanga',           lat: -1.9900, lng: 30.1100, district: 'Kicukiro' },
  { name: 'Gatenga',      rw: 'Gatenga',           lat: -1.9850, lng: 30.0800, district: 'Kicukiro' },
  { name: 'Gikondo',      rw: 'Gikondo',           lat: -1.9750, lng: 30.0700, district: 'Kicukiro' },
  { name: 'Kagarama',     rw: 'Kagarama',          lat: -1.9720, lng: 30.0780, district: 'Kicukiro' },
  { name: 'Kanombe',      rw: 'Kanombe',           lat: -1.9620, lng: 30.1350, district: 'Kicukiro' },
  { name: 'Kicukiro',     rw: 'Kicukiro',          lat: -1.9800, lng: 30.0900, district: 'Kicukiro' },
  { name: 'Kigarama',     rw: 'Kigarama',          lat: -1.9950, lng: 30.0950, district: 'Kicukiro' },
  { name: 'Masaka',       rw: 'Masaka',            lat: -2.0000, lng: 30.1200, district: 'Kicukiro' },
  { name: 'Niboye',       rw: 'Niboye',            lat: -1.9900, lng: 30.0750, district: 'Kicukiro' },
  { name: 'Nyarugunga',   rw: 'Nyarugunga',        lat: -1.9850, lng: 30.1050, district: 'Kicukiro' },
  { name: 'Gitega',       rw: 'Gitega',            lat: -1.9470, lng: 30.0600, district: 'Nyarugenge' },
  { name: 'Kanyinya',     rw: 'Kanyinya',          lat: -1.9600, lng: 30.0300, district: 'Nyarugenge' },
  { name: 'Kimisagara',   rw: 'Kimisagara',        lat: -1.9600, lng: 30.0420, district: 'Nyarugenge' },
  { name: 'Mageragere',   rw: 'Mageragere',        lat: -1.9700, lng: 30.0250, district: 'Nyarugenge' },
  { name: 'Muhima',       rw: 'Muhima',            lat: -1.9510, lng: 30.0560, district: 'Nyarugenge' },
  { name: 'Nyabugogo',    rw: 'Nyabugogo',         lat: -1.9550, lng: 30.0480, district: 'Nyarugenge' },
  { name: 'Nyakabanda',   rw: 'Nyakabanda',        lat: -1.9630, lng: 30.0470, district: 'Nyarugenge' },
  { name: 'Nyamirambo',   rw: 'Nyamirambo',        lat: -1.9700, lng: 30.0380, district: 'Nyarugenge' },
  { name: 'Nyarugenge',   rw: 'Nyarugenge',        lat: -1.9500, lng: 30.0540, district: 'Nyarugenge' },
  { name: 'Rwezamenyo',   rw: 'Rwezamenyo',        lat: -1.9650, lng: 30.0520, district: 'Nyarugenge' },
  { name: 'Kigali Centre',rw: 'Umujyi wa Kigali',  lat: -1.9441, lng: 30.0619, district: 'Nyarugenge' },
]

interface Place { name: string; rw: string; lat: number; lng: number; district: string }
interface Props {
  lang: string
  onSelect: (place: Place) => void
}

export default function SearchBar({ lang, onSelect }: Props) {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<Place[]>([])
  const [focused, setFocused]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    const filtered = KIGALI_PLACES.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.rw.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q)
    ).slice(0, 6)
    setResults(filtered)
  }, [query])

  const handleSelect = (place: Place) => {
    setQuery(lang === 'rw' ? place.rw : place.name)
    setResults([])
    setFocused(false)
    onSelect(place)
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 340 }}>
      {/* Input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(11,15,12,0.92)', backdropFilter: 'blur(12px)',
        border: `1px solid ${focused ? 'rgba(42,157,92,0.5)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 12, padding: '8px 14px',
        transition: 'border-color 0.2s',
        boxShadow: focused ? '0 0 0 3px rgba(42,157,92,0.1)' : '0 4px 20px rgba(0,0,0,0.4)',
      }}>
        <span style={{ fontSize: 14, opacity: 0.5 }}>🔍</span>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={lang === 'rw' ? 'Shakisha ahantu... (Bumbogo, Remera...)' : 'Search a place... (Bumbogo, Remera...)'}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#e8f5ee', fontSize: 13, fontFamily: "'Sora', sans-serif",
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(232,245,238,0.3)', fontSize: 16, lineHeight: 1, padding: 0 }}
          >×</button>
        )}
      </div>

      {/* Results dropdown */}
      {results.length > 0 && focused && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
          background: 'rgba(11,15,12,0.97)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(42,157,92,0.2)', borderRadius: 12,
          overflow: 'hidden', zIndex: 2000,
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        }}>
          {results.map((place, i) => (
            <div
              key={place.name}
              onMouseDown={() => handleSelect(place)}
              style={{
                padding: '10px 14px', cursor: 'pointer',
                borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(42,157,92,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e8f5ee' }}>
                  {lang === 'rw' ? place.rw : place.name}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(232,245,238,0.35)', marginTop: 1 }}>
                  {place.district} · {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                </div>
              </div>
              <span style={{ fontSize: 10, color: '#2a9d5c', fontWeight: 700, marginLeft: 8 }}>→</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}