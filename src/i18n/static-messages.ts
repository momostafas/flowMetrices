import type { AppLocale } from './config'
import en from '../locales/en.json'
import ar from '../locales/ar.json'
import fr from '../locales/fr.json'
import de from '../locales/de.json'

export const staticLocaleMessages: Record<AppLocale, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  ar: ar as Record<string, unknown>,
  fr: fr as Record<string, unknown>,
  de: de as Record<string, unknown>,
}
