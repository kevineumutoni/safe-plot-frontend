import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Box, VStack, Text, HStack } from '@chakra-ui/react'
import { getDistricts, getSectors, getCells, getVillages, checkRisk } from '../api/client'
import { useAppStore } from '../store/useAppStore'
import NavBar from '../components/ui/NavBar'
import BaMasoLoader from '../components/ui/Loader'

const DISTRICT_COORDS: Record<string, [number, number]> = {
  Gasabo:      [-1.9200, 30.0850],
  Kicukiro:   [-1.9800, 30.0900],
  Nyarugenge: [-1.9530, 30.0520],
}

// Fully native select — avoids Chakra Select v3 peer/theme issues
function SelectField({
  value,
  onChange,
  loading,
  placeholder,
  options,
}: {
  value: string
  onChange: (v: string) => void
  loading: boolean
  placeholder: string
  options: string[]
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 36px 12px 14px', borderRadius: 12,
          background: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          color: 'var(--text)',
          fontSize: 13, outline: 'none',
          fontFamily: "'Sora', sans-serif",
          cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--green, #2a9d5c)')}
        onBlur={e => (e.target.style.borderColor = 'var(--input-border)')}
      >
        <option value="">{loading ? 'Loading...' : placeholder}</option>
        {options.map(o => (
          <option key={o} value={o} style={{ background: 'var(--bg2, #0f1510)', color: 'var(--text, #e8f5ee)' }}>
            {o}
          </option>
        ))}
      </select>
      <span style={{
        position: 'absolute', right: 12, top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: 'var(--text-faint)', fontSize: 10,
      }}>▼</span>
    </div>
  )
}

export default function SearchPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language as 'rw' | 'en'
  const { sessionToken, setCurrentResult, saveToHistory } = useAppStore()

  const [district, setDistrict] = useState('')
  const [sector,   setSector]   = useState('')
  const [cell,     setCell]     = useState('')
  const [village,  setVillage]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const { data: districts = [], isLoading: dLoading } = useQuery({
    queryKey: ['districts'],
    queryFn: getDistricts,
    staleTime: 10 * 60 * 1000,
  })
  const { data: sectors = [], isLoading: sLoading } = useQuery({
    queryKey: ['sectors', district],
    queryFn: () => getSectors(district),
    enabled: district.length > 0,
    staleTime: 10 * 60 * 1000,
  })
  const { data: cells = [], isLoading: cLoading } = useQuery({
    queryKey: ['cells', district, sector],
    queryFn: () => getCells(district, sector),
    enabled: district.length > 0 && sector.length > 0,
    staleTime: 10 * 60 * 1000,
  })
  const { data: villages = [], isLoading: vLoading } = useQuery({
    queryKey: ['villages', district, sector, cell],
    queryFn: () => getVillages(district, sector, cell),
    enabled: district.length > 0 && sector.length > 0 && cell.length > 0,
    staleTime: 10 * 60 * 1000,
  })

  const handleCheck = async () => {
    if (!district) {
      setError(lang === 'rw' ? 'Hitamo akarere mbere' : 'Please select a district first')
      return
    }
    setError('')
    setLoading(true)
    try {
      const [lat, lng] = DISTRICT_COORDS[district] ?? [-1.9441, 30.0619]
      const result = await checkRisk({ latitude: lat, longitude: lng, district, sector, cell, village, session_token: sessionToken })
      setCurrentResult(result)
      saveToHistory(result)
      navigate('/results')
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? (lang === 'rw' ? 'Ikibazo cyabaye' : 'Check failed. Is backend running?'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="var(--bg)" display="flex" flexDirection="column">
      <NavBar showBack />

      <Box
        flex={1}
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        p="32px 20px"
      >
        <VStack w="100%" maxW="440px" gap={5} align="stretch">

          {/* Heading */}
          <Box>
            <Text
              fontSize="22px"
              fontWeight={800}
              m="0 0 6px"
              color="var(--text)"
              letterSpacing="-0.02em"
            >
              {t('manual_entry')}
            </Text>
            <Text fontSize="12px" color="var(--text-faint)" m={0}>
              {t('advisory')}
            </Text>
          </Box>

          {/* District */}
          <Box>
            <Text
              fontSize="9px"
              color="var(--green, #2a9d5c)"
              fontWeight={700}
              letterSpacing="0.12em"
              textTransform="uppercase"
              mb={2}
            >
              {t('select_district')}
            </Text>
            <SelectField
              value={district}
              onChange={v => { setDistrict(v); setSector(''); setCell(''); setVillage('') }}
              loading={dLoading}
              placeholder={t('select_district')}
              options={districts}
            />
          </Box>

          {/* Sector */}
          {district && (
            <Box>
              <Text
                fontSize="9px"
                color="var(--green, #2a9d5c)"
                fontWeight={700}
                letterSpacing="0.12em"
                textTransform="uppercase"
                mb={2}
              >
                {t('select_sector')}
              </Text>
              <SelectField
                value={sector}
                onChange={v => { setSector(v); setCell(''); setVillage('') }}
                loading={sLoading}
                placeholder={t('select_sector')}
                options={sectors}
              />
            </Box>
          )}

          {/* Cell */}
          {district && sector && (
            <Box>
              <Text
                fontSize="9px"
                color="var(--green, #2a9d5c)"
                fontWeight={700}
                letterSpacing="0.12em"
                textTransform="uppercase"
                mb={2}
              >
                {t('select_cell')}
              </Text>
              <SelectField
                value={cell}
                onChange={v => { setCell(v); setVillage('') }}
                loading={cLoading}
                placeholder={t('select_cell')}
                options={cells}
              />
            </Box>
          )}

          {/* Village */}
          {district && sector && cell && (
            <Box>
              <Text
                fontSize="9px"
                color="var(--green, #2a9d5c)"
                fontWeight={700}
                letterSpacing="0.12em"
                textTransform="uppercase"
                mb={2}
              >
                {t('select_village')}
              </Text>
              <SelectField
                value={village}
                onChange={setVillage}
                loading={vLoading}
                placeholder={t('select_village')}
                options={villages}
              />
            </Box>
          )}

          {/* Error */}
          {error && (
            <Box
              bg="rgba(239,68,68,0.08)"
              border="1px solid rgba(239,68,68,0.3)"
              borderRadius="12px"
              p="10px 14px"
            >
              <Text fontSize="13px" color="#ef4444">{error}</Text>
            </Box>
          )}

          {/* Submit */}
          <button
            onClick={handleCheck}
            disabled={!district || loading}
            style={{
              height: 52, borderRadius: 14, border: 'none',
              background: !district || loading ? 'rgba(42,157,92,0.25)' : 'var(--green, #2a9d5c)',
              color: 'white', fontSize: 14, fontWeight: 700,
              cursor: !district || loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Sora', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.2s',
              width: '100%',
            }}
          >
            {loading
              ? <><BaMasoLoader size={22} /> {t('checking')}</>
              : t('check_button')
            }
          </button>

          <Text fontSize="11px" color="var(--text-faint)" textAlign="center" m={0}>
            {t('advisory')}
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}