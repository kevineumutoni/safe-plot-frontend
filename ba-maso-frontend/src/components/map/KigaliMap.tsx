import { useState, useCallback, useEffect, useRef } from 'react'
import {
  MapContainer, Marker, ZoomControl, useMapEvents, useMap,
} from 'react-leaflet'
import L from 'leaflet'
import { useAppStore } from '../../store/useAppStore'
import { checkRisk } from '../../api/client'
import BaMasoLoader from '../ui/Loader'
import SearchBar from './SearchBar'
import RiskZoneOverlay from './RiskZoneOverlay'
import DemoMarkers from './DemoMarkers'

// Fix default icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const KIGALI_CENTER: [number,number] = [-1.9441, 30.0619]
const KIGALI_BOUNDS: [[number,number],[number,number]] = [[-2.1,29.9],[-1.8,30.2]]

const PLACE_LABELS = [
  { n:'Kimironko',  rw:'Kimironko',  lat:-1.9350, lng:30.1100 },
  { n:'Remera',     rw:'Remera',     lat:-1.9490, lng:30.1050 },
  { n:'Kacyiru',    rw:'Kacyiru',    lat:-1.9300, lng:30.0650 },
  { n:'Nyamirambo', rw:'Nyamirambo', lat:-1.9700, lng:30.0380 },
  { n:'Gisozi',     rw:'Gisozi',     lat:-1.9180, lng:30.0740 },
  { n:'Kicukiro',   rw:'Kicukiro',   lat:-1.9800, lng:30.0900 },
  { n:'Nyabugogo',  rw:'Nyabugogo',  lat:-1.9550, lng:30.0480 },
  { n:'Gikondo',    rw:'Gikondo',    lat:-1.9750, lng:30.0700 },
  { n:'Kanombe',    rw:'Kanombe',    lat:-1.9620, lng:30.1350 },
  { n:'Kimisagara', rw:'Kimisagara', lat:-1.9600, lng:30.0420 },
  { n:'Muhima',     rw:'Muhima',     lat:-1.9510, lng:30.0560 },
  { n:'Kagarama',   rw:'Kagarama',   lat:-1.9720, lng:30.0780 },
  { n:'Jabana',     rw:'Jabana',     lat:-1.8900, lng:30.0900 },
  { n:'Niboye',     rw:'Niboye',     lat:-1.9900, lng:30.0750 },
  { n:'Masaka',     rw:'Masaka',     lat:-2.0000, lng:30.1200 },
  { n:'Bumbogo',    rw:'Bumbogo',    lat:-1.8700, lng:30.0800 },
]

const makePin = (color:string) => L.divIcon({
  className:'',
  html:`<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:${color};border:2.5px solid white;transform:rotate(-45deg);box-shadow:0 3px 12px ${color}90;"></div>`,
  iconSize:[22,22], iconAnchor:[11,22],
})

const makeLabel = (name:string) => L.divIcon({
  className:'',
  html:`<div style="background:rgba(11,15,12,0.82);color:rgba(232,245,238,0.9);padding:2px 8px;border-radius:8px;font-size:10px;font-weight:700;white-space:nowrap;border:1px solid rgba(42,157,92,0.2);backdrop-filter:blur(6px);pointer-events:none;font-family:'Sora',sans-serif;">${name}</div>`,
  iconSize:[120,22], iconAnchor:[60,11],
})

const makeSearchPin = () => L.divIcon({
  className:'',
  html:`<div style="display:flex;flex-direction:column;align-items:center"><div style="width:16px;height:16px;border-radius:50%;background:#2a9d5c;border:2.5px solid white;box-shadow:0 0 12px #2a9d5c;"></div><div style="width:2px;height:10px;background:#2a9d5c;margin-top:-1px"></div></div>`,
  iconSize:[16,26], iconAnchor:[8,26],
})

// Custom layer control to fix the satellite ↔ map switching
function CustomLayerControl() {
  const map = useMap()
  // DEFAULT TO MAP (not satellite)
  const [active, setActive] = useState<'satellite'|'map'>('map')
  const satRef = useRef<L.TileLayer|null>(null)
  const mapRef = useRef<L.TileLayer|null>(null)

  useEffect(() => {
    // Create satellite layer (Stadia) but DON'T add it by default
    satRef.current = L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg',
      { maxZoom:20, attribution:'© Stadia Maps' }
    )

    // Create map layer (OSM) and ADD IT by default
    mapRef.current = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom:19, attribution:'© OpenStreetMap' }
    ).addTo(map)

    return () => {
      satRef.current?.remove()
      mapRef.current?.remove()
    }
  }, [map])

  const switchTo = (type:'satellite'|'map') => {
    if (type === 'satellite') {
      mapRef.current?.remove()
      if (satRef.current) satRef.current.addTo(map)
    } else {
      satRef.current?.remove()
      if (mapRef.current) mapRef.current.addTo(map)
    }
    setActive(type)
  }

  return (
    <div style={{
      position:'absolute', top:12, right:12, zIndex:1000,
      display:'flex', gap:4,
      background:'var(--bg-glass,rgba(11,15,12,0.88))',
      border:'1px solid var(--border,rgba(255,255,255,0.1))',
      borderRadius:10, padding:4,
      backdropFilter:'blur(8px)',
    }}>
      {(['satellite','map'] as const).map(type => (
        <button key={type} onClick={()=>switchTo(type)} style={{
          padding:'5px 10px', borderRadius:7, border:'none', cursor:'pointer',
          background: active===type ? 'var(--green,#2a9d5c)' : 'transparent',
          color: active===type ? 'white' : 'var(--text-dim,rgba(232,245,238,0.5))',
          fontSize:11, fontWeight:700, fontFamily:"'Sora',sans-serif",
          transition:'all 0.15s',
        }}>
          {type==='satellite' ? '🛰 Satellite' : '🗺 Map'}
        </button>
      ))}
    </div>
  )
}

