<template>
  <div ref="rootEl" class="relative">
    <label class="sr-only" :for="buttonId">{{ t('common.langSwitcher.label') }}</label>
    <button
      :id="buttonId"
      type="button"
      class="group flex min-w-[10.5rem] items-center justify-between gap-2 rounded-xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 px-3 py-2 text-left text-sm font-medium text-slate-800 shadow-sm ring-brand-500/0 transition hover:border-brand-200 hover:shadow-md hover:ring-2 hover:ring-brand-500/15 focus-visible:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/35"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      @click.stop="open = !open"
    >
      <span class="flex min-w-0 flex-1 items-center gap-2.5">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg leading-none shadow-inner ring-1 ring-slate-200/80 transition group-hover:bg-white group-hover:ring-brand-200/60"
          aria-hidden="true"
        >
          {{ current.flag }}
        </span>
        <span class="truncate">{{ current.label }}</span>
      </span>
      <svg
        class="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-brand-600"
        :class="{ 'rotate-180 text-brand-600': open }"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="scale-95 opacity-0 -translate-y-0.5"
      enter-to-class="scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="scale-100 opacity-100 translate-y-0"
      leave-to-class="scale-95 opacity-0 -translate-y-0.5"
    >
      <ul
        v-show="open"
        :id="listboxId"
        role="listbox"
        class="absolute end-0 z-50 mt-2 min-w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white py-1 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5"
        tabindex="-1"
      >
        <li v-for="opt in options" :key="opt.code" role="presentation">
          <button
            type="button"
            role="option"
            class="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-brand-50 hover:text-brand-900"
            :class="
              opt.code === locale
                ? 'bg-brand-50/80 font-semibold text-brand-900'
                : 'font-medium'
            "
            :aria-selected="opt.code === locale"
            @click="select(opt.code)"
          >
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[1.125rem] leading-none ring-1 ring-slate-200/70"
              aria-hidden="true"
            >
              {{ opt.flag }}
            </span>
            <span class="min-w-0 flex-1 truncate">{{ opt.label }}</span>
            <svg
              v-if="opt.code === locale"
              class="h-4 w-4 shrink-0 text-brand-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { SUPPORTED_LOCALES, type AppLocale } from '@/i18n/config'

const FLAG_BY_LOCALE: Record<AppLocale, string> = {
  en: '🇺🇸',
  ar: '🇸🇦',
  fr: '🇫🇷',
  de: '🇩🇪',
}

const LABEL_KEY_BY_LOCALE: Record<AppLocale, string> = {
  en: 'common.langSwitcher.en',
  ar: 'common.langSwitcher.ar',
  fr: 'common.langSwitcher.fr',
  de: 'common.langSwitcher.de',
}

const props = defineProps<{
  locale: AppLocale
}>()

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const uid = Math.random().toString(36).slice(2, 9)
const buttonId = `lang-switcher-${uid}`
const listboxId = `lang-listbox-${uid}`

const options = computed(() =>
  SUPPORTED_LOCALES.map((code) => ({
    code,
    flag: FLAG_BY_LOCALE[code],
    label: t(LABEL_KEY_BY_LOCALE[code]),
  })),
)

const current = computed(() => {
  const code = props.locale
  return {
    code,
    flag: FLAG_BY_LOCALE[code],
    label: t(LABEL_KEY_BY_LOCALE[code]),
  }
})

function select(next: AppLocale) {
  open.value = false
  if (next === props.locale) return
  router.push({
    name: route.name as 'home' | 'features' | 'pricing' | 'contact',
    params: { ...route.params, locale: next },
  })
}

function onDocPointerDown(e: MouseEvent | PointerEvent) {
  const el = rootEl.value
  if (!el || el.contains(e.target as Node)) return
  open.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointerDown, true)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointerDown, true)
  document.removeEventListener('keydown', onKeydown)
})
</script>
