"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Define the Translation type
export type Translation = {
  common: {
    appName: string
    dashboard: string
    students: string
    classes: string
    schedule: string
    aiGenerator: string
    aiTutor: string
    settings: string
    profile: string
    logout: string
    signIn: string
    signUp: string
    email: string
    password: string
    forgotPassword: string
    dontHaveAccount: string
    back: string
    resources: string
    reports: string
    analytics: string
    assignments: string
    help: string
  }
  auth: {
    login: {
      title: string
      subtitle: string
      teacher: string
      student: string
    }
    signup: {
      title: string
      subtitle: string
      teacher: string
      student: string
    }
  }
  teacher: {
    dashboard: {
      title: string
      welcome: string
      overview: string
      analytics: string
      classes: string
      recentActivity: string
      upcomingClasses: string
      studentProgress: string
      quickActions: string
      createClass: string
      addStudent: string
      createAssignment: string
      generateLesson: string
      stats: {
        activeStudents: string
        completedAssignments: string
        averageScore: string
        classesThisWeek: string
      }
      timeframes: {
        day: string
        week: string
        month: string
        year: string
      }
    }
    students: {
      title: string
      searchPlaceholder: string
      addStudent: string
      name: string
      progress: string
      lastActive: string
      actions: string
      viewProfile: string
      sendMessage: string
    }
    aiGenerator: {
      title: string
      subtitle: string
      createContent: string
      selectOptions: string
      lessonPlan: string
      quiz: string
      feedback: string
      lessonType: string
      gradeLevel: string
      subject: string
      topic: string
      topicPlaceholder: string
      quizTopic: string
      quizTopicPlaceholder: string
      questionCount: string
      difficulty: string
      studentWork: string
      studentWorkPlaceholder: string
      feedbackType: string
      generate: string
      generating: string
      generatedContent: string
      contentDescription: string
      noContent: string
      copy: string
      save: string
      regenerate: string
      saveToLibrary: string
      lessonTypes: {
        quiz: string
        worksheet: string
        presentation: string
        activity: string
        homework: string
      }
      gradeLevel: {
        elementary: string
        middle: string
        high: string
        college: string
      }
      subjects: {
        math: string
        science: string
        language: string
        history: string
        art: string
        music: string
        physical_education: string
      }
      difficulties: {
        easy: string
        medium: string
        hard: string
      }
      feedbackTypes: {
        constructive: string
        detailed: string
        simple: string
        encouraging: string
      }
    }
  }
  student: {
    dashboard: {
      title: string
      welcome: string
      overview: string
      progress: string
      assignments: string
      upcomingClasses: string
      recentActivity: string
      quickActions: string
      joinClass: string
      startAssignment: string
      practiceSession: string
      askAITutor: string
      stats: {
        completedAssignments: string
        averageScore: string
        streak: string
        hoursStudied: string
      }
      timeframes: {
        day: string
        week: string
        month: string
        year: string
      }
    }
  }
  error: string
  success: string
  error_boundary: {
    something_went_wrong: string
  }
  ai_generator: {
    topic_required: string
    student_work_required: string
    generation_success: string
    generation_error: string
    copied_to_clipboard: string
    saved_successfully: string
  }
}

