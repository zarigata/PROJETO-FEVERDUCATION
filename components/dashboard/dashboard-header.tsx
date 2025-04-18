import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function DashboardHeader({ title, description, actions, className }: DashboardHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 pb-6 md:flex-row md:items-center md:justify-between", className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="mt-4 flex items-center md:mt-0">{actions}</div>}
    </div>
  )
}
