import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Logo size="lg" className="mb-6" />

      <h1 className="mb-2 text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mb-8 text-muted-foreground">Oops! The page you're looking for doesn't exist.</p>

      <Button asChild variant="gradient" className="group">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </Button>
    </div>
  )
}
