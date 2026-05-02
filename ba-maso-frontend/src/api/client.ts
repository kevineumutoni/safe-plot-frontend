/// <reference types="vite/client" />
import axios from 'axios'
import type { LocationQuery, RiskResponse } from '../types'

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://safe-plot-975524235617.us-central1.run.app'

const api = axios.create({ baseURL: BASE, timeout: 20000 })

export const checkRisk = async (q: LocationQuery): Promise<RiskResponse> => {
  const { data } = await api.post<RiskResponse>('/api/v1/risk/check', q)
  return data
}
export const getDistricts = async (): Promise<string[]> => {
  const { data } = await api.get('/api/v1/admin/districts')
  return data
}
export const getSectors = async (d: string): Promise<string[]> => {
  const { data } = await api.get(`/api/v1/admin/sectors/${encodeURIComponent(d)}`)
  return data
}
export const getCells = async (d: string, s: string): Promise<string[]> => {
  const { data } = await api.get(`/api/v1/admin/cells/${encodeURIComponent(d)}/${encodeURIComponent(s)}`)
  return data
}
export const getVillages = async (d: string, s: string, c: string): Promise<string[]> => {
  const { data } = await api.get(`/api/v1/admin/villages/${encodeURIComponent(d)}/${encodeURIComponent(s)}/${encodeURIComponent(c)}`)
  return data
}
export const chatWithAI = async (message: string, context?: object): Promise<{ reply_rw: string; reply_en: string }> => {
  const { data } = await api.post('/api/v1/risk/chat', { message, context })
  return data
}