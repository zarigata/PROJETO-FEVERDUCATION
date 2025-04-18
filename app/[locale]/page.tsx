import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { School, BookOpen, Users, Lightbulb, ArrowRight, ChevronRight } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ModeToggle } from "@/components/mode-toggle"
import { getTranslation } from "@/app/i18n/server"
import type { Locale } from "@/app/i18n/server"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default function Home({ params }: { params: { locale: Locale } }) {
  const t = getTranslation(params.locale)

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/50 border-b border-border">
          <div className="container mx-auto flex justify-between items-center py-4">
            <h1 className="text-2xl font-semibold">{t.common.appName}</h1>
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <ModeToggle />
              <Button asChild variant="ghost" className="rounded-full">
                <Link href={`/${params.locale}/login`}>{t.common.login}</Link>
              </Button>
              <Button asChild className="apple-button">
                <Link href={`/${params.locale}/signup`}>{t.common.signup}</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background"></div>
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="max-w-xl animate-slide-up">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 text-transparent bg-clip-text">
                  {t.home.hero.title}
                </h1>
                <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">{t.home.hero.subtitle}</p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild className="apple-button">
                    <Link href={`/${params.locale}/signup`}>{t.common.getStarted}</Link>
                  </Button>
                  <Button asChild variant="outline" className="apple-button-secondary">
                    <Link href="#features">{t.common.learnMore}</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center animate-fade-in">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-30 dark:opacity-40"></div>
                  <div className="glass-card rounded-3xl overflow-hidden p-1">
                    <img
                      src="/placeholder.svg?height=500&width=600"
                      alt="Education Platform"
                      className="rounded-2xl w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white dark:bg-black/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">{t.home.features.title}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover how our platform transforms the educational experience with innovative tools and features.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<School className="h-10 w-10 text-blue-500 dark:text-blue-400" />}
                title={t.home.features.teacherDashboard}
                description={t.home.features.teacherDashboardDesc}
              />
              <FeatureCard
                icon={<BookOpen className="h-10 w-10 text-blue-500 dark:text-blue-400" />}
                title={t.home.features.studentPortal}
                description={t.home.features.studentPortalDesc}
              />
              <FeatureCard
                icon={<Lightbulb className="h-10 w-10 text-blue-500 dark:text-blue-400" />}
                title={t.home.features.aiGenerator}
                description={t.home.features.aiGeneratorDesc}
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-blue-500 dark:text-blue-400" />}
                title={t.home.features.aiTutor}
                description={t.home.features.aiTutorDesc}
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from educators and students who have transformed their teaching and learning experience.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="This platform has completely transformed how I prepare and deliver my lessons. The AI tools save me hours of work every week."
                author="Sarah Johnson"
                role="High School Teacher"
                image="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="As a student, I love how easy it is to access all my courses and assignments in one place. The AI tutor has been incredibly helpful."
                author="Michael Chen"
                role="University Student"
                image="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="The analytics provided by this platform give me valuable insights into student performance that I never had access to before."
                author="David Rodriguez"
                role="School Administrator"
                image="/placeholder.svg?height=100&width=100"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-900 dark:to-cyan-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">{t.home.cta.title}</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">{t.home.cta.subtitle}</p>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg font-medium"
            >
              <Link href={`/${params.locale}/signup`}>
                {t.home.cta.button}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">{t.common.appName}</h3>
                <p className="text-muted-foreground">{t.home.footer.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">{t.home.footer.quickLinks}</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {t.home.footer.about}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {t.home.footer.features}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {t.home.footer.pricing}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {t.home.footer.contact}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">{t.home.footer.contactUs}</h3>
                <p className="text-muted-foreground mb-4">
                  Email: support@fevereducation.com
                  <br />
                  Phone: (123) 456-7890
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-muted-foreground">
              <p>
                &copy; {new Date().getFullYear()} {t.common.appName}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-5px]">
      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent">
        Learn more <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
  image,
}: { quote: string; author: string; role: string; image: string }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img src={image || "/placeholder.svg"} alt={author} className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="italic text-muted-foreground">"{quote}"</p>
    </div>
  )
}
