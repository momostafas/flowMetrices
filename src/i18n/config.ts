import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'

export const SUPPORTED_LOCALES = ['en', 'ar', 'fr', 'de'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export function isAppLocale(value: string): value is AppLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function createAppI18n(
  messages: Record<AppLocale, Record<string, unknown>>,
): I18n {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: messages as never,
    datetimeFormats: {
      en: { long: { dateStyle: 'long' } },
      ar: { long: { dateStyle: 'long', calendar: 'gregory' } },
      fr: { long: { dateStyle: 'long' } },
      de: { long: { dateStyle: 'long' } },
    },
    numberFormats: {
      en: { currency: { style: 'currency', currency: 'USD' } },
      ar: {
        currency: {
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'narrowSymbol',
          numberingSystem: 'latn',
        } as Intl.NumberFormatOptions,
      },
      fr: { currency: { style: 'currency', currency: 'EUR' } },
      de: { currency: { style: 'currency', currency: 'EUR' } },
    },
  })
}
