"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useContext } from "react"
import { LanguageContext } from "@/app/i18n/client"

export function ModeToggle() {
  const { setTheme } = useTheme()

  // Safely access language context
  const langContext = useContext(LanguageContext)

  // Default translations if context is not available
  const lightText = langContext?.t?.common?.light || "Light"
  const darkText = langContext?.t?.common?.dark || "Dark"
  const systemText = langContext?.t?.common?.system || "System"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>{lightText}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>{darkText}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>{systemText}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
