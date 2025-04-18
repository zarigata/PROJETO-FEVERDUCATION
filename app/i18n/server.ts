import { cookies, headers } from "next/headers"

import en from "./locales/en.json"
import ja from "./locales/ja.json"
import pt from "./locales/pt.json"

export type Locale = "en" | "ja" | "pt"
export type Translation = typeof en

const translations: Record<Locale, Translation> = {
  en,
  ja,
  pt,
}

export function getTranslation(locale: Locale = "en"): Translation {
  return translations[locale] || translations.en
}

export function getLocaleFromRequest(): Locale {
  // Try to get locale from cookie
  const cookieStore = cookies()
  const localeCookie = cookieStore.get("locale")?.value as Locale | undefined

  if (localeCookie && translations[localeCookie]) {
    return localeCookie
  }

  // Try to get locale from Accept-Language header
  const headersList = headers()
  const acceptLanguage = headersList.get("Accept-Language")

  if (acceptLanguage) {
    if (acceptLanguage.includes("ja")) return "ja"
    if (acceptLanguage.includes("pt")) return "pt"
  }

  return "en"
}
