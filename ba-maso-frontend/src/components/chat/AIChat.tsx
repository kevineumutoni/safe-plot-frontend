import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { chatWithAI } from '../../api/client'
import type { ChatMessage } from '../../types'
import BaMasoLoader from '../ui/Loader'

const PRE_PROMPTS = {
  rw: [
    "Kigali Master Plan 2050 bivuga iki kandi birakora bite?",
    "Ubutaka bwizewe bwo kubaka inzu bugaragazwa bite?",
    "Ni iki gishobora guterwa no kubaka hafi y'inkukuma cyangwa amasiteri?",
    "Ngomba kuba kure uburebure bungahe y'inkukuma mbere yo kubaka inzu?",
  ],
  en: [
    "What does the Kigali Master Plan 2050 mean and how does it work?",
    "What does safe land for construction look like — key characteristics?",
    "What are the consequences of building near wetlands or swamps?",
    "How many meters must I stay away from a wetland before building?",
  ],
}

const HARDCODED: Record<string,{rw:string;en:string}> = {
  "0": {
    rw:`Kigali Master Plan 2050 ni gahunda y'ingenzi y'igenamigambi ryateguwe na Umujyi wa Kigali kugira ngo ugenzure iterambere ry'umujyi kugeza mu 2050.

Iyi gahunda igabanya Kigali mu turere dutandukanye:
🔴 Zone y'inkukuma (WB) — Nta bwubatsi bwemewe. Irinzwe na REMA na Law No. 04/2005. Kubaka aho gusenya inzu nta nishingura.
🟠 Zone y'ubuhinzi (AG) — Ubuhinzi gusa. Nta nzu zemewe.
🟢 Zone y'amazu R1/R2 — Yemewe kubaka inzu kugeza ku floors 2-4.
🔵 Zone ivanze (MU) — Ubucuruzi n'amazu, bisabwa EIA mbere.

Iby'ingenzi:
- Kubaka mu zone ifite uburinzi bishobora guteza gusenya inzu yawe nta nishingura
- Inondation mu zone y'inkukuma zibaho buri mwaka
- Amategeko y'u Rwanda asaba impushya y'ubwubatsi mbere yo gutangira kubaka

✅ Inama: Mbere yo kugura ubutaka, baza RLMUA umenye zone y'ubutaka bwawe.`,
    en:`The Kigali Master Plan 2050 is a comprehensive urban planning framework developed by the City of Kigali to guide how the city grows until 2050.

It divides Kigali into distinct zones:
🔴 Wetland Buffer Zones (WB) — No construction permitted. Protected under REMA and Rwanda Environment Law No. 04/2005.
🟠 Agricultural Zones (AG) — Farming only, no residential construction allowed.
🟢 Residential Zones R1/R2 — Approved for houses up to 2-4 floors.
🔵 Mixed Use Zones (MU) — Commerce + housing, Environmental Impact Assessment required.

Critical facts:
- Building in a protected zone means forced demolition without compensation
- Flooding in wetland zones occurs every rainy season
- Rwanda law requires building permits before any construction starts

✅ Recommendation: Before buying any land, verify the zone at RLMUA (Rwanda Land Management and Use Authority).`,
  },
  "1": {
    rw:`Ubutaka bwizewe bwo kubaka inzu bufite ibimenyetso 5 by'ingenzi:

✅ 1. UBUREBURE — Hejuru ya metero 30+ kuruta ikibaya. Hejuru birinzwa inondation.

✅ 2. UBUSESEKARA BUTO — Munsi ya degire 15. Umusozi mwinshi (>30°) ufite inzitizi y'intobo.

✅ 3. KURE Y'INKUKUMA — Nibura metero 100 kuva ku nkukuma yose. Metero 200 ni byiza kuruta.

✅ 4. ZONE YEMEWE — Kigali Master Plan 2050 igomba kwerekana ubutaka bwawe mu zone R1 cyangwa R2.

✅ 5. IBIKORWA REMEZO — Inzira, amazi meza, n'amashanyarazi biraboneka.

📍 Ahantu heza muri Kigali:
- Gisozi — hejuru, nta nkukuma, R2
- Kimironko Hill — umusozi mwiza, nta nzitizi
- Kanombe Plateau — ikibaya cyo hejuru, hafi ya ndege
- Bumbogo y'Amajyaruguru — igiciro gito, heza, irakura`,
    en:`Safe land for construction in Kigali has 5 key characteristics:

✅ 1. ELEVATION — More than 30m above the valley floor. Height naturally protects from flooding.

✅ 2. GENTLE SLOPE — Less than 15 degrees. Very steep slopes (>30°) carry landslide risk during heavy rain.

✅ 3. DISTANCE FROM WETLANDS — At least 100m from any protected wetland. 200m is strongly recommended.

✅ 4. APPROVED ZONE — Kigali Master Plan 2050 must show your land as R1 or R2 (Residential Zone).

✅ 5. INFRASTRUCTURE IN PLACE — Roads, clean water, and electricity already connected.

📍 Recommended safe areas in Kigali:
- Gisozi — elevated, no wetlands, R2 zone
- Kimironko Hill — good hillside position, no flood risk
- Kanombe Plateau — flat elevated terrain, near airport
- Northern Bumbogo — affordable, safe, growing infrastructure`,
  },
  "2": {
    rw:`Kubaka hafi y'inkukuma cyangwa amasiteri biterwa n'ingaruka 5 nkuru:

🌊 1. INONDATION ZICA INZU
Inkukuma n'amasiteri yuzura mu gihe cy'imvura. Amazi atemba n'ingufu arasenya inzu cyangwa ayigira idasobanurika. Ibi bibaho buri mwaka muri Nyabugogo, Gikondo n'ahandi. Nta yemwe ubilindira.

⚠️ 2. GUSENYA NTA NISHINGURA
Kigali irimo gukurikiza Master Plan 2050. Niba inzu yawe iri mu zone ifite uburinzi, leta irashobora kugusaba gusenya nta nishingura. Kuva 2015, ibi byakurikiye imiryango ibihumbi muri Kigali.

💰 3. GUTA AMAFARANGA YOSE
Iyo leta igusezererye mu butaka burinzwe, ntushobora guhabwa igiciro. Ntabwo wagombaga kwubakaho.

🦟 4. INDWARA
Amasiteri n'inkukuma biterwa inzuki z'Imalaria, Cholera n'izindi ndwara z'amazi. Izo ndwara zirwanya umuryango wose.

📋 5. AMATEGEKO N'INZITIZI ZA LETA
Kubaka hafi y'inkukuma ni ibyaha mu Rwanda munsi ya Law No. 04/2005. Ushobora guhanwa n'amafaranga cyangwa ngo ujugunywe mu nzu y'imbohe.`,
    en:`Building near wetlands or swamps causes 5 serious consequences:

🌊 1. FLOODING DESTROYS YOUR HOME
Wetlands and swamps overflow during rainy season. Water flows with force, frequently destroying structures or making them uninhabitable. This happens every year in Nyabugogo, Gikondo and other valley areas. No insurance covers this.

⚠️ 2. FORCED DEMOLITION WITHOUT COMPENSATION
Kigali is actively enforcing Master Plan 2050. If your home is in a protected zone, the government can legally order demolition without paying you anything. Since 2015, thousands of Kigali families have experienced this.

💰 3. TOTAL LOSS OF YOUR INVESTMENT
When relocated from protected land, you cannot claim the land's value because you were never legally permitted to build there.

🦟 4. DISEASE RISK
Wetlands and swamps breed mosquitoes causing Malaria, Cholera and other water-borne diseases that affect the whole family.

📋 5. CRIMINAL PROSECUTION
Building near wetlands violates Rwanda Environment Law No. 04/2005. This is a criminal offence punishable by fines and imprisonment.`,
  },
  "3": {
    rw:`Amategeko y'u Rwanda ahateganya intera z'ingenzi zo kubaka:

📏 INKUKUMA (Wetlands):
- Metero 100 — intera nto cyane yemewe n'amategeko
- Metero 200 — ibisabwa n'abazobere mu iterambere ryizewe
- Igihe cy'imvura nyinshi: amazi ashobora kuzamura metero 50+ inyuma y'inkukuma

📏 INZUZI NINI (Nyabugogo, Nyabarongo, izindi):
- Metero 50 nibura kuva ku ruzi runini

📏 INZUZI NITO:
- Metero 30 nibura

🏭 INGANDA (Industries):
- Zone y'inganda yagufi (Light): metero 100+
- Inganda nini cyangwa z'imiti (Heavy/Chemical): metero 500+

⚡ AMASHANYARAZI MANINI (High Voltage):
- Metero 30 nibura

🔑 INAMA Y'INGENZI:
Saba REMA cyangwa RLMUA icyemezo cy'imipaka y'ubutaka bwawe mbere yo gutanga amafaranga yose. Iyo nyandiko imwe ikurinda ingorane zose za amategeko mu gihe kizaza.`,
    en:`Rwanda law and international standards set these minimum building distances:

📏 WETLANDS:
- 100 metres — absolute legal minimum under Rwanda law
- 200 metres — recommended by responsible developers
- During heavy rain: water can surge 50+ metres beyond the visible wetland edge

📏 MAJOR RIVERS (Nyabugogo, Nyabarongo, others):
- Minimum 50 metres from the riverbank

📏 SMALLER STREAMS:
- Minimum 30 metres

🏭 INDUSTRIAL AREAS:
- Light industrial zones: 100m minimum
- Heavy or chemical industries: 500m or more

⚡ HIGH-VOLTAGE POWER LINES:
- Minimum 30 metres

🔑 MOST IMPORTANT ADVICE:
Get an official boundary letter from REMA or RLMUA confirming your specific land status before making any payment. This single document protects you from all future legal disputes and is your most important protection.`,
  },
}

