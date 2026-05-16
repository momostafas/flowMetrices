<template>
  <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
    <header class="max-w-3xl">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900">{{ t('features.hero.title') }}</h1>
      <p class="mt-4 text-lg text-slate-600">{{ t('features.hero.subtitle') }}</p>
    </header>

    <div class="mt-14 grid gap-8 md:grid-cols-2">
      <article
        v-for="block in featureBlocks"
        :key="block"
        class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 class="text-xl font-semibold text-slate-900">{{ t(`features.list.${block}.title`) }}</h2>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ t(`features.list.${block}.body`) }}</p>
      </article>
    </div>

    <section class="mt-16 rounded-2xl bg-brand-900 px-6 py-10 text-white sm:px-10">
      <h2 class="text-2xl font-bold">{{ t('features.cta.title') }}</h2>
      <p class="mt-3 max-w-2xl text-sm text-brand-100">{{ t('features.cta.body') }}</p>
      <RouterLink
        :to="{ name: 'contact', params: { locale } }"
        class="mt-6 inline-flex rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand-800 shadow-sm transition hover:bg-brand-50"
      >
        {{ t('common.cta.primary') }}
      </RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import type { AppLocale } from '@/i18n/config'

const { t } = useI18n()
const route = useRoute()
const locale = computed(() => route.params.locale as AppLocale)

const featureBlocks = ['integrations', 'dashboards', 'alerts', 'exports'] as const
</script>
