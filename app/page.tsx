"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, User, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Logo } from "@/components/logo"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("teacher")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      // Redirect based on user type
      if (userType === "teacher") {
        router.push("/teacher/dashboard")
      } else {
        router.push("/student/classes")
      }
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo size="lg" className="mb-4" />
        <h1 className="mb-2 text-4xl font-bold gradient-text">FeverDucation</h1>
        <p className="max-w-md text-muted-foreground">The AI-powered teaching platform that revolutionizes education</p>
      </div>

      <Card className="w-full max-w-md scale-effect" hover>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>I am a:</Label>
              <RadioGroup
                defaultValue="teacher"
                value={userType}
                onValueChange={setUserType}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="teacher"
                    id="teacher"
                    className="border-primary text-primary focus:ring-primary/20"
                  />
                  <Label htmlFor="teacher" className="cursor-pointer">
                    Teacher
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="student"
                    id="student"
                    className="border-primary text-primary focus:ring-primary/20"
                  />
                  <Label htmlFor="student" className="cursor-pointer">
                    Student
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full group"
              disabled={isLoading}
              variant={isLoading ? "default" : "gradient"}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors">
                Forgot your password?
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Demo credentials:</p>
        <p>Email: demo@fevereducation.com | Password: password</p>
      </div>
    </div>
  )
}
