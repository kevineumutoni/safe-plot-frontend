import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import KigaliMap from '../components/map/KigaliMap'
import ResultPanel from '../components/map/ResultPanel'
import NavBar from '../components/ui/NavBar'
import MapChatWidget from '../components/chat/MapChatWidget'
import { useAppStore } from '../store/useAppStore'

export default function MapPage() {
  const { i18n } = useTranslation()
  const { currentResult } = useAppStore()
  const lang = i18n.language as 'rw'|'en'
  const [showPanel,       setShowPanel]       = useState(false)
  const [showMobileSheet, setShowMobileSheet] = useState(false)

  const handleResultReady = useCallback(()=>{
    setShowPanel(true)
    setShowMobileSheet(true)
  },[])

  const handleClose = useCallback(()=>{
    setShowPanel(false)
    setShowMobileSheet(false)
  },[])

  return (
    <div style={{ height:'100vh', background:'var(--bg,#0b0f0c)', display:'flex', flexDirection:'column' }}>
      <NavBar />

      <div style={{ flex:1, display:'flex', overflow:'hidden', position:'relative' }}>

        {/* Map container — full width always */}
        <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
          <KigaliMap
            lang={lang}
            onResultReady={handleResultReady}
            onClose={showPanel&&!!currentResult ? handleClose : undefined}
            hasResult={showPanel && !!currentResult}
          />
          {/* Map chat widget sits INSIDE the map div for correct positioning */}
          <MapChatWidget lang={lang} />
        </div>

        {/* Desktop sidebar — slides in from right */}
        {showPanel && currentResult && (
          <div
            className="desktop-panel"
            style={{
              width:370, flexShrink:0,
              background:'var(--bg2,#0f1510)',
              borderLeft:'1px solid var(--border,rgba(255,255,255,0.06))',
              display:'none', flexDirection:'column', position:'relative',
              overflow:'hidden',
            }}
          >
            {/* Close button — clearly visible green circle */}
            <button
              onClick={handleClose}
              title={lang==='rw'?'Funga — subira ku makarita':'Close — back to map'}
              style={{
                position:'absolute', top:10, right:10, zIndex:20,
                width:30, height:30, borderRadius:'50%',
                background:'#1a7a42',
                border:'2px solid rgba(255,255,255,0.3)',
                color:'white', fontSize:16, fontWeight:700,
                cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 2px 8px rgba(0,0,0,0.4)',
                transition:'all 0.15s',
              }}
              onMouseEnter={e=>(e.currentTarget.style.background='#ef4444')}
              onMouseLeave={e=>(e.currentTarget.style.background='#1a7a42')}
            >×</button>
            <ResultPanel lang={lang} />
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      {showMobileSheet && currentResult && (
        <div style={{
          position:'fixed', bottom:0, left:0, right:0,
          height:'65vh',
          background:'var(--sheet-bg,rgba(11,15,12,0.98))',
          borderTop:'1px solid var(--border,rgba(255,255,255,0.08))',
          borderRadius:'20px 20px 0 0',
          zIndex:900, overflow:'hidden',
          display:'flex', flexDirection:'column',
        }}>
          {/* Handle + close row */}
          <div style={{
            display:'flex', justifyContent:'center', alignItems:'center',
            padding:'10px 16px 4px', flexShrink:0, position:'relative',
          }}>
            <div style={{ width:36, height:3, borderRadius:999, background:'rgba(255,255,255,0.15)' }} />
            {/* Mobile close button — green, always visible */}
            <button
              onClick={handleClose}
              style={{
                position:'absolute', right:16,
                width:32, height:32, borderRadius:'50%',
                background:'#1a7a42',
                border:'2px solid rgba(255,255,255,0.3)',
                color:'white', fontSize:16, fontWeight:700,
                cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 2px 8px rgba(0,0,0,0.4)',
              }}
            >×</button>
          </div>
          <div style={{ flex:1, overflow:'hidden' }}>
            <ResultPanel lang={lang} />
          </div>
        </div>
      )}

      <style>{`@media(min-width:1024px){.desktop-panel{display:flex!important}}`}</style>
    </div>
  )
}