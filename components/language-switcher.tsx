"use client"
import { useContext } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { LanguageContext } from "@/app/i18n/client"

export function LanguageSwitcher() {
  // Safely access language context
  const langContext = useContext(LanguageContext)

  // If context is not available, provide a no-op function
  const changeLocale = langContext?.changeLocale || (() => {})

  // Default language names if translations are not available
  const languages = {
    en: langContext?.t?.common?.languages?.english || "English",
    ja: langContext?.t?.common?.languages?.japanese || "Japanese",
    pt: langContext?.t?.common?.languages?.portuguese || "Portuguese",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLocale("en")}>{languages.en}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale("ja")}>{languages.ja}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale("pt")}>{languages.pt}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
