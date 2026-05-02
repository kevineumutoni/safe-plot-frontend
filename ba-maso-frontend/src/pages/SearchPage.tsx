import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDistricts, getSectors, getCells, getVillages, checkRisk } from '../api/client'
import { useAppStore } from '../store/useAppStore'
import NavBar from '../components/ui/NavBar'
import BaMasoLoader from '../components/ui/Loader'

const DISTRICT_COORDS: Record<string,[number,number]> = {
  Gasabo:      [-1.9200, 30.0850],
  Kicukiro:   [-1.9800, 30.0900],
  Nyarugenge: [-1.9530, 30.0520],
}

export default function SearchPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language as 'rw'|'en'
  const { sessionToken, setCurrentResult, saveToHistory } = useAppStore()

  const [district, setDistrict] = useState('')
  const [sector,   setSector]   = useState('')
  const [cell,     setCell]     = useState('')
  const [village,  setVillage]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  // Each query is enabled only when its parent is selected
  const { data: districts=[], isLoading: dLoading } = useQuery({
    queryKey:['districts'],
    queryFn: getDistricts,
    staleTime: 10*60*1000,
  })

  const { data: sectors=[], isLoading: sLoading } = useQuery({
    queryKey:['sectors', district],
    queryFn: ()=>getSectors(district),
    enabled: district.length > 0,
    staleTime: 10*60*1000,
  })

  const { data: cells=[], isLoading: cLoading } = useQuery({
    queryKey:['cells', district, sector],
    queryFn: ()=>getCells(district, sector),
    enabled: district.length > 0 && sector.length > 0,
    staleTime: 10*60*1000,
  })

  const { data: villages=[], isLoading: vLoading } = useQuery({
    queryKey:['villages', district, sector, cell],
    queryFn: ()=>getVillages(district, sector, cell),
    enabled: district.length > 0 && sector.length > 0 && cell.length > 0,
    staleTime: 10*60*1000,
  })

  const handleCheck = async () => {
    if(!district) { setError(lang==='rw'?'Hitamo akarere mbere':'Please select a district first'); return }
    setError(''); setLoading(true)
    try {
      const [lat,lng] = DISTRICT_COORDS[district]??[-1.9441,30.0619]
      const result = await checkRisk({ latitude:lat, longitude:lng, district, sector, cell, village, session_token:sessionToken })
      setCurrentResult(result); saveToHistory(result)
      navigate('/results')
    } catch(e:any) {
      setError(e?.response?.data?.detail??(lang==='rw'?'Ikibazo cyabaye':'Check failed. Is backend running?'))
    } finally { setLoading(false) }
  }

  // Shared select styles using CSS variables — works in both light and dark
  const selStyle: React.CSSProperties = {
    width:'100%', padding:'12px 36px 12px 14px', borderRadius:12,
    background:'var(--input-bg)',
    border:'1px solid var(--input-border)',
    color:'var(--text)',
    fontSize:13, outline:'none',
    fontFamily:"'Sora',sans-serif",
    cursor:'pointer',
    appearance:'none', WebkitAppearance:'none',
    transition:'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    fontSize:9, color:'var(--green,#2a9d5c)', fontWeight:700,
    letterSpacing:'0.12em', textTransform:'uppercase' as const, marginBottom:6,
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <NavBar showBack />

      <div style={{ flex:1, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'32px 20px' }}>
        <div style={{ width:'100%', maxWidth:440, display:'flex', flexDirection:'column', gap:20 }}>

          <div>
            <h1 style={{ fontSize:22, fontWeight:800, margin:'0 0 6px', color:'var(--text)', letterSpacing:'-0.02em' }}>
              {t('manual_entry')}
            </h1>
            <p style={{ fontSize:12, color:'var(--text-faint)', margin:0 }}>{t('advisory')}</p>
          </div>

          {/* District */}
          <div>
            <div style={labelStyle}>{t('select_district')}</div>
            <div style={{ position:'relative' }}>
              <select
                value={district}
                onChange={e=>{ setDistrict(e.target.value); setSector(''); setCell(''); setVillage('') }}
                style={selStyle}
                onFocus={e=>(e.target.style.borderColor='var(--green,#2a9d5c)')}
                onBlur={e=>(e.target.style.borderColor='var(--input-border)')}
              >
                <option value="">{dLoading?'Loading...':t('select_district')}</option>
                {districts.map(d=>(
                  <option key={d} value={d} style={{ background:'var(--bg2,#0f1510)', color:'var(--text,#e8f5ee)' }}>{d}</option>
                ))}
              </select>
              <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--text-faint)', fontSize:10 }}>▼</span>
            </div>
          </div>

          {/* Sector — only shown when district selected */}
          {district && (
            <div>
              <div style={labelStyle}>{t('select_sector')}</div>
              <div style={{ position:'relative' }}>
                <select
                  value={sector}
                  onChange={e=>{ setSector(e.target.value); setCell(''); setVillage('') }}
                  style={selStyle}
                  onFocus={e=>(e.target.style.borderColor='var(--green,#2a9d5c)')}
                  onBlur={e=>(e.target.style.borderColor='var(--input-border)')}
                >
                  <option value="">{sLoading?'Loading...':t('select_sector')}</option>
                  {sectors.map(s=>(
                    <option key={s} value={s} style={{ background:'var(--bg2,#0f1510)', color:'var(--text,#e8f5ee)' }}>{s}</option>
                  ))}
                </select>
                <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--text-faint)', fontSize:10 }}>▼</span>
              </div>
            </div>
          )}

          {/* Cell — only shown when sector selected */}
          {district && sector && (
            <div>
              <div style={labelStyle}>{t('select_cell')}</div>
              <div style={{ position:'relative' }}>
                <select
                  value={cell}
                  onChange={e=>{ setCell(e.target.value); setVillage('') }}
                  style={selStyle}
                  onFocus={e=>(e.target.style.borderColor='var(--green,#2a9d5c)')}
                  onBlur={e=>(e.target.style.borderColor='var(--input-border)')}
                >
                  <option value="">{cLoading?'Loading...':t('select_cell')}</option>
                  {cells.map(c=>(
                    <option key={c} value={c} style={{ background:'var(--bg2,#0f1510)', color:'var(--text,#e8f5ee)' }}>{c}</option>
                  ))}
                </select>
                <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--text-faint)', fontSize:10 }}>▼</span>
              </div>
            </div>
          )}

          {/* Village — only shown when cell selected */}
          {district && sector && cell && (
            <div>
              <div style={labelStyle}>{t('select_village')}</div>
              <div style={{ position:'relative' }}>
                <select
                  value={village}
                  onChange={e=>setVillage(e.target.value)}
                  style={selStyle}
                  onFocus={e=>(e.target.style.borderColor='var(--green,#2a9d5c)')}
                  onBlur={e=>(e.target.style.borderColor='var(--input-border)')}
                >
                  <option value="">{vLoading?'Loading...':t('select_village')}</option>
                  {villages.map(v=>(
                    <option key={v} value={v} style={{ background:'var(--bg2,#0f1510)', color:'var(--text,#e8f5ee)' }}>{v}</option>
                  ))}
                </select>
                <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--text-faint)', fontSize:10 }}>▼</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:12, padding:'10px 14px' }}>
              <span style={{ fontSize:13, color:'#ef4444' }}>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleCheck}
            disabled={!district||loading}
            style={{
              height:52, borderRadius:14, border:'none',
              background: !district||loading ? 'rgba(42,157,92,0.25)' : 'var(--green,#2a9d5c)',
              color:'white', fontSize:14, fontWeight:700,
              cursor: !district||loading ? 'not-allowed' : 'pointer',
              fontFamily:"'Sora',sans-serif",
              display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              transition:'all 0.2s',
            }}
          >
            {loading ? <><BaMasoLoader size={22} /> {t('checking')}</> : t('check_button')}
          </button>

          <p style={{ fontSize:11, color:'var(--text-faint)', textAlign:'center', margin:0 }}>
            {t('advisory')}
          </p>
        </div>
      </div>
    </div>
  )
}