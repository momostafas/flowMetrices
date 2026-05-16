import type { I18n } from 'vue-i18n'
import type { AppLocale } from '@/i18n/config'
import { SUPPORTED_LOCALES } from '@/i18n/config'
import { pullQuotaiMergedMessages } from './resolveQuotaiMessages'

function readPollMs(): number {
  const raw = import.meta.env.VITE_QUOTAI_POLL_MS?.trim()
  if (raw === undefined || raw === '') return 60_000
  const n = Number(raw)
  return Number.isFinite(n) ? n : 60_000
}

function hasQuotaiApiKey(): boolean {
  return Boolean((import.meta.env.VITE_QUOTAI_API_KEY as string | undefined)?.trim())
}

/**
 * Periodically refetches Quotai translations and replaces locale messages (bundled JSON merged with remote).
 * Disabled when `VITE_QUOTAI_POLL_MS` is `0`, or when no API key is set.
 */
export function startQuotaiLiveSync(
  i18n: I18n,
  staticMessages: Record<AppLocale, Record<string, unknown>>,
): () => void {
  if (!hasQuotaiApiKey()) return () => {}

  const pollMs = readPollMs()
  if (pollMs <= 0) return () => {}

  let disposed = false
  let inFlight = false

  const tick = async () => {
    if (disposed || (typeof document !== 'undefined' && document.visibilityState === 'hidden')) {
      return
    }
    if (inFlight) return
    inFlight = true
    const ac = new AbortController()
    const t = window.setTimeout(() => ac.abort(), 15_000)
    try {
      const messages = await pullQuotaiMergedMessages(staticMessages, ac.signal)
      if (disposed) return
      for (const loc of SUPPORTED_LOCALES) {
        i18n.global.setLocaleMessage(loc, messages[loc] as never)
      }
      if (import.meta.env.DEV) {
        console.info('[FlowMetrics] i18n: Quotai live sync applied')
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('[FlowMetrics] i18n: Quotai live sync failed (keeping current messages)', e)
      }
    } finally {
      window.clearTimeout(t)
      inFlight = false
    }
  }

  const intervalId = window.setInterval(tick, pollMs)
  document.addEventListener('visibilitychange', tick)

  return () => {
    disposed = true
    window.clearInterval(intervalId)
    document.removeEventListener('visibilitychange', tick)
  }
}
