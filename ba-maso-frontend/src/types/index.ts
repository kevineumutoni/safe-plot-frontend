export type RiskColor = 'GREEN' | 'ORANGE' | 'RED'
export type Language = 'rw' | 'en'

export interface RiskFactor {
  name: string
  score: number
  weight: number
  detail: string
  label_rw: string
}

export interface SafeSuggestion {
  name: string
  latitude: number
  longitude: number
  description_rw: string
  description_en: string
  distance_km: number | null
}

export interface FloodAlert {
  alert_level: 'none' | 'watch' | 'warning' | 'emergency'
  rainfall_24h_mm: number
  rainfall_48h_mm: number
  interpretation_rw: string
  interpretation_en: string
}

export interface RiskResponse {
  check_id: string
  risk_score: number
  risk_color: RiskColor
  risk_label_rw: string
  risk_label_en: string
  explanation_rw: string
  explanation_en: string
  factors: RiskFactor[]
  safe_suggestions: SafeSuggestion[]
  flood_alert: FloodAlert
  latitude: number
  longitude: number
  district: string | null
  sector: string | null
  cell: string | null
  village: string | null
  data_source_note: string
  checked_at: string
}

export interface LocationQuery {
  latitude: number
  longitude: number
  district?: string
  sector?: string
  cell?: string
  village?: string
  session_token?: string
}

export interface ChatMessage {
  role: 'user' | 'ai'
  text_rw: string
  text_en: string
  timestamp: string
}

export interface HistoryItem extends RiskResponse {
  saved_at: string
}