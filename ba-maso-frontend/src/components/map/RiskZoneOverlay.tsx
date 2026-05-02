import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

const HIGH_RISK   = [
  { name:'Nyabugogo Wetland',       coords:[[-1.930,30.040],[-1.930,30.065],[-1.965,30.065],[-1.965,30.040]] },
  { name:'Nyabarongo Valley',        coords:[[-1.970,30.070],[-1.970,30.095],[-1.995,30.095],[-1.995,30.070]] },
  { name:'Gikondo Marshland',        coords:[[-1.980,30.080],[-1.980,30.105],[-2.005,30.105],[-2.005,30.080]] },
  { name:'Kanzenze Wetland',         coords:[[-1.990,30.100],[-1.990,30.130],[-2.015,30.130],[-2.015,30.100]] },
  { name:'Nyabugogo Flood Corridor', coords:[[-1.925,30.035],[-1.925,30.075],[-1.975,30.075],[-1.975,30.035]] },
] as const

const MEDIUM_RISK = [
  { name:'Remera Valley Flood Zone', coords:[[-1.930,30.072],[-1.930,30.115],[-1.975,30.115],[-1.975,30.072]] },
  { name:'Kacyiru Seasonal Flood',   coords:[[-1.905,30.062],[-1.905,30.090],[-1.930,30.090],[-1.930,30.062]] },
  { name:'Rugunga Wetland Buffer',   coords:[[-1.915,30.055],[-1.915,30.075],[-1.935,30.075],[-1.935,30.055]] },
] as const

const SAFE_ZONES  = [
  { name:'Gisozi Safe Residential',    coords:[[-1.905,30.062],[-1.905,30.090],[-1.935,30.090],[-1.935,30.062]] },
  { name:'Kimironko Hill Safe Zone',   coords:[[-1.920,30.095],[-1.920,30.125],[-1.950,30.125],[-1.950,30.095]] },
  { name:'Kanombe Plateau Safe Zone',  coords:[[-1.950,30.120],[-1.950,30.150],[-1.980,30.150],[-1.980,30.120]] },
  { name:'Bumbogo Northern Safe Zone', coords:[[-1.855,30.068],[-1.855,30.098],[-1.890,30.098],[-1.890,30.068]] },
] as const

const tipHtml = (name:string, type:'red'|'orange'|'green') => {
  const color = type==='red'?'#ef4444': type==='orange'?'#f97316':'#22c55e'
  const desc  = type==='red'   ?'🔴 High Risk — wetland / flood zone' :
                type==='orange'?'🟠 Caution — moderate flood risk'     :
                                 '🟢 Safe Zone — approved residential'
  return `<div style="font-family:'Sora',sans-serif">
    <div style="font-size:12px;font-weight:700;color:${color};margin-bottom:3px">${name}</div>
    <div style="font-size:10px;color:rgba(232,245,238,0.65)">${desc}</div>
    <div style="font-size:9px;color:rgba(232,245,238,0.35);margin-top:3px">Click to check exact safety</div>
  </div>`
}

export default function RiskZoneOverlay() {
  const map = useMap()
  const lg  = useRef<L.LayerGroup|null>(null)

  useEffect(() => {
    lg.current = L.layerGroup().addTo(map)

    const add = (zones: readonly { name:string; coords:readonly(readonly[number,number])[] }[], type:'red'|'orange'|'green') => {
      const style = {
        red:    { color:'#ef4444', fill:'rgba(239,68,68,0.16)',  weight:1.5, dash:undefined as string|undefined },
        orange: { color:'#f97316', fill:'rgba(249,115,22,0.11)', weight:1.5, dash:'5 4'                       },
        green:  { color:'#22c55e', fill:'rgba(34,197,94,0.09)',  weight:1,   dash:'3 3'                       },
      }[type]

      zones.forEach(z => {
        const latlngs = z.coords.map(([a,b]) => L.latLng(a as number, b as number))
        L.polygon(latlngs, {
          color:       style.color,
          fillColor:   style.fill,
          weight:      style.weight,
          opacity:     0.55,
          fillOpacity: 1,
          dashArray:   style.dash,
        })
        .bindTooltip(tipHtml(z.name, type), {
          permanent: false, direction:'top',
          className:'ba-maso-tooltip', opacity:1,
        })
        .addTo(lg.current!)
      })
    }

    add(HIGH_RISK,   'red')
    add(MEDIUM_RISK, 'orange')
    add(SAFE_ZONES,  'green')

    return () => {
      lg.current?.clearLayers()
      if (lg.current) map.removeLayer(lg.current)
    }
  }, [map])

  return null
}