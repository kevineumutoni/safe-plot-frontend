import { useState } from 'react'
import {
  Box, Text, Button, HStack, VStack, Badge,
} from '@chakra-ui/react'
import { useAppStore } from '../../store/useAppStore'
import RiskBadge from '../ui/RiskBadge'
import FloodAlertBanner from '../ui/FloodAlertBanner'
import AIChat from '../chat/AIChat'

const FACTOR_COLOR: Record<string, string> = {
  'Wetland Proximity':     '#38bdf8',
  'Flood Zone':            '#06b6d4',
  'Master Plan 2050 Zone': '#a78bfa',
  'Slope Risk':            '#fb923c',
  'Valley Elevation':      '#34d399',
}

interface Props { lang: string }

export default function ResultPanel({ lang }: Props) {
  const { currentResult } = useAppStore()
  const [tab, setTab] = useState<'results' | 'chat'>('results')

  if (!currentResult) {
    return (
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={6}
      >
        <VStack gap={3} textAlign="center">
          <Text fontSize="36px">🌍</Text>
          <Text color="var(--text-faint)" fontSize="13px" fontWeight={600}>
            {lang === 'rw' ? 'Kanda ku makarita urebe umutekano' : 'Click the map to check land safety'}
          </Text>
        </VStack>
      </Box>
    )
  }

  const r = currentResult
  const explanation = lang === 'rw' ? r.explanation_rw : r.explanation_en

  return (
    <Box height="100%" display="flex" flexDirection="column">
      {/* Tab bar */}
      <HStack gap={1} px={4} pt={3} pb={0} flexShrink={0} alignItems="center">
        {(['results', 'chat'] as const).map(key => (
          <Button
            key={key}
            onClick={() => setTab(key)}
            size="sm"
            px={4}
            py="6px"
            borderRadius="8px"
            border="none"
            bg={tab === key ? 'var(--green-dim)' : 'transparent'}
            color={tab === key ? 'var(--green)' : 'var(--text-faint)'}
            fontSize="11px"
            fontWeight={700}
            letterSpacing="0.05em"
            fontFamily="'Sora', sans-serif"
            transition="all 0.15s"
            height="auto"
            _hover={{ bg: tab === key ? 'var(--green-dim)' : 'rgba(255,255,255,0.04)' }}
          >
            {key === 'results' ? (lang === 'rw' ? 'Ibisubizo' : 'Results') : (lang === 'rw' ? 'Baza AI' : 'Ask AI')}
          </Button>
        ))}
        <Box flex={1} />
        {r.district && (
          <Text fontSize="10px" color="var(--text-faint)" fontWeight={600}>{r.district}</Text>
        )}
      </HStack>

      {/* Results tab */}
      {tab === 'results' && (
        <Box
          flex={1}
          overflowY="auto"
          px={4}
          py={3}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <RiskBadge
            color={r.risk_color}
            score={r.risk_score}
            labelRw={r.risk_label_rw}
            labelEn={r.risk_label_en}
            lang={lang}
          />

          {/* Explanation card */}
          <Box
            bg="var(--bg-card)"
            border="1px solid var(--border)"
            borderRadius="14px"
            p={4}
          >
            <Text
              fontSize="9px"
              color="var(--green)"
              fontWeight={700}
              letterSpacing="0.12em"
              textTransform="uppercase"
              mb={2}
            >
              {lang === 'rw' ? 'Ibisobanuro' : 'Explanation'}
            </Text>
            <Text fontSize="13px" color="var(--text-dim)" lineHeight={1.7}>{explanation}</Text>
          </Box>

          <FloodAlertBanner alert={r.flood_alert} lang={lang} />

          {/* Risk factors */}
          <Box>
            <Text
              fontSize="9px"
              color="var(--green)"
              fontWeight={700}
              letterSpacing="0.12em"
              textTransform="uppercase"
              mb={2}
            >
              {lang === 'rw' ? "Impamvu z'Ingereko" : 'Risk Factors'}
            </Text>
            <VStack gap={2} align="stretch">
              {r.factors.map(f => {
                const max = f.weight * 100
                const pct = Math.min(100, (f.score / max) * 100)
                const col = FACTOR_COLOR[f.name] || 'var(--green)'
                return (
                  <Box
                    key={f.name}
                    bg="var(--bg-card)"
                    border="1px solid var(--border)"
                    borderRadius="10px"
                    p={3}
                  >
                    <HStack justify="space-between" mb="6px">
                      <Text fontSize="11px" fontWeight={600} color="var(--text-dim)">{f.name}</Text>
                      <Text fontSize="11px" fontWeight={700} color={col}>
                        {f.score.toFixed(0)} / {max.toFixed(0)}
                      </Text>
                    </HStack>
                    <Box
                      height="4px"
                      bg="var(--border)"
                      borderRadius="999px"
                      overflow="hidden"
                      mb="6px"
                    >
                      <Box
                        height="100%"
                        width={`${pct}%`}
                        bg={col}
                        borderRadius="999px"
                        boxShadow={`0 0 6px ${col}60`}
                        transition="width 0.8s cubic-bezier(0.34,1.56,0.64,1)"
                      />
                    </Box>
                    <Text fontSize="10px" color="var(--text-faint)" lineHeight={1.4}>
                      {lang === 'rw' ? f.label_rw : f.detail}
                    </Text>
                  </Box>
                )
              })}
            </VStack>
          </Box>

          {/* Safe suggestions */}
          {r.safe_suggestions.length > 0 && (
            <Box>
              <Text
                fontSize="9px"
                color="var(--green)"
                fontWeight={700}
                letterSpacing="0.12em"
                textTransform="uppercase"
                mb={2}
              >
                {lang === 'rw' ? 'Ahantu Heza Hafi' : 'Safer Locations'}
              </Text>
              <VStack gap={2} align="stretch">
                {r.safe_suggestions.map(s => (
                  <Box
                    key={s.name}
                    bg="var(--green-dim)"
                    border="1px solid var(--green-border)"
                    borderRadius="12px"
                    p={3}
                  >
                    <HStack justify="space-between" mb={1}>
                      <Text fontSize="13px" fontWeight={600} color="var(--green-accent)">{s.name}</Text>
                      {s.distance_km && (
                        <Text fontSize="10px" color="var(--green-accent-dim)" fontWeight={600}>
                          {s.distance_km} km
                        </Text>
                      )}
                    </HStack>
                    <Text fontSize="12px" color="var(--text-dim)" lineHeight={1.5}>
                      {lang === 'rw' ? s.description_rw : s.description_en}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}

          <Text fontSize="9px" color="var(--text-faint)" lineHeight={1.6}>{r.data_source_note}</Text>

          <HStack gap={1} flexWrap="wrap" pb={2}>
            {[
              `${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)}`,
              r.district,
              new Date(r.checked_at).toLocaleTimeString(),
            ].filter(Boolean).map(v => (
              <Box
                key={v}
                px={2}
                py="2px"
                borderRadius="6px"
                border="1px solid var(--border)"
                fontSize="9px"
                color="var(--text-faint)"
              >
                {v}
              </Box>
            ))}
          </HStack>
        </Box>
      )}

      {tab === 'chat' && (
        <Box flex={1} overflow="hidden">
          <AIChat />
        </Box>
      )}
    </Box>
  )
}