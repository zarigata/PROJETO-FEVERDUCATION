import Link from "next/link"
import { GraduationCap, Zap } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const zapSizeClasses = {
    sm: "h-3 w-3 -right-1 -top-1",
    md: "h-4 w-4 -right-1 -top-1",
    lg: "h-6 w-6 -right-2 -top-2",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative">
        <GraduationCap className={`${sizeClasses[size]} text-primary transition-transform group-hover:scale-110`} />
        <Zap className={`absolute ${zapSizeClasses[size]} text-accent transition-all group-hover:rotate-12`} />
      </div>
      {showText && <span className={`${textSizeClasses[size]} font-bold gradient-text`}>FeverDucation</span>}
    </Link>
  )
}
