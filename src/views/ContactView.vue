<template>
  <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
    <header class="max-w-3xl">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900">{{ t('contact.hero.title') }}</h1>
      <p class="mt-4 text-lg text-slate-600">{{ t('contact.hero.subtitle') }}</p>
    </header>

    <div class="mt-12 grid gap-10 lg:grid-cols-2">
      <div class="space-y-8">
        <article
          v-for="block in channelKeys"
          :key="block"
          class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 class="text-lg font-semibold text-slate-900">{{ t(`contact.channels.${block}.title`) }}</h2>
          <p class="mt-2 text-sm font-medium text-brand-700">{{ t(`contact.channels.${block}.body`) }}</p>
          <p class="mt-2 text-xs text-slate-500">{{ t(`contact.channels.${block}.hint`) }}</p>
        </article>
      </div>

      <form class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm" @submit.prevent="onSubmit">
        <h2 class="text-xl font-semibold text-slate-900">{{ t('contact.form.title') }}</h2>
        <div class="mt-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700" for="name">{{ t('contact.form.name') }}</label>
            <input
              id="name"
              v-model="name"
              name="name"
              type="text"
              autocomplete="name"
              required
              class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700" for="email">{{ t('contact.form.email') }}</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700" for="company">{{ t('contact.form.company') }}</label>
            <input
              id="company"
              v-model="company"
              name="company"
              type="text"
              autocomplete="organization"
              required
              class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700" for="message">{{ t('contact.form.message') }}</label>
            <textarea
              id="message"
              v-model="message"
              name="message"
              rows="4"
              required
              class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
        </div>
        <button
          type="submit"
          class="mt-6 w-full rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          {{ t('contact.form.submit') }}
        </button>
        <p v-if="sent" class="mt-4 text-sm font-medium text-emerald-700" role="status">
          {{ t('contact.form.success') }}
        </p>
        <p class="mt-4 text-xs text-slate-500">{{ t('contact.form.disclaimer') }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const channelKeys = ['sales', 'support', 'hq'] as const

const name = ref('')
const email = ref('')
const company = ref('')
const message = ref('')
const sent = ref(false)

function onSubmit() {
  sent.value = true
}
</script>
