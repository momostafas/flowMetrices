function isPlainObject(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === 'object' && !Array.isArray(x)
}

/**
 * Turn flat keys like `common.nav.home` into nested objects for vue-i18n.
 */
export function unflattenDotKeys(flat: Record<string, string>): Record<string, unknown> {
  const root: Record<string, unknown> = {}
  for (const [rawKey, rawVal] of Object.entries(flat)) {
    if (rawVal === undefined || rawVal === null) continue
    const key = String(rawKey).trim()
    if (!key) continue
    const val = String(rawVal)
    const parts = key.split('.').filter(Boolean)
    if (parts.length === 0) continue
    let cur: Record<string, unknown> = root
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i]
      const next = cur[p]
      if (!isPlainObject(next)) {
        cur[p] = {}
      }
      cur = cur[p] as Record<string, unknown>
    }
    cur[parts[parts.length - 1]] = val
  }
  return root
}

export function deepMerge(
  base: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base }
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
