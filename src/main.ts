import { createApp } from 'vue'
import App from './App.vue'
import { createAppI18n } from '@/i18n/config'
import { staticLocaleMessages } from '@/i18n/static-messages'
import { startQuotaiLiveSync } from '@/quotai/liveSync'
import { resolveQuotaiMessages } from '@/quotai/resolveQuotaiMessages'
import { createAppRouter } from '@/router'
import './assets/main.css'

async function bootstrap() {
  const { messages, source } = await resolveQuotaiMessages(staticLocaleMessages)
  const i18n = createAppI18n(messages)
  const router = createAppRouter(i18n)

  if (import.meta.env.DEV) {
    console.info('[FlowMetrics] i18n source:', source)
  }

  const app = createApp(App)
  app.use(i18n)
  app.use(router)
  app.mount('#app')
  startQuotaiLiveSync(i18n, staticLocaleMessages)
}

bootstrap().catch((err) => {
  console.error('[FlowMetrics] bootstrap failed', err)
})
