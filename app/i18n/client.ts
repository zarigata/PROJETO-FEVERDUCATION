"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getCookie, setCookie } from "cookies-next"

import en from "./locales/en.json"
import ja from "./locales/ja.json"
import pt from "./locales/pt.json"
import type { Translation } from "@/hooks/use-language"

export type Locale = "en" | "ja" | "pt"

// Ensure all translations have the required fields
const translations: Record<Locale, any> = {
  en,
  ja,
  pt,
}

type LanguageContextType = {
  locale: Locale
  t: Translation
  changeLocale: (locale: Locale) => void
  isLoading: boolean
}

// Create the context with a default value
const defaultContext: LanguageContextType = {
  locale: "en",
  t: translations.en as Translation,
  changeLocale: () => {},
  isLoading: true,
}

export const LanguageContext = createContext<LanguageContextType>(defaultContext)

// Safe hook that provides the language context
export const useLanguage = () => {
  return useContext(LanguageContext)
}

export const LanguageProvider = ({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale?: string
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocale] = useState<Locale>(
    initialLocale && ["en", "ja", "pt"].includes(initialLocale) ? (initialLocale as Locale) : "en",
  )
  const [t, setT] = useState<Translation>(translations[locale] as Translation)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get locale from cookie or default to current locale
    const savedLocale = getCookie("locale") as Locale | undefined

    // Try to get locale from URL if not provided as prop
    const urlLocale = !initialLocale && pathname ? (pathname.split("/")[1] as Locale) : null

    let newLocale: Locale = locale

    if (savedLocale && translations[savedLocale]) {
      newLocale = savedLocale
    } else if (urlLocale && translations[urlLocale]) {
      newLocale = urlLocale
      setCookie("locale", urlLocale, { maxAge: 60 * 60 * 24 * 30 }) // 30 days
    }

    setLocale(newLocale)
    setT(translations[newLocale] as Translation)
    setIsLoading(false)

    // Handle direct access to routes without locale
    if (pathname && !pathname.match(/^\/(en|ja|pt)/) && !isLoading) {
      router.push(`/${newLocale}${pathname}`)
    }
  }, [pathname, router, isLoading, initialLocale, locale])

  const changeLocale = (newLocale: Locale) => {
    if (translations[newLocale]) {
      setLocale(newLocale)
      setT(translations[newLocale] as Translation)
      setCookie("locale", newLocale, { maxAge: 60 * 60 * 24 * 30 }) // 30 days

      // Update URL to reflect the new locale
      if (pathname) {
        const segments = pathname.split("/")
        if (segments.length > 1 && (segments[1] === "en" || segments[1] === "ja" || segments[1] === "pt")) {
          segments[1] = newLocale
        } else {
          segments.splice(1, 0, newLocale)
        }
        router.push(segments.join("/"))
      }
    }
  }

  return <LanguageContext.Provider value={{ locale, t, changeLocale, isLoading }}>{children}</LanguageContext.Provider>
}
