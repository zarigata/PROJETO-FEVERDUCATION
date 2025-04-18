"use client"

import { useRouter } from "next/navigation"
import { useLanguage } from "@/app/i18n/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSafeToast } from "@/hooks/use-safe-toast"
import { User, Settings, HelpCircle, LogOut } from "lucide-react"

export function UserNav() {
  const router = useRouter()
  const { addToast } = useSafeToast()

  // Safe access to language context
  const langContext = useLanguage()
  const locale = langContext?.locale || "en"
  let t: any = {
    common: {
      profile: "Profile",
      settings: "Settings",
      help: "Help & Support",
      logout: "Log out",
    },
  }

  if (langContext?.t) {
    t = langContext.t
  }

  const handleLogout = () => {
    addToast("Successfully logged out", "success")
    router.push(`/${locale}/login`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Ms. Johnson" />
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">MJ</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Ms. Johnson</p>
            <p className="text-xs leading-none text-muted-foreground">johnson@school.edu</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>{t.common.profile}</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t.common.settings}</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>{t.common.help}</span>
            <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t.common.logout}</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
