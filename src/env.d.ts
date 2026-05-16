/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QUOTAI_BASE_URL?: string
  readonly VITE_QUOTAI_API_KEY?: string
  readonly VITE_QUOTAI_PROJECT_ID?: string
  /** Poll interval for runtime translation refresh (ms). 0 disables. */
  readonly VITE_QUOTAI_POLL_MS?: string
  /** Optional `branch_id` query for GET /api/public/translations */
  readonly VITE_QUOTAI_BRANCH_ID?: string
  /** Optional `status` query (comma-separated: pending, translated, reviewed, approved) */
  readonly VITE_QUOTAI_TRANSLATIONS_STATUS?: string
  /** Optional `tags` query (comma-separated) */
  readonly VITE_QUOTAI_TRANSLATIONS_TAGS?: string
  /** Optional `keys` query (comma-separated translation keys) */
  readonly VITE_QUOTAI_TRANSLATIONS_KEYS?: string
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
