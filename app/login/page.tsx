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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("teacher")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would authenticate with a backend
    // For demo purposes, we'll just redirect based on role
    if (role === "teacher") {
      router.push("/teacher/dashboard")
    } else {
      router.push("/student/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#121212] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center text-[#6200ee] dark:text-[#bb86fc] mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Card className="w-full shadow-lg border-none">
          <CardHeader className="bg-[#6200ee] dark:bg-[#bb86fc] text-white rounded-t-lg">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-white/80">Sign in to your EduDroid account</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="teacher" className="w-full" onValueChange={setRole}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
                <TabsTrigger value="student">Student</TabsTrigger>
              </TabsList>

              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-[#6200ee]/30 focus-visible:ring-[#6200ee] dark:border-[#bb86fc]/30 dark:focus-visible:ring-[#bb86fc]"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="#" className="text-sm text-[#6200ee] dark:text-[#bb86fc] hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-[#6200ee]/30 focus-visible:ring-[#6200ee] dark:border-[#bb86fc]/30 dark:focus-visible:ring-[#bb86fc]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-[#6200ee] hover:bg-[#3700b3] dark:bg-[#bb86fc] dark:text-[#121212] dark:hover:bg-[#bb86fc]/90"
                >
                  Sign In
                </Button>
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#6200ee] dark:text-[#bb86fc] hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
