import type { I18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { isAppLocale } from '@/i18n/config'

export function createAppRouter(i18n: I18n) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        redirect: { name: 'home', params: { locale: 'en' } },
      },
      {
        path: '/:locale(en|ar|fr|de)',
        component: AppLayout,
        props: true,
        children: [
          {
            path: '',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
          },
          {
            path: 'features',
            name: 'features',
            component: () => import('@/views/FeaturesView.vue'),
          },
          {
            path: 'pricing',
            name: 'pricing',
            component: () => import('@/views/PricingView.vue'),
          },
          {
            path: 'contact',
            name: 'contact',
            component: () => import('@/views/ContactView.vue'),
          },
        ],
      },
      {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'home', params: { locale: 'en' } },
      },
    ],
  })

  router.beforeEach((to) => {
    const loc = to.params.locale
    if (typeof loc === 'string' && isAppLocale(loc)) {
      const locale = i18n.global.locale as { value: string }
      locale.value = loc
    }
  })

  const routeTitle: Record<string, string> = {
    home: 'FlowMetrics',
    features: 'Features · FlowMetrics',
    pricing: 'Pricing · FlowMetrics',
    contact: 'Contact · FlowMetrics',
  }

  router.afterEach((to) => {
    const name = typeof to.name === 'string' ? to.name : ''
    document.title = routeTitle[name] ?? 'FlowMetrics'
  })

  return router
}
