<template>
  <div>
    <section class="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p class="text-sm font-semibold uppercase tracking-wide text-brand-600">
          {{ t('home.hero.eyebrow') }}
        </p>
        <h1 class="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {{ t('home.hero.title') }}
        </h1>
        <p class="mt-6 max-w-2xl text-lg text-slate-600">
          {{ t('home.hero.subtitle') }}
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink
            :to="{ name: 'contact', params: { locale } }"
            class="inline-flex items-center justify-center rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            {{ t('common.cta.primary') }}
          </RouterLink>
          <RouterLink
            :to="{ name: 'pricing', params: { locale } }"
            class="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300"
          >
            {{ t('common.cta.secondary') }}
          </RouterLink>
        </div>
        <p class="mt-6 text-sm font-medium text-slate-500">{{ t('home.hero.proof') }}</p>
        <p class="mt-4 text-sm text-slate-500">
          <span class="font-medium text-slate-700">{{ t('common.meta.lastUpdatedLabel') }}:</span>
          <time class="ms-1" :datetime="PORTAL_ISO">{{ d(PORTAL_DATE, 'long') }}</time>
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold text-slate-900">{{ t('home.pillars.title') }}</h2>
      <div class="mt-10 grid gap-8 md:grid-cols-3">
        <article
          v-for="card in pillarKeys"
          :key="card"
          class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 class="text-lg font-semibold text-slate-900">{{ t(`home.pillars.${card}.title`) }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ t(`home.pillars.${card}.body`) }}</p>
        </article>
      </div>
    </section>

    <section class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {{ t('home.logos.title') }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import type { AppLocale } from '@/i18n/config'

const { t, d } = useI18n()
const route = useRoute()

const locale = computed(() => route.params.locale as AppLocale)

const PORTAL_ISO = '2026-05-01'
const PORTAL_DATE = new Date(PORTAL_ISO)

const pillarKeys = ['flow', 'quality', 'alignment'] as const
</script>