function FlyTo({ target }: { target:[number,number]|null }) {
  const map = useMap()
  useEffect(()=>{ if(target) map.flyTo(target, 16, { duration:1.2 }) }, [target, map])
  return null
}

function ClickHandler({ onSelect }:{ onSelect:(lat:number,lng:number)=>void }) {
  useMapEvents({ click: e => onSelect(e.latlng.lat, e.latlng.lng) })
  return null
}

interface Props {
  lang: string
  onResultReady: ()=>void
  onClose?: ()=>void
  hasResult: boolean
  onSelectCoords?: (lat:number,lng:number)=>void
}

export default function KigaliMap({ lang, onResultReady, onClose, hasResult }: Props) {
  const { setCurrentResult, saveToHistory, sessionToken } = useAppStore()
  const [pin,       setPin]       = useState<[number,number]|null>(null)
  const [pinColor,  setPinColor]  = useState('#f97316')
  const [searching, setSearching] = useState<[number,number]|null>(null)
  const [flyTarget, setFlyTarget] = useState<[number,number]|null>(null)
  const [checking,  setChecking]  = useState(false)
  const [count,     setCount]     = useState(0)
  const [error,     setError]     = useState('')

  // Auto-dismiss error after 4s
  useEffect(()=>{
    if(!error) return
    const t = setTimeout(()=>setError(''), 4000)
    return ()=>clearTimeout(t)
  }, [error])

  const handleSelect = useCallback(async (lat:number, lng:number) => {
    // Client-side bounds check
    if (lat<-2.1||lat>-1.8||lng<30.0||lng>30.2) {
      setError(lang==='rw'
        ? 'Aho hantu ntabwo hari muri Kigali. Hitamo ahantu muri Kigali gusa.'
        : 'Outside Kigali City boundaries. Please click within Kigali.')
      return
    }
    setPin([lat,lng])
    setPinColor('#f97316')
    setSearching(null)
    setError('')
    setChecking(true)
    try {
      const result = await checkRisk({ latitude:lat, longitude:lng, session_token:sessionToken })
      setCurrentResult(result)
      saveToHistory(result)
      setPinColor(result.risk_color==='GREEN'?'#22c55e':result.risk_color==='RED'?'#ef4444':'#f97316')
      setCount(c=>c+1)
      onResultReady()
    } catch(e:any) {
      const d = e?.response?.data
      if(d?.detail==='out_of_kigali'||e?.response?.status===422) {
        setError(lang==='rw'?(d?.message_rw??'Aho hantu ntabwo hari muri Kigali.'):(d?.message_en??'Outside Kigali.'))
        setPin(null)
      } else {
        setError(d?.detail??(lang==='rw'?'Ikibazo cyabaye. Backend irateganye?':'Check failed — is backend running?'))
      }
      setPinColor('#6b7280')
    } finally {
      setChecking(false)
    }
  }, [sessionToken, setCurrentResult, saveToHistory, onResultReady, lang])

  const handleSearchSelect = useCallback((place:{lat:number;lng:number;name:string;rw:string}) => {
    const pos:[number,number] = [place.lat, place.lng]
    setSearching(pos)
    setFlyTarget(pos)
    setTimeout(()=>handleSelect(place.lat, place.lng), 1300)
  }, [handleSelect])

  return (
    <div style={{ position:'relative', height:'100%', width:'100%' }}>

      {/* Search bar - top left, stops before the layer toggle */}
      <div style={{
        position:'absolute', top:12, left:12,
        right: hasResult&&onClose ? 200 : 160,
        zIndex:1000,
      }}>
        <SearchBar lang={lang} onSelect={handleSearchSelect} />
      </div>

      {/* Close/back button - only when panel is open */}
      {hasResult && onClose && (
        <button
          onClick={onClose}
          title={lang==='rw'?'Subira ku makarita':'Back to map'}
          style={{
            position:'absolute', bottom:120, right:12, zIndex:1001,
            width:40, height:40, borderRadius:'50%',
            background:'#1a7a42',
            border:'2px solid white',
            color:'white', fontSize:20, fontWeight:700,
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 4px 16px rgba(0,0,0,0.5)',
            transition:'all 0.2s',
          }}
          onMouseEnter={e=>(e.currentTarget.style.background='#0f6235')}
          onMouseLeave={e=>(e.currentTarget.style.background='#1a7a42')}
        >←</button>
      )}

      <MapContainer
        center={KIGALI_CENTER} zoom={13}
        maxBounds={KIGALI_BOUNDS} maxBoundsViscosity={0.85}
        style={{ height:'100%', width:'100%', background:'#0b0f0c' }}
        zoomControl={false} attributionControl
      >
        <ZoomControl position="bottomright" />
        <CustomLayerControl />
        <RiskZoneOverlay />
        <DemoMarkers lang={lang} onDemoClick={handleSelect} />

        {/* Place name labels */}
        {PLACE_LABELS.map(p=>(
          <Marker key={`${p.n}-${p.lat}`} position={[p.lat,p.lng]}
            icon={makeLabel(lang==='rw'?p.rw:p.n)}
            interactive={false} zIndexOffset={-1000} />
        ))}

        {/* Search pin */}
        {searching && <Marker position={searching} icon={makeSearchPin()} />}

        {/* Clicked / checked pin */}
        {pin && <Marker position={pin} icon={makePin(pinColor)} />}

        <FlyTo target={flyTarget} />
        <ClickHandler onSelect={handleSelect} />
      </MapContainer>

      {/* Loading overlay */}
      {checking && (
        <div style={{
          position:'absolute', inset:0, zIndex:1000,
          background:'rgba(11,15,12,0.75)', backdropFilter:'blur(4px)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <BaMasoLoader size={80} label={lang==='rw'?'Tureba umutekano...':'Scanning land safety...'} />
        </div>
      )}

      {/* Error toast */}
      {error && !checking && (
        <div style={{
          position:'absolute', bottom:64, left:'50%', transform:'translateX(-50%)',
          background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.5)',
          borderRadius:12, padding:'9px 18px', zIndex:999, whiteSpace:'nowrap',
          boxShadow:'0 4px 16px rgba(0,0,0,0.4)',
        }}>
          <span style={{ fontSize:12, color:'#ef4444', fontWeight:600 }}>{error}</span>
        </div>
      )}

      {/* Legend - bottom left */}
      <div style={{
        position:'absolute', bottom:52, left:12, zIndex:999,
        background:'var(--bg-glass,rgba(11,15,12,0.88))',
        backdropFilter:'blur(8px)',
        border:'1px solid var(--border,rgba(255,255,255,0.08))',
        borderRadius:10, padding:'8px 12px',
        display:'flex', flexDirection:'column', gap:5,
      }}>
        {[
          { bg:'rgba(239,68,68,0.5)',  bd:'#ef4444', label:lang==='rw'?'Inzitizi Nini':'High Risk Zone' },
          { bg:'rgba(249,115,22,0.4)', bd:'#f97316', label:lang==='rw'?'Witondere':'Caution Zone'       },
          { bg:'rgba(34,197,94,0.35)', bd:'#22c55e', label:lang==='rw'?'Ahantu Heza':'Safe Zone'         },
        ].map(({ bg,bd,label })=>(
          <div key={label} style={{ display:'flex', alignItems:'center', gap:7 }}>
            <div style={{ width:12, height:12, borderRadius:3, background:bg, border:`1px solid ${bd}`, flexShrink:0 }} />
            <span style={{ fontSize:10, color:'var(--text-dim,rgba(232,245,238,0.6))', fontWeight:600 }}>{label}</span>
          </div>
        ))}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', marginTop:2, paddingTop:4 }}>
          <span style={{ fontSize:9, color:'var(--text-faint,rgba(232,245,238,0.3))', fontWeight:600 }}>
            {lang==='rw'?'📍 Kanda pin ry\'itukura':'📍 Click red/orange pins'}
          </span>
        </div>
      </div>

      {/* Bottom pill */}
      <div style={{
        position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)',
        background:'var(--bg-glass,rgba(11,15,12,0.82))', backdropFilter:'blur(8px)',
        border:'1px solid rgba(42,157,92,0.15)', borderRadius:999,
        padding:'6px 20px', zIndex:999, whiteSpace:'nowrap',
      }}>
        <span style={{ fontSize:11, color:'var(--text-faint,rgba(232,245,238,0.45))', letterSpacing:'0.04em' }}>
          {count===0
            ?(lang==='rw'?'👆 Kanda ahantu cyangwa shakisha hejuru':'👆 Click map or search above')
            :`✓ ${count} ${lang==='rw'?'ahantu hasuzumwe':`location${count>1?'s':''} checked`}`}
        </span>
      </div>
    </div>
  )
}
