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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useLanguage } from "@/app/i18n/client"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ModeToggle } from "@/components/mode-toggle"

export default function SignupPage() {
  const router = useRouter()
  const { locale, t } = useLanguage()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("teacher")

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would register with a backend
    // For demo purposes, we'll just redirect based on role
    if (role === "teacher") {
      router.push(`/${locale}/teacher/dashboard`)
    } else {
      router.push(`/${locale}/student/dashboard`)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#121212] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <Link href={`/${locale}`} className="flex items-center text-[#6200ee] dark:text-[#bb86fc] hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.common.back}
          </Link>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <ModeToggle />
          </div>
        </div>

        <Card className="w-full shadow-lg border-none">
          <CardHeader className="bg-[#6200ee] dark:bg-[#bb86fc] text-white rounded-t-lg">
            <CardTitle className="text-2xl">{t.auth.signup.title}</CardTitle>
            <CardDescription className="text-white/80">{t.auth.signup.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="teacher" className="w-full" onValueChange={setRole}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="teacher">{t.auth.signup.teacher}</TabsTrigger>
                <TabsTrigger value="student">{t.auth.signup.student}</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSignup}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.common.fullName}</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="border-[#6200ee]/30 focus-visible:ring-[#6200ee] dark:border-[#bb86fc]/30 dark:focus-visible:ring-[#bb86fc]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.common.email}</Label>
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
                    <Label htmlFor="password">{t.common.password}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-[#6200ee]/30 focus-visible:ring-[#6200ee] dark:border-[#bb86fc]/30 dark:focus-visible:ring-[#bb86fc]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t.common.confirmPassword}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border-[#6200ee]/30 focus-visible:ring-[#6200ee] dark:border-[#bb86fc]/30 dark:focus-visible:ring-[#bb86fc]"
                    />
                  </div>

                  {role === "teacher" && (
                    <div className="space-y-2">
                      <Label>{t.auth.signup.subjectArea}</Label>
                      <RadioGroup defaultValue="math">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="math" id="math" />
                          <Label htmlFor="math">{t.auth.signup.math}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="science" id="science" />
                          <Label htmlFor="science">{t.auth.signup.science}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="language" id="language" />
                          <Label htmlFor="language">{t.auth.signup.language}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">{t.auth.signup.other}</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {role === "student" && (
                    <div className="space-y-2">
                      <Label htmlFor="grade">{t.auth.signup.gradeLevel}</Label>
                      <select
                        id="grade"
                        className="w-full rounded-md border border-[#6200ee]/30 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200ee] dark:border-[#bb86fc]/30 dark:focus:ring-[#bb86fc]"
                      >
                        <option value="">{t.auth.signup.selectGrade}</option>
                        <option value="elementary">{t.auth.signup.elementary}</option>
                        <option value="middle">{t.auth.signup.middle}</option>
                        <option value="high">{t.auth.signup.high}</option>
                        <option value="college">{t.auth.signup.college}</option>
                      </select>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-[#6200ee] hover:bg-[#3700b3] dark:bg-[#bb86fc] dark:text-[#121212] dark:hover:bg-[#bb86fc]/90"
                >
                  {t.common.signUp}
                </Button>
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.common.alreadyHaveAccount}{" "}
              <Link href={`/${locale}/login`} className="text-[#6200ee] dark:text-[#bb86fc] hover:underline">
                {t.common.signIn}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
