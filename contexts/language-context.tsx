"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "pt-BR"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// English translations
const enTranslations: Record<string, string> = {
  // Common
  "app.name": "FeverDucation",
  "app.description": "Revolutionary AI-powered teaching platform for teachers and students",

  // Navigation
  "nav.home": "Home",
  "nav.dashboard": "Dashboard",
  "nav.classes": "Classes",
  "nav.students": "Students",
  "nav.generator": "Class Generator",
  "nav.homework": "Homework Builder",
  "nav.settings": "Settings",
  "nav.myClasses": "My Classes",
  "nav.quizzes": "Quizzes",
  "nav.aiTutor": "AI Tutor",
  "nav.profile": "Profile",

  // Modes
  "mode.teacher": "Teacher Mode",
  "mode.student": "Student Mode",

  // Dashboard
  "dashboard.welcome": "Welcome back",
  "dashboard.scheduleClass": "Schedule Class",
  "dashboard.createClass": "Create New Class",
  "dashboard.aiInsights": "AI Insights",
  "dashboard.overview": "Overview",
  "dashboard.analytics": "Analytics",
  "dashboard.schedule": "Schedule",
  "dashboard.totalClasses": "Total Classes",
  "dashboard.totalStudents": "Total Students",
  "dashboard.avgEngagement": "Avg. Engagement",
  "dashboard.hoursTaught": "Hours Taught",
  "dashboard.studentPerformance": "Student Performance",
  "dashboard.upcomingClasses": "Upcoming Classes",

  // Language
  "language.select": "Select Language",
  "language.en": "English",
  "language.pt-BR": "Portuguese (Brazil)",
}

// Brazilian Portuguese translations
const ptBRTranslations: Record<string, string> = {
  // Common
  "app.name": "FeverDucation",
  "app.description": "Plataforma revolucionária de ensino com IA para professores e alunos",

  // Navigation
  "nav.home": "Início",
  "nav.dashboard": "Painel",
  "nav.classes": "Aulas",
  "nav.students": "Alunos",
  "nav.generator": "Gerador de Aulas",
  "nav.homework": "Criador de Tarefas",
  "nav.settings": "Configurações",
  "nav.myClasses": "Minhas Aulas",
  "nav.quizzes": "Questionários",
  "nav.aiTutor": "Tutor de IA",
  "nav.profile": "Perfil",

  // Modes
  "mode.teacher": "Modo Professor",
  "mode.student": "Modo Aluno",

  // Dashboard
  "dashboard.welcome": "Bem-vindo(a) de volta",
  "dashboard.scheduleClass": "Agendar Aula",
  "dashboard.createClass": "Criar Nova Aula",
  "dashboard.aiInsights": "Insights de IA",
  "dashboard.overview": "Visão Geral",
  "dashboard.analytics": "Análises",
  "dashboard.schedule": "Agenda",
  "dashboard.totalClasses": "Total de Aulas",
  "dashboard.totalStudents": "Total de Alunos",
  "dashboard.avgEngagement": "Engajamento Médio",
  "dashboard.hoursTaught": "Horas Lecionadas",
  "dashboard.studentPerformance": "Desempenho dos Alunos",
  "dashboard.upcomingClasses": "Próximas Aulas",

  // Language
  "language.select": "Selecionar Idioma",
  "language.en": "Inglês",
  "language.pt-BR": "Português (Brasil)",
}

const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  "pt-BR": ptBRTranslations,
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "pt-BR")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
