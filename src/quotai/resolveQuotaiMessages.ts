import type { AppLocale } from '@/i18n/config'
import { SUPPORTED_LOCALES } from '@/i18n/config'
import {
  pickSupportedLanguages,
  readQuotaiCache,
  scopeIdForQuotai,
  writeQuotaiCache,
  type QuotaiFlatTranslations,
} from './cache'
import { fetchQuotaiProjectInfo, fetchQuotaiTranslations } from './fetchQuotai'
import { deepMerge, unflattenDotKeys } from './unflatten'

export type I18nLoadSource = 'static' | 'api' | 'cache'

export type ResolveQuotaiResult = {
  messages: Record<AppLocale, Record<string, unknown>>
  source: I18nLoadSource
}

function mergeStaticWithQuotai(
  staticMessages: Record<AppLocale, Record<string, unknown>>,
  flatByLang: QuotaiFlatTranslations,
): Record<AppLocale, Record<string, unknown>> {
  const out = {} as Record<AppLocale, Record<string, unknown>>
  for (const loc of SUPPORTED_LOCALES) {
    const base = staticMessages[loc]
    const flat = flatByLang[loc]
    if (!flat || Object.keys(flat).length === 0) {
      out[loc] = base
      continue
    }
    const nested = unflattenDotKeys(flat) as Record<string, unknown>
    out[loc] = deepMerge(base, nested) as Record<string, unknown>
  }
  return out
}

function readEnv(): {
  baseUrl: string
  apiKey: string | undefined
  projectId: string | undefined
} {
  const baseUrl = (import.meta.env.VITE_QUOTAI_BASE_URL as string | undefined)?.trim() || 'https://quotai.net'
  const apiKey = (import.meta.env.VITE_QUOTAI_API_KEY as string | undefined)?.trim()
  const projectId = (import.meta.env.VITE_QUOTAI_PROJECT_ID as string | undefined)?.trim()
  return { baseUrl, apiKey, projectId }
}

/**
 * Fetch current translations from Quotai, merge over bundled JSON, update localStorage cache.
 * Throws on network or API errors (caller handles fallback).
 */
export async function pullQuotaiMergedMessages(
  staticMessages: Record<AppLocale, Record<string, unknown>>,
  signal: AbortSignal,
): Promise<Record<AppLocale, Record<string, unknown>>> {
  const { baseUrl, apiKey, projectId } = readEnv()
  if (!apiKey) {
    throw new Error('Quotai: VITE_QUOTAI_API_KEY is not set')
  }

  const scopeId = scopeIdForQuotai(projectId, apiKey)

  let quotaiProjectId: string | undefined
  try {
    const info = await fetchQuotaiProjectInfo(baseUrl, apiKey, signal)
    quotaiProjectId = info.project_id
    if (projectId && info.project_id !== projectId) {
      throw new Error(
        `Quotai project mismatch: env VITE_QUOTAI_PROJECT_ID=${projectId} but API key resolves to ${info.project_id}`,
      )
    }
  } catch (e) {
    if (projectId) throw e
  }

  const flatAll = await fetchQuotaiTranslations(baseUrl, apiKey, signal)
  writeQuotaiCache(scopeId, flatAll, quotaiProjectId)

  const picked = pickSupportedLanguages(flatAll, SUPPORTED_LOCALES)
  return mergeStaticWithQuotai(staticMessages, picked)
}

/**
 * On every call (typically each full page load): try Quotai API first, then last-good localStorage cache, then bundled JSON.
 */
export async function resolveQuotaiMessages(
  staticMessages: Record<AppLocale, Record<string, unknown>>,
): Promise<ResolveQuotaiResult> {
  const { apiKey, projectId } = readEnv()

  if (!apiKey) {
    if (import.meta.env.DEV) {
      console.info('[FlowMetrics] i18n: no VITE_QUOTAI_API_KEY — using bundled locales only.')
    }
    return { messages: staticMessages, source: 'static' }
  }

  const scopeId = scopeIdForQuotai(projectId, apiKey)
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15_000)

  const applyCache = (): ResolveQuotaiResult | null => {
    const cached = readQuotaiCache(scopeId)
    if (!cached?.data) return null
    const picked = pickSupportedLanguages(cached.data, SUPPORTED_LOCALES)
    if (Object.keys(picked).length === 0) return null
    return {
      messages: mergeStaticWithQuotai(staticMessages, picked),
      source: 'cache',
    }
  }

  try {
    const messages = await pullQuotaiMergedMessages(staticMessages, controller.signal)
    if (import.meta.env.DEV) {
      console.info('[FlowMetrics] i18n: loaded from Quotai API', { scopeId })
    }
    return {
      messages,
      source: 'api',
    }
  } catch (err) {
    console.warn('[FlowMetrics] Quotai fetch failed, trying cache:', err)
    const fromCache = applyCache()
    if (fromCache) {
      if (import.meta.env.DEV) {
        console.info('[FlowMetrics] i18n: using cached Quotai bundle', { scopeId })
      }
      return fromCache
    }
    console.warn('[FlowMetrics] i18n: no cache — using bundled locales only.')
    return { messages: staticMessages, source: 'static' }
  } finally {
    window.clearTimeout(timeout)
  }
}
