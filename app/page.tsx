// Add a root page that redirects to the default locale
import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { School, BookOpen, Users, Lightbulb, ArrowRight } from "lucide-react"

export default function RootPage() {
  // Get locale from cookie or Accept-Language header
  let locale = "en" // Default locale

  const cookieStore = cookies()
  const localeCookie = cookieStore.get("locale")?.value

  if (localeCookie && ["en", "ja", "pt"].includes(localeCookie)) {
    locale = localeCookie
  } else {
    const headersList = headers()
    const acceptLanguage = headersList.get("Accept-Language") || ""

    if (acceptLanguage.includes("ja")) locale = "ja"
    else if (acceptLanguage.includes("pt")) locale = "pt"
  }

  // Redirect to the localized home page
  redirect(`/${locale}`)
}

export function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#121212]">
      {/* Header */}
      <header className="bg-[#6200ee] dark:bg-[#bb86fc] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EduDroid</h1>
          <div className="space-x-2">
            <Button asChild variant="ghost" className="text-white hover:bg-[#3700b3]/20">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-[#03dac6] text-[#000000] hover:bg-[#03dac6]/90">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#3700b3] dark:text-[#bb86fc] mb-4">
              Modern Education Platform
            </h1>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              An Android-inspired teaching platform designed for both teachers and students, featuring AI-powered tools
              and comprehensive analytics.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-[#6200ee] hover:bg-[#3700b3] text-white">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#6200ee] text-[#6200ee] hover:bg-[#6200ee]/10 dark:border-[#bb86fc] dark:text-[#bb86fc]"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/placeholder.svg?height=400&width=400"
              alt="Education Platform"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#3700b3] dark:text-[#bb86fc]">Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<School className="h-10 w-10 text-[#6200ee] dark:text-[#bb86fc]" />}
            title="Teacher Dashboard"
            description="Comprehensive analytics and classroom management tools for educators."
          />
          <FeatureCard
            icon={<BookOpen className="h-10 w-10 text-[#6200ee] dark:text-[#bb86fc]" />}
            title="Student Portal"
            description="Easy access to classes, assignments, and educational resources."
          />
          <FeatureCard
            icon={<Lightbulb className="h-10 w-10 text-[#6200ee] dark:text-[#bb86fc]" />}
            title="AI Class Generator"
            description="AI-powered tools to create engaging and personalized lesson plans."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-[#6200ee] dark:text-[#bb86fc]" />}
            title="AI Chatbot"
            description="Educational support chatbot to assist students with their learning."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#6200ee] dark:bg-[#3700b3] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Teaching Experience?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of educators and students already using our platform to enhance learning outcomes.
          </p>
          <Button asChild className="bg-[#03dac6] text-[#000000] hover:bg-[#03dac6]/90">
            <Link href="/signup">Sign Up Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121212] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EduDroid</h3>
              <p className="text-gray-400">A modern teaching platform with Android design principles.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-400">
                Email: info@edudroid.com
                <br />
                Phone: (123) 456-7890
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EduDroid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-white dark:bg-[#1e1e1e] border-none shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="mb-2">{icon}</div>
        <CardTitle className="text-xl text-[#3700b3] dark:text-[#bb86fc]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-700 dark:text-gray-300">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          className="text-[#6200ee] dark:text-[#bb86fc] p-0 hover:bg-transparent hover:text-[#3700b3] dark:hover:text-[#03dac6]"
        >
          Learn more <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
