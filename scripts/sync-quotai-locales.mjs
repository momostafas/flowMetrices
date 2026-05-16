/**
 * Fetches Quotai public translations and merges them into src/locales/*.json before vite build.
 * Reads the same env vars as the app (including optional translation query filters documented on GET /api/public/translations).
 * If VITE_QUOTAI_API_KEY is unset, exits 0 without modifying files.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const LOCALES_DIR = join(ROOT, 'src', 'locales')
const SUPPORTED = ['en', 'ar', 'fr', 'de']

function parseEnvFile(filePath) {
  const out = {}
  const text = readFileSync(filePath, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

/** Same layering idea as Vite: `.env` then `.env.production`. Existing process.env always wins. */
function loadDotEnv() {
  const merged = {}
  for (const name of ['.env', '.env.production']) {
    const filePath = join(ROOT, name)
    if (!existsSync(filePath)) continue
    Object.assign(merged, parseEnvFile(filePath))
  }
  for (const [key, val] of Object.entries(merged)) {
    if (process.env[key] === undefined) {
      process.env[key] = val
    }
  }
}

function joinUrl(base, path) {
  const b = base.replace(/\/+$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

/** Mirror flowmetrics-demo/src/quotai/fetchQuotai.ts — documented GET /api/public/translations params. */
function buildPublicTranslationsUrl(baseUrl, env) {
  const url = joinUrl(baseUrl, '/api/public/translations')
  const params = new URLSearchParams()

  const branchId = (env.VITE_QUOTAI_BRANCH_ID || '').trim()
  if (branchId) params.set('branch_id', branchId)

  const status = (env.VITE_QUOTAI_TRANSLATIONS_STATUS || '').trim()
  if (status) params.set('status', status)

  const tags = (env.VITE_QUOTAI_TRANSLATIONS_TAGS || '').trim()
  if (tags) params.set('tags', tags)

  const keys = (env.VITE_QUOTAI_TRANSLATIONS_KEYS || '').trim()
  if (keys) params.set('keys', keys)

  const qs = params.toString()
  return qs ? `${url}?${qs}` : url
}

function isPlainObject(x) {
  return x !== null && typeof x === 'object' && !Array.isArray(x)
}

function unflattenDotKeys(flat) {
  const root = {}
  for (const [rawKey, rawVal] of Object.entries(flat)) {
    if (rawVal === undefined || rawVal === null) continue
    const key = String(rawKey).trim()
    if (!key) continue
    const val = String(rawVal)
    const parts = key.split('.').filter(Boolean)
    if (parts.length === 0) continue
    let cur = root
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i]
      const next = cur[p]
      if (!isPlainObject(next)) {
        cur[p] = {}
      }
      cur = cur[p]
    }
    cur[parts[parts.length - 1]] = val
  }
  return root
}

function deepMerge(base, patch) {
  const out = { ...base }
  for (const k of Object.keys(patch)) {
    const bv = base[k]
    const pv = patch[k]
    if (isPlainObject(bv) && isPlainObject(pv)) {
      out[k] = deepMerge(bv, pv)
    } else {
      out[k] = pv
    }
  }
  return out
}

async function fetchJson(url, apiKey, signal) {
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

async function main() {
  loadDotEnv()

  const baseUrl = (process.env.VITE_QUOTAI_BASE_URL || 'https://quotai.net').trim()
  const apiKey = (process.env.VITE_QUOTAI_API_KEY || '').trim()
  const projectId = (process.env.VITE_QUOTAI_PROJECT_ID || '').trim()

  if (!apiKey) {
    console.info(
      '[sync-quotai-locales] No VITE_QUOTAI_API_KEY — skipping. Set it in .env then run: npm run locales',
    )
    process.exit(0)
  }

  console.info(`[sync-quotai-locales] Fetching ${baseUrl}/api/public/translations → src/locales/*.json`)

  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 30_000)

  try {
    if (projectId) {
      const infoUrl = joinUrl(baseUrl, '/api/public/project-info')
      const info = await fetchJson(infoUrl, apiKey, controller.signal)
      const pid = info?.project_id != null ? String(info.project_id) : ''
      if (pid !== projectId) {
        throw new Error(
          `Quotai project mismatch: VITE_QUOTAI_PROJECT_ID=${projectId} but API key resolves to ${pid || '(missing)'}`,
        )
      }
    }

    const transUrl = buildPublicTranslationsUrl(baseUrl, process.env)
    const flatByLang = await fetchJson(transUrl, apiKey, controller.signal)

    if (!flatByLang || typeof flatByLang !== 'object' || Array.isArray(flatByLang)) {
      throw new Error('Quotai translations: expected object keyed by language')
    }

    for (const loc of SUPPORTED) {
      const filePath = join(LOCALES_DIR, `${loc}.json`)
      const rawBase = readFileSync(filePath, 'utf8')
      const base = JSON.parse(rawBase)
      const flat = flatByLang[loc]
      let merged = base
      if (flat && typeof flat === 'object' && !Array.isArray(flat) && Object.keys(flat).length > 0) {
        const nested = unflattenDotKeys(flat)
        merged = deepMerge(base, nested)
      }
      writeFileSync(filePath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8')
    }

    console.info('[sync-quotai-locales] Wrote merged Quotai strings into src/locales/*.json')
  } finally {
    clearTimeout(t)
  }
}

main().catch((err) => {
  console.error('[sync-quotai-locales] Failed:', err.message || err)
  process.exit(1)
})