export default function AIChat() {
  const { chatMessages, addChatMessage, currentResult, language } = useAppStore()
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const lang = language as 'rw'|'en'

  // Greeting on mount
  useEffect(()=>{
    if(chatMessages.length===0) {
      addChatMessage({
        role:'ai',
        text_rw:"Muraho! Ndi Ba Maso. Mbaza ikibazo cyose ku butaka muri Kigali. Kanda ikibazo cyanditswe hepfo cyangwa andika icyo ushaka kumenya.",
        text_en:"Hello! I am Ba Maso. Ask me anything about land safety in Kigali. Click a suggested question below or type your own.",
        timestamp:new Date().toISOString(),
      })
    }
  },[])

  useEffect(()=>{ bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [chatMessages, loading])

  const handlePrePrompt = async (idx:number) => {
    const prompts = PRE_PROMPTS[lang]
    const q = prompts[idx]
    addChatMessage({ role:'user', text_rw:q, text_en:q, timestamp:new Date().toISOString() })
    setLoading(true)
    await new Promise(r=>setTimeout(r,2000))
    setLoading(false)
    const ans = HARDCODED[String(idx)]
    if(ans) {
      addChatMessage({ role:'ai', text_rw:ans.rw, text_en:ans.en, timestamp:new Date().toISOString() })
    }
  }

  const send = async () => {
    const msg = input.trim()
    if(!msg||loading) return
    setInput('')
    addChatMessage({ role:'user', text_rw:msg, text_en:msg, timestamp:new Date().toISOString() })
    setLoading(true)
    try {
      const ctx = currentResult ? {
        risk_score:  currentResult.risk_score,
        risk_color:  currentResult.risk_color,
        district:    currentResult.district,
        sector:      currentResult.sector,
        factors:     currentResult.factors.map(f=>({ name:f.name, score:f.score })),
        flood_level: currentResult.flood_alert.alert_level,
      } : undefined
      const reply = await chatWithAI(msg, ctx)
      addChatMessage({ role:'ai', text_rw:reply.reply_rw, text_en:reply.reply_en, timestamp:new Date().toISOString() })
    } catch {
      // Fallback when Gemini quota is exhausted
      addChatMessage({
        role:'ai',
        text_rw: lang==='rw'
          ? 'Serivisi ya AI ifite ikibazo ubu. Gerageza nyuma gato, cyangwa kanda ikibazo cyanditswe hepfo.'
          : 'AI service is temporarily unavailable. Please try again shortly, or click a suggested question below.',
        text_en:'AI service temporarily unavailable. Try a suggested question below.',
        timestamp:new Date().toISOString(),
      })
    } finally { setLoading(false) }
  }

  const showSuggestions = chatMessages.length <= 1

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'var(--bg2,#0f1510)' }}>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 14px', display:'flex', flexDirection:'column', gap:10 }}>
        {chatMessages.map((msg,i)=>{
          const isAI = msg.role==='ai'
          const text = lang==='rw' ? msg.text_rw : msg.text_en
          return (
            <div key={i} style={{ display:'flex', justifyContent:isAI?'flex-start':'flex-end' }}>
              <div style={{
                maxWidth:'88%',
                background: isAI ? 'var(--bg-card,rgba(255,255,255,0.04))' : 'rgba(42,157,92,0.15)',
                border:`1px solid ${isAI?'var(--border,rgba(255,255,255,0.08))':'rgba(42,157,92,0.3)'}`,
                borderRadius:isAI?'4px 14px 14px 14px':'14px 4px 14px 14px',
                padding:'10px 14px',
              }}>
                {isAI && (
                  <div style={{ fontSize:9, fontWeight:700, color:'var(--green,#2a9d5c)', marginBottom:4, letterSpacing:'0.1em', fontFamily:"'JetBrains Mono',monospace" }}>
                    BA MASO AI
                  </div>
                )}
                <p style={{ fontSize:13, color:'var(--text,#e8f5ee)', lineHeight:1.7, margin:0, whiteSpace:'pre-wrap' }}>{text}</p>
                <div style={{ fontSize:9, color:'var(--text-faint,rgba(232,245,238,0.2))', marginTop:4 }}>
                  {new Date(msg.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                </div>
              </div>
            </div>
          )
        })}

        {/* Pre-prompt suggestions */}
        {showSuggestions && !loading && (
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
            <div style={{ fontSize:9, color:'var(--text-faint,rgba(232,245,238,0.3))', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:2 }}>
              {lang==='rw'?'Ibibazo bisanzwe:':'Suggested questions:'}
            </div>
            {PRE_PROMPTS[lang].map((q,i)=>(
              <button key={i} onClick={()=>handlePrePrompt(i)} style={{
                background:'var(--bg-card,rgba(255,255,255,0.03))',
                border:'1px solid var(--border-g,rgba(42,157,92,0.2))',
                borderRadius:10, padding:'8px 12px', cursor:'pointer',
                color:'var(--text-dim,rgba(232,245,238,0.7))',
                fontSize:12, textAlign:'left', lineHeight:1.5,
                fontFamily:"'Sora',sans-serif", transition:'all 0.15s',
              }}
              onMouseEnter={e=>{ const b=e.currentTarget; b.style.background='rgba(42,157,92,0.08)'; b.style.borderColor='rgba(42,157,92,0.4)'; b.style.color='var(--text,#e8f5ee)' }}
              onMouseLeave={e=>{ const b=e.currentTarget; b.style.background='var(--bg-card,rgba(255,255,255,0.03))'; b.style.borderColor='var(--border-g,rgba(42,157,92,0.2))'; b.style.color='var(--text-dim,rgba(232,245,238,0.7))' }}
              >
                <span style={{ color:'var(--green,#2a9d5c)', fontWeight:700, marginRight:6 }}>{i+1}.</span>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display:'flex', justifyContent:'flex-start' }}>
            <div style={{
              background:'var(--bg-card,rgba(255,255,255,0.04))',
              border:'1px solid rgba(42,157,92,0.2)',
              borderRadius:'4px 14px 14px 14px',
              padding:'12px 16px', display:'flex', alignItems:'center', gap:10,
            }}>
              <BaMasoLoader size={28} />
              <span style={{ fontSize:11, color:'var(--green,#2a9d5c)', fontWeight:600 }}>
                {lang==='rw'?'AI iratekereza...':'AI is thinking...'}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding:'10px 14px', borderTop:'1px solid var(--border,rgba(255,255,255,0.06))', display:'flex', gap:8, background:'var(--bg2,#0f1510)' }}>
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder={lang==='rw'?'Nshobora kubaka inzu hano?':'Can I build a house here?'}
          style={{
            flex:1,
            background:'var(--input-bg,rgba(255,255,255,0.04))',
            border:'1px solid var(--input-border,rgba(255,255,255,0.09))',
            borderRadius:10, padding:'8px 14px',
            color:'var(--text,#e8f5ee)', fontSize:13, outline:'none',
            fontFamily:"'Sora',sans-serif", transition:'border-color 0.2s',
          }}
          onFocus={e=>(e.target.style.borderColor='var(--green,#2a9d5c)')}
          onBlur={e=>(e.target.style.borderColor='var(--input-border,rgba(255,255,255,0.09))')}
        />
        <button onClick={send} disabled={loading||!input.trim()} style={{
          width:38, height:38, flexShrink:0,
          background:loading||!input.trim()?'rgba(42,157,92,0.25)':'var(--green,#2a9d5c)',
          border:'none', borderRadius:10,
          cursor:loading||!input.trim()?'not-allowed':'pointer',
          color:'white', fontSize:16,
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all 0.15s',
        }}>↑</button>
      </div>
    </div>
  )
}