<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div
        class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
      >
        <RouterLink
          :to="{ name: 'home', params: { locale } }"
          class="text-lg font-semibold tracking-tight text-brand-700"
        >
          {{ t('common.brand') }}
        </RouterLink>
        <nav class="flex flex-wrap items-center gap-1 text-sm font-medium text-slate-600">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="{ name: item.name, params: { locale } }"
            class="rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            active-class="bg-brand-50 text-brand-800"
          >
            {{ t(item.labelKey) }}
          </RouterLink>
        </nav>
        <LangSwitcher :locale="locale" />
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-base font-semibold text-slate-900">{{ t('common.brand') }}</p>
            <p class="mt-1 max-w-xl text-sm text-slate-600">{{ t('common.footer.tagline') }}</p>
          </div>
          <div class="flex flex-wrap gap-4 text-sm text-slate-500">
            <span>{{ t('common.footer.privacy') }}</span>
            <span>{{ t('common.footer.terms') }}</span>
            <span>{{ t('common.footer.status') }}</span>
          </div>
        </div>
        <p class="text-xs text-slate-500">{{ t('common.footer.rights') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AppLocale } from '@/i18n/config'
import LangSwitcher from '@/components/LangSwitcher.vue'

const props = defineProps<{
  locale: string
}>()

const { t } = useI18n()

const locale = computed(() => props.locale as AppLocale)

const navItems = [
  { name: 'home' as const, labelKey: 'common.nav.home' },
  { name: 'features' as const, labelKey: 'common.nav.features' },
  { name: 'pricing' as const, labelKey: 'common.nav.pricing' },
  { name: 'contact' as const, labelKey: 'common.nav.contact' },
]

watch(
  locale,
  (loc) => {
    document.documentElement.lang = loc
    document.documentElement.dir = loc === 'ar' ? 'rtl' : 'ltr'
  },
  { immediate: true },
)
</script>
