import type { QuotaiFlatTranslations } from './cache'

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

/**
 * Documented query params for `GET /api/public/translations` (see backend/API_DOCUMENTATION.md).
 * FlowMetrics loads all languages in one request — do not set `language`/`format` here.
 */
export function buildPublicTranslationsUrl(baseUrl: string): string {
  const url = joinUrl(baseUrl, '/api/public/translations')
  const params = new URLSearchParams()

  const branchId = import.meta.env.VITE_QUOTAI_BRANCH_ID?.trim()
  if (branchId) params.set('branch_id', branchId)

  const status = import.meta.env.VITE_QUOTAI_TRANSLATIONS_STATUS?.trim()
  if (status) params.set('status', status)

  const tags = import.meta.env.VITE_QUOTAI_TRANSLATIONS_TAGS?.trim()
  if (tags) params.set('tags', tags)

  const keys = import.meta.env.VITE_QUOTAI_TRANSLATIONS_KEYS?.trim()
  if (keys) params.set('keys', keys)

  const qs = params.toString()
  return qs ? `${url}?${qs}` : url
}

async function fetchJson(
  url: string,
  apiKey: string,
  signal: AbortSignal,
): Promise<unknown> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-Key': apiKey,
    },
    signal,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Quotai HTTP ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json()
}

export async function fetchQuotaiProjectInfo(
  baseUrl: string,
  apiKey: string,
  signal: AbortSignal,
): Promise<{ project_id: string }> {
  const url = joinUrl(baseUrl, '/api/public/project-info')
  const json = (await fetchJson(url, apiKey, signal)) as { project_id?: string }
  if (!json?.project_id) {
    throw new Error('Quotai project-info: missing project_id')
  }
  return { project_id: String(json.project_id) }
}

export async function fetchQuotaiTranslations(
  baseUrl: string,
  apiKey: string,
  signal: AbortSignal,
): Promise<QuotaiFlatTranslations> {
  const url = buildPublicTranslationsUrl(baseUrl)
  const json = (await fetchJson(url, apiKey, signal)) as QuotaiFlatTranslations
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    throw new Error('Quotai translations: expected object keyed by language')
  }
  return json
}