// Default translations to use when the context is not available
const defaultTranslation: Translation = {
  common: {
    appName: "FeverEducation",
    dashboard: "Dashboard",
    students: "Students",
    classes: "Classes",
    schedule: "Schedule",
    aiGenerator: "AI Generator",
    aiTutor: "AI Tutor",
    settings: "Settings",
    profile: "Profile",
    logout: "Log out",
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    dontHaveAccount: "Don't have an account?",
    back: "Back",
    resources: "Resources",
    reports: "Reports",
    analytics: "Analytics",
    assignments: "Assignments",
    help: "Help & Support",
  },
  auth: {
    login: {
      title: "Welcome Back",
      subtitle: "Sign in to your account",
      teacher: "Teacher",
      student: "Student",
    },
    signup: {
      title: "Create Account",
      subtitle: "Sign up for a new account",
      teacher: "Teacher",
      student: "Student",
    },
  },
  teacher: {
    dashboard: {
      title: "Teacher Dashboard",
      welcome: "Welcome back",
      overview: "Overview",
      analytics: "Analytics",
      classes: "Classes",
      recentActivity: "Recent Activity",
      upcomingClasses: "Upcoming Classes",
      studentProgress: "Student Progress",
      quickActions: "Quick Actions",
      createClass: "Create Class",
      addStudent: "Add Student",
      createAssignment: "Create Assignment",
      generateLesson: "Generate Lesson",
      stats: {
        activeStudents: "Active Students",
        completedAssignments: "Completed Assignments",
        averageScore: "Average Score",
        classesThisWeek: "Classes This Week",
      },
      timeframes: {
        day: "Day",
        week: "Week",
        month: "Month",
        year: "Year",
      },
    },
    students: {
      title: "Students",
      searchPlaceholder: "Search students...",
      addStudent: "Add Student",
      name: "Student",
      progress: "Progress",
      lastActive: "Last Active",
      actions: "Actions",
      viewProfile: "View Profile",
      sendMessage: "Send Message",
    },
    aiGenerator: {
      title: "AI Content Generator",
      subtitle: "Generate educational content with AI",
      createContent: "Create Content",
      selectOptions: "Select options to generate educational content",
      lessonPlan: "Lesson Plan",
      quiz: "Quiz",
      feedback: "Feedback",
      lessonType: "Lesson Type",
      gradeLevel: "Grade Level",
      subject: "Subject",
      topic: "Topic",
      topicPlaceholder: "Enter a specific topic",
      quizTopic: "Quiz Topic",
      quizTopicPlaceholder: "Enter quiz topic",
      questionCount: "Number of Questions",
      difficulty: "Difficulty",
      studentWork: "Student Work",
      studentWorkPlaceholder: "Paste student work here",
      feedbackType: "Feedback Type",
      generate: "Generate Content",
      generating: "Generating...",
      generatedContent: "Generated Content",
      contentDescription: "Your AI-generated educational content will appear here",
      noContent: "No content generated yet. Configure options and click Generate.",
      copy: "Copy",
      save: "Save",
      regenerate: "Regenerate",
      saveToLibrary: "Save to Library",
      lessonTypes: {
        quiz: "Quiz",
        worksheet: "Worksheet",
        presentation: "Presentation",
        activity: "Activity",
        homework: "Homework",
      },
      gradeLevel: {
        elementary: "Elementary",
        middle: "Middle School",
        high: "High School",
        college: "College",
      },
      subjects: {
        math: "Mathematics",
        science: "Science",
        language: "Language Arts",
        history: "History",
        art: "Art",
        music: "Music",
        physical_education: "Physical Education",
      },
      difficulties: {
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
      },
      feedbackTypes: {
        constructive: "Constructive",
        detailed: "Detailed",
        simple: "Simple",
        encouraging: "Encouraging",
      },
    },
  },
  student: {
    dashboard: {
      title: "Student Dashboard",
      welcome: "Welcome back",
      overview: "Overview",
      progress: "Progress",
      assignments: "Assignments",
      upcomingClasses: "Upcoming Classes",
      recentActivity: "Recent Activity",
      quickActions: "Quick Actions",
      joinClass: "Join Class",
      startAssignment: "Start Assignment",
      practiceSession: "Practice Session",
      askAITutor: "Ask AI Tutor",
      stats: {
        completedAssignments: "Completed Assignments",
        averageScore: "Average Score",
        streak: "Day Streak",
        hoursStudied: "Hours Studied",
      },
      timeframes: {
        day: "Day",
        week: "Week",
        month: "Month",
        year: "Year",
      },
    },
  },
  error: "Error",
  success: "Success",
  error_boundary: {
    something_went_wrong: "Something went wrong",
  },
  ai_generator: {
    topic_required: "Topic is required",
    student_work_required: "Student work is required",
    generation_success: "Content generated successfully",
    generation_error: "Failed to generate content. Please try again.",
    copied_to_clipboard: "Copied to clipboard",
    saved_successfully: "Saved successfully",
  },
}

// Create a language context
export type LanguageContextType = {
  locale: string
  t: Translation
  changeLocale: (locale: string) => void
  isLoading: boolean
}

// Create a context with default values
export const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  t: defaultTranslation,
  changeLocale: () => {},
  isLoading: false,
})

// Original hook that directly uses the context
export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    console.warn("useLanguage must be used within a LanguageProvider, using default translations")
    return {
      locale: "en",
      t: defaultTranslation,
      changeLocale: () => {},
      isLoading: false,
    }
  }

  return context
}

// Safe hook that provides the language context with fallbacks
export function useSafeLanguage() {
  const context = useContext(LanguageContext)
  const [safeContext, setSafeContext] = useState<LanguageContextType>({
    locale: "en",
    t: defaultTranslation,
    changeLocale: () => {},
    isLoading: false,
  })

  useEffect(() => {
    try {
      if (!context) {
        console.warn("useLanguage must be used within a LanguageProvider, using default translations")
        return
      }
      setSafeContext(context)
    } catch (error) {
      console.error("Error in useSafeLanguage:", error)
    }
  }, [context])

  return safeContext
}
