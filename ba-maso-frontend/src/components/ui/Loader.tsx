import { useEffect, useState } from 'react'
import { VStack, Text } from '@chakra-ui/react'

interface Props {
  label?: string
  size?: number
}

export default function BaMasoLoader({ label, size = 72 }: Props) {
  const [angle, setAngle] = useState(0)
  const [scanY, setScanY] = useState(0)
  const [scanDir, setScanDir] = useState(1)

  useEffect(() => {
    let frame: number
    let last = performance.now()
    const tick = (now: number) => {
      const dt = now - last
      last = now
      setAngle(a => (a + dt * 0.12) % 360)
      setScanY(y => {
        const next = y + dt * 0.08 * scanDir
        if (next >= size - 8) setScanDir(-1)
        if (next <= 4)        setScanDir(1)
        return Math.max(4, Math.min(size - 8, next))
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [size, scanDir])

  const cx = size / 2
  const r1 = cx - 3
  const r2 = cx - 10
  const r3 = cx - 18

  return (
    <VStack gap={3} align="center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r1} fill="none" stroke="rgba(42,157,92,0.1)" strokeWidth={1.5} />
        <circle cx={cx} cy={cx} r={r1} fill="none" stroke="rgba(42,157,92,0.7)" strokeWidth={1.5}
          strokeDasharray={`${r1 * 0.6} ${r1 * 10}`}
          transform={`rotate(${angle} ${cx} ${cx})`}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cx} r={r2} fill="none" stroke="rgba(42,157,92,0.07)" strokeWidth={1} />
        <circle cx={cx} cy={cx} r={r2} fill="none" stroke="rgba(42,157,92,0.4)" strokeWidth={1}
          strokeDasharray={`${r2 * 0.4} ${r2 * 10}`}
          transform={`rotate(${-angle * 1.4} ${cx} ${cx})`}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cx} r={r3} fill="rgba(42,157,92,0.04)" stroke="rgba(42,157,92,0.08)" strokeWidth={0.5} />
        <line
          x1={cx - r3 + 2} y1={scanY} x2={cx + r3 - 2} y2={scanY}
          stroke="rgba(42,157,92,0.6)" strokeWidth={0.5}
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 3px rgba(42,157,92,0.8))' }}
        />
        <circle cx={cx} cy={cx} r={3} fill="#2a9d5c"
          style={{ filter: 'drop-shadow(0 0 6px #2a9d5c)' }}
        />
        {[0, 60, 120, 180, 240, 300].map((base, i) => {
          const deg = ((base + angle * 0.8) * Math.PI) / 180
          const ox = cx + (r2 - 2) * Math.cos(deg)
          const oy = cx + (r2 - 2) * Math.sin(deg)
          return <circle key={i} cx={ox} cy={oy} r={1.2} fill="#2a9d5c" opacity={0.3 + (i / 6) * 0.4} />
        })}
      </svg>

      {label && (
        <Text
          fontSize="10px"
          fontWeight={700}
          letterSpacing="0.12em"
          textTransform="uppercase"
          color="#2a9d5c"
          fontFamily="'JetBrains Mono', monospace"
        >
          {label}
        </Text>
      )}
    </VStack>
  )
}