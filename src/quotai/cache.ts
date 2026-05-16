import type { AppLocale } from '@/i18n/config'

/** Same shape as GET /api/public/translations (all languages, flat keys per language). */
export type QuotaiFlatTranslations = Record<string, Record<string, string>>

export type QuotaiCacheEnvelopeV1 = {
  v: 1
  savedAt: string
  /** Confirmed Quotai project id (from /api/public/project-info) when available. */
  quotaiProjectId?: string
  data: QuotaiFlatTranslations
}

export function cacheStorageKey(scopeId: string): string {
  return `flowmetrics:quotai:v1:${scopeId}`
}

export function readQuotaiCache(scopeId: string): QuotaiCacheEnvelopeV1 | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(cacheStorageKey(scopeId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as QuotaiCacheEnvelopeV1
    if (parsed?.v !== 1 || !parsed.data || typeof parsed.data !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function writeQuotaiCache(
  scopeId: string,
  data: QuotaiFlatTranslations,
  quotaiProjectId?: string,
): void {
  if (typeof localStorage === 'undefined') return
  const envelope: QuotaiCacheEnvelopeV1 = {
    v: 1,
    savedAt: new Date().toISOString(),
    quotaiProjectId,
    data,
  }
  try {
    localStorage.setItem(cacheStorageKey(scopeId), JSON.stringify(envelope))
  } catch (e) {
    console.warn('[FlowMetrics] Failed to write Quotai cache', e)
  }
}

export function scopeIdForQuotai(projectIdEnv: string | undefined, apiKey: string): string {
  const trimmed = projectIdEnv?.trim()
  if (trimmed) return trimmed
  let h = 0
  for (let i = 0; i < apiKey.length; i++) {
    h = (h * 31 + apiKey.charCodeAt(i)) >>> 0
  }
  return `k:${h.toString(16)}`
}

export function pickSupportedLanguages(
  data: QuotaiFlatTranslations,
  supported: readonly AppLocale[],
): QuotaiFlatTranslations {
  const out: QuotaiFlatTranslations = {}
  for (const loc of supported) {
    if (data[loc] && typeof data[loc] === 'object') {
      out[loc] = data[loc]
    }
  }
  return out
}
