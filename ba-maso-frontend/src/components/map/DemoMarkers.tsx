import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

export const DEMO_PLACES = [
  { id:'nyabugogo_valley',  name:'Nyabugogo Valley',         name_rw:'Ikiyaga cya Nyabugogo',          lat:-1.9558, lng:30.0472, color:'#ef4444', risk:'RED'    },
  { id:'gikondo_marsh',     name:'Gikondo Industrial Marsh', name_rw:'Inkukuma ya Gikondo',            lat:-1.9748, lng:30.0695, color:'#ef4444', risk:'RED'    },
  { id:'nyamirambo_slope',  name:'Nyamirambo Steep Slope',  name_rw:"Umusozi w'Nyamirambo",           lat:-1.9712, lng:30.0341, color:'#ef4444', risk:'RED'    },
  { id:'kanzenze_wetland',  name:'Kanzenze Wetland Edge',   name_rw:'Inkukuma ya Kanzenze',            lat:-1.9980, lng:30.1148, color:'#ef4444', risk:'RED'    },
  { id:'rugunga_buffer',    name:'Rugunga Wetland Buffer',  name_rw:'Inkukuma ya Rugunga',             lat:-1.9248, lng:30.0612, color:'#f97316', risk:'ORANGE' },
  { id:'remera_flood',      name:'Remera Valley Section',   name_rw:'Ikibaya cya Remera',              lat:-1.9521, lng:30.0934, color:'#f97316', risk:'ORANGE' },
  { id:'gisozi_safe',       name:'Gisozi Residential Zone', name_rw:"Zone y'Amazu ya Gisozi",          lat:-1.9182, lng:30.0748, color:'#22c55e', risk:'GREEN'  },
  { id:'kimironko_hill',    name:'Kimironko Hill Zone',     name_rw:'Umusozi wa Kimironko',             lat:-1.9318, lng:30.1087, color:'#22c55e', risk:'GREEN'  },
  { id:'kanombe_plateau',   name:'Kanombe Plateau Zone',    name_rw:'Ikibaya cya Kanombe',              lat:-1.9634, lng:30.1312, color:'#22c55e', risk:'GREEN'  },
  { id:'bumbogo_north',     name:'Bumbogo Northern Zone',   name_rw:"Zone y'Amajyaruguru ya Bumbogo",  lat:-1.8712, lng:30.0823, color:'#22c55e', risk:'GREEN'  },
]

const RISK_LABEL: Record<string,{en:string;rw:string}> = {
  RED:    { en:'High Risk', rw:'Ingereko Nini' },
  ORANGE: { en:'Caution',   rw:'Witondere'     },
  GREEN:  { en:'Safe',      rw:'Ari Bwiza'     },
}

interface Props {
  lang: string
  onDemoClick: (lat:number, lng:number) => void
}

export default function DemoMarkers({ lang, onDemoClick }: Props) {
  const map = useMap()
  const lg  = useRef<L.LayerGroup|null>(null)

  useEffect(() => {
    lg.current = L.layerGroup().addTo(map)

    DEMO_PLACES.forEach(p => {
      const rLabel = RISK_LABEL[p.risk]
      const name   = lang === 'rw' ? p.name_rw : p.name
      const badge  = lang === 'rw' ? rLabel.rw : rLabel.en

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:36px;height:44px;cursor:pointer">
            <div style="
              position:absolute;top:2px;left:2px;
              width:32px;height:32px;border-radius:50%;
              background:${p.color}20;border:1px solid ${p.color}50;
              animation:baMasoPulse 2.2s ease-in-out infinite;
            "></div>
            <div style="
              position:absolute;top:6px;left:6px;
              width:24px;height:24px;
              border-radius:50% 50% 50% 0;
              background:${p.color};
              border:2.5px solid white;
              transform:rotate(-45deg);
              box-shadow:0 2px 10px ${p.color}90;
            "></div>
            <div style="
              position:absolute;top:-2px;right:-6px;
              background:white;color:${p.color};
              font-size:6px;font-weight:900;
              padding:1px 4px;border-radius:4px;
              font-family:'JetBrains Mono',monospace;
              box-shadow:0 1px 4px rgba(0,0,0,0.35);
              white-space:nowrap;letter-spacing:0.04em;
            ">DEMO</div>
          </div>`,
        iconSize:   [36, 44],
        iconAnchor: [18, 42],
        popupAnchor:[0, -44],
      })

      const marker = L.marker([p.lat, p.lng], { icon, zIndexOffset: 800 })

      // Tooltip on hover
      marker.bindTooltip(`
        <div style="font-family:'Sora',sans-serif;min-width:170px;padding:2px 0">
          <div style="font-size:12px;font-weight:700;color:${p.color};margin-bottom:4px">${name}</div>
          <div style="display:flex;align-items:center;gap:6px;font-size:10px;color:rgba(232,245,238,0.7);margin-bottom:4px">
            <span style="width:8px;height:8px;border-radius:50%;background:${p.color};flex-shrink:0;display:inline-block"></span>
            ${badge}
          </div>
          <div style="font-size:9px;color:rgba(232,245,238,0.4);padding-top:4px;border-top:1px solid rgba(255,255,255,0.08)">
            ${lang==='rw'?'👆 Kanda urebe ibisubizo byuzuye':'👆 Click for full safety assessment'}
          </div>
        </div>`,
        { permanent:false, direction:'top', className:'ba-maso-tooltip', offset:[0,-40], opacity:1 }
      )

      // Click fires the same handler as clicking the map
      marker.on('click', () => onDemoClick(p.lat, p.lng))

      marker.addTo(lg.current!)
    })

    return () => {
      lg.current?.clearLayers()
      if (lg.current) map.removeLayer(lg.current)
    }
  }, [map, lang, onDemoClick])

  return null
}