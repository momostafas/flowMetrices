<template>
  <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
    <header class="max-w-3xl">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900">{{ t('pricing.hero.title') }}</h1>
      <p class="mt-4 text-lg text-slate-600">{{ t('pricing.hero.subtitle') }}</p>
      <p class="mt-6 text-sm text-slate-600">
        <span class="font-medium text-slate-800">{{ t('pricing.meta.lastUpdatedLabel') }}:</span>
        <time class="ms-1" :datetime="RATE_ISO">{{ d(RATE_DATE, 'long') }}</time>
      </p>
      <p class="mt-2 text-xs text-slate-500">{{ t('pricing.billing.billedAnnually') }}</p>
    </header>

    <div class="mt-14 grid gap-8 lg:grid-cols-3">
      <article
        v-for="plan in plans"
        :key="plan.id"
        class="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        :class="plan.highlight ? 'ring-2 ring-brand-500' : ''"
      >
        <h2 class="text-xl font-semibold text-slate-900">{{ t(`pricing.plans.${plan.id}.name`) }}</h2>
        <p class="mt-2 text-sm text-slate-600">{{ t(`pricing.plans.${plan.id}.desc`) }}</p>
        <p class="mt-6 text-lg font-semibold text-slate-900">
          <template v-if="plan.kind === 'currency'">
            {{ t(`pricing.plans.${plan.id}.priceNote`, { amount: n(plan.amount, 'currency') }) }}
          </template>
          <template v-else>
            {{ t(`pricing.plans.${plan.id}.priceNote`) }}
          </template>
        </p>
        <p v-if="plan.kind === 'currency'" class="mt-1 text-xs text-slate-500">
          {{ t('pricing.billing.perSeat') }}
        </p>
        <ul class="mt-6 flex-1 space-y-3 text-sm text-slate-600">
          <li v-for="key in plan.bullets" :key="key" class="flex gap-2">
            <span class="mt-0.5 text-brand-600" aria-hidden="true">✓</span>
            <span>{{ t(`pricing.plans.${plan.id}.bullets.${key}`) }}</span>
          </li>
        </ul>
        <RouterLink
          :to="{ name: 'contact', params: { locale } }"
          class="mt-8 inline-flex justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition"
          :class="
            plan.highlight
              ? 'bg-brand-600 text-white hover:bg-brand-700'
              : 'border border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          "
        >
          {{ t(`pricing.plans.${plan.id}.cta`) }}
        </RouterLink>
      </article>
    </div>

    <section class="mt-20 border-t border-slate-200 pt-12">
      <h2 class="text-2xl font-bold text-slate-900">{{ t('pricing.faq.title') }}</h2>
      <dl class="mt-8 space-y-8">
        <div v-for="item in faqKeys" :key="item">
          <dt class="text-base font-semibold text-slate-900">
            {{ t(`pricing.faq.items.${item}.question`) }}
          </dt>
          <dd class="mt-2 text-sm leading-relaxed text-slate-600">
            {{ t(`pricing.faq.items.${item}.answer`) }}
          </dd>
        </div>
      </dl>
      <p
        v-if="locale === 'de'"
        class="mt-6 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900"
      >
        {{ t('pricing.faq.fallbackHint') }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import type { AppLocale } from '@/i18n/config'

const { t, d, n } = useI18n()
const route = useRoute()
const locale = computed(() => route.params.locale as AppLocale)

const RATE_ISO = '2026-05-15'
const RATE_DATE = new Date(RATE_ISO)

const plans = [
  {
    id: 'starter' as const,
    kind: 'currency' as const,
    amount: 29,
    bullets: ['b1', 'b2', 'b3'] as const,
    highlight: false,
  },
  {
    id: 'growth' as const,
    kind: 'currency' as const,
    amount: 89,
    bullets: ['b1', 'b2', 'b3'] as const,
    highlight: true,
  },
  {
    id: 'enterprise' as const,
    kind: 'text' as const,
    bullets: ['b1', 'b2', 'b3'] as const,
    highlight: false,
  },
]

const faqKeys = ['seatAddons', 'annualCommit', 'sso'] as const
</script>
