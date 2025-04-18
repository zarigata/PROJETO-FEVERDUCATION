"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/app/i18n/client"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ModeToggle } from "@/components/mode-toggle"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { setCookie } from "cookies-next"

export default function LoginPage() {
  const router = useRouter()
  const { locale, t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("teacher")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Set authentication cookies
      setCookie("authenticated", "true", { maxAge: 60 * 60 * 24 }) // 1 day
      setCookie("userType", role, { maxAge: 60 * 60 * 24 }) // 1 day

      // Redirect based on role
      if (role === "teacher") {
        router.push(`/${locale}/teacher/dashboard`)
      } else {
        router.push(`/${locale}/student/dashboard`)
      }
    } catch (err) {
      setError("Failed to login. Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <Link
              href={`/${locale}`}
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.common.back}
            </Link>
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <ModeToggle />
            </div>
          </div>

          <Card className="w-full shadow-apple dark:shadow-apple-dark border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 text-white rounded-t-xl pb-6">
              <CardTitle className="text-2xl">{t.auth.login.title}</CardTitle>
              <CardDescription className="text-white/80">{t.auth.login.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="teacher" className="w-full" onValueChange={setRole}>
                <TabsList className="grid w-full grid-cols-2 mb-6 rounded-full">
                  <TabsTrigger value="teacher" className="rounded-full">
                    {t.auth.login.teacher}
                  </TabsTrigger>
                  <TabsTrigger value="student" className="rounded-full">
                    {t.auth.login.student}
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleLogin}>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.common.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="apple-input"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">{t.common.password}</Label>
                        <Link href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                          {t.common.forgotPassword}
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="apple-input"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-6 apple-button" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Signing in...
                      </>
                    ) : (
                      t.common.signIn
                    )}
                  </Button>
                </form>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-6">
              <p className="text-sm text-muted-foreground">
                {t.common.dontHaveAccount}{" "}
                <Link
                  href={`/${locale}/signup`}
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {t.common.signUp}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  )
}
