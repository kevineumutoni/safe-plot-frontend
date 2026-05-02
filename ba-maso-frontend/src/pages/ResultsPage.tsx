import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Box, VStack, HStack, Text } from '@chakra-ui/react'
import { useAppStore } from '../store/useAppStore'
import RiskBadge from '../components/ui/RiskBadge'
import FloodAlertBanner from '../components/ui/FloodAlertBanner'
import AIChat from '../components/chat/AIChat'
import NavBar from '../components/ui/NavBar'

export default function ResultsPage() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const { currentResult } = useAppStore()
  const lang = i18n.language as 'rw' | 'en'
  const [tab, setTab] = useState<'results' | 'chat'>('results')

  if (!currentResult) return (
    <Box minH="100vh" bg="#0b0f0c" display="flex" flexDirection="column">
      <NavBar showBack />
      <Box flex={1} display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Text fontSize="40px">🌍</Text>
          <Text color="rgba(232,245,238,0.3)" m={0}>No result — go check a location first</Text>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '8px 20px', borderRadius: 10,
              background: 'transparent',
              border: '1px solid rgba(42,157,92,0.4)',
              color: '#2a9d5c', cursor: 'pointer',
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {lang === 'rw' ? 'Subira' : 'Go Home'}
          </button>
        </VStack>
      </Box>
    </Box>
  )

  const r = currentResult

  return (
    <Box minH="100vh" bg="#0b0f0c" display="flex" flexDirection="column">
      <NavBar showBack />

      <Box
        flex={1}
        maxW="560px"
        w="100%"
        mx="auto"
        p="16px 16px 32px"
      >
        {/* Tabs */}
        <HStack gap={1} mb={5}>
          {([
            ['results', lang === 'rw' ? 'Ibisubizo' : 'Results'],
            ['chat',    lang === 'rw' ? 'Baza AI'   : 'Ask AI'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: tab === key ? 'rgba(42,157,92,0.15)' : 'transparent',
                color: tab === key ? '#2a9d5c' : 'rgba(232,245,238,0.3)',
                fontSize: 12, fontWeight: 700,
                fontFamily: "'Sora', sans-serif",
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </HStack>

        {tab === 'results' && (
          <VStack gap={4} align="stretch">
            <RiskBadge
              color={r.risk_color}
              score={r.risk_score}
              labelRw={r.risk_label_rw}
              labelEn={r.risk_label_en}
              lang={lang}
            />

            {/* Explanation */}
            <Box
              bg="rgba(255,255,255,0.02)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="14px"
              p={4}
            >
              <Text
                fontSize="9px"
                color="#2a9d5c"
                fontWeight={700}
                letterSpacing="0.12em"
                textTransform="uppercase"
                mb={2}
              >
                {lang === 'rw' ? 'Ibisobanuro' : 'Explanation'}
              </Text>
              <Text fontSize="13px" color="rgba(232,245,238,0.75)" lineHeight={1.7} m={0}>
                {lang === 'rw' ? r.explanation_rw : r.explanation_en}
              </Text>
            </Box>

            <FloodAlertBanner alert={r.flood_alert} lang={lang} />

            {/* Risk factors */}
            {r.factors.map(f => {
              const scoreColor = f.score === 0 ? '#22c55e' : f.score < f.weight * 50 ? '#f97316' : '#ef4444'
              return (
                <Box
                  key={f.name}
                  bg="rgba(255,255,255,0.02)"
                  border="1px solid rgba(255,255,255,0.05)"
                  borderRadius="10px"
                  p={3}
                >
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="12px" fontWeight={600} color="rgba(232,245,238,0.7)">
                      {f.name}
                    </Text>
                    <Text fontSize="12px" fontWeight={700} color={scoreColor}>
                      {f.score.toFixed(0)} pts
                    </Text>
                  </HStack>
                  <Box
                    h="3px"
                    bg="rgba(255,255,255,0.06)"
                    borderRadius="999px"
                    overflow="hidden"
                    mb={2}
                  >
                    <Box
                      h="100%"
                      w={`${Math.min(100, (f.score / (f.weight * 100)) * 100)}%`}
                      bg={scoreColor}
                      borderRadius="999px"
                    />
                  </Box>
                  <Text fontSize="10px" color="rgba(232,245,238,0.3)" m={0}>
                    {lang === 'rw' ? f.label_rw : f.detail}
                  </Text>
                </Box>
              )
            })}

            {/* Safe suggestions */}
            {r.safe_suggestions.map(s => (
              <Box
                key={s.name}
                bg="rgba(42,157,92,0.05)"
                border="1px solid rgba(42,157,92,0.15)"
                borderRadius="12px"
                p={3}
              >
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="13px" fontWeight={600} color="#22c55e">{s.name}</Text>
                  {s.distance_km && (
                    <Text fontSize="10px" color="rgba(34,197,94,0.5)">{s.distance_km} km</Text>
                  )}
                </HStack>
                <Text fontSize="12px" color="rgba(232,245,238,0.4)" m={0}>
                  {lang === 'rw' ? s.description_rw : s.description_en}
                </Text>
              </Box>
            ))}
          </VStack>
        )}

        {tab === 'chat' && (
          <Box
            h="65vh"
            bg="rgba(255,255,255,0.02)"
            border="1px solid rgba(255,255,255,0.05)"
            borderRadius="16px"
            overflow="hidden"
          >
            <AIChat />
          </Box>
        )}
      </Box>
    </Box>
  )
}
