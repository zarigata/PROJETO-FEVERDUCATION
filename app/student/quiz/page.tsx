"use client"

import { useState } from "react"
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, Clock, Award, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function StudentQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(5).fill(""))
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds

  // Sample quiz data
  const quizData = {
    title: "Photosynthesis Quiz",
    description: "Test your knowledge of photosynthesis",
    timeLimit: "5 minutes",
    questions: [
      {
        id: 1,
        question: "What is the primary pigment involved in photosynthesis?",
        options: [
          { id: "a", text: "Chlorophyll" },
          { id: "b", text: "Melanin" },
          { id: "c", text: "Carotene" },
          { id: "d", text: "Xanthophyll" },
        ],
        correctAnswer: "a",
      },
      {
        id: 2,
        question: "Which of the following is NOT a product of photosynthesis?",
        options: [
          { id: "a", text: "Oxygen" },
          { id: "b", text: "Glucose" },
          { id: "c", text: "Carbon dioxide" },
          { id: "d", text: "ATP" },
        ],
        correctAnswer: "c",
      },
      {
        id: 3,
        question: "Where does the light-dependent reaction of photosynthesis take place?",
        options: [
          { id: "a", text: "Stroma" },
          { id: "b", text: "Thylakoid membrane" },
          { id: "c", text: "Cell wall" },
          { id: "d", text: "Mitochondria" },
        ],
        correctAnswer: "b",
      },
      {
        id: 4,
        question: "What is the role of water in photosynthesis?",
        options: [
          { id: "a", text: "It provides carbon atoms" },
          { id: "b", text: "It provides electrons and hydrogen ions" },
          { id: "c", text: "It is the final electron acceptor" },
          { id: "d", text: "It is converted directly into glucose" },
        ],
        correctAnswer: "b",
      },
      {
        id: 5,
        question: "Which of the following is required for photosynthesis to occur?",
        options: [
          { id: "a", text: "Darkness" },
          { id: "b", text: "Oxygen" },
          { id: "c", text: "Light energy" },
          { id: "d", text: "Nitrogen" },
        ],
        correctAnswer: "c",
      },
    ],
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = value
    setSelectedAnswers(newAnswers)
  }

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true)
  }

  const calculateScore = () => {
    let score = 0
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++
      }
    })
    return score
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / quizData.questions.length) * 100
  }

  const isAnswered = (questionIndex: number) => {
    return selectedAnswers[questionIndex] !== ""
  }

  const isAllAnswered = () => {
    return selectedAnswers.every((answer) => answer !== "")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{quizData.title}</h1>
          <p className="text-muted-foreground">{quizData.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">
            Question {currentQuestion + 1} of {quizData.questions.length}
          </span>
          <span className="text-sm font-medium">{getProgressPercentage().toFixed(0)}% Complete</span>
        </div>
        <Progress value={getProgressPercentage()} className="h-2" />
      </div>

      {!quizSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Question {currentQuestion + 1}: {quizData.questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswers[currentQuestion]}
              onValueChange={handleAnswerSelect}
              className="space-y-4"
            >
              {quizData.questions[currentQuestion].options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                  <Label
                    htmlFor={`option-${option.id}`}
                    className="flex-1 cursor-pointer rounded-md p-2 hover:bg-muted"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              {currentQuestion < quizData.questions.length - 1 ? (
                <Button onClick={handleNextQuestion} disabled={!isAnswered(currentQuestion)}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmitQuiz} disabled={!isAllAnswered()}>
                  Submit Quiz
                </Button>
              )}
            </div>

            <div className="flex gap-1">
              {quizData.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "outline"}
                  size="icon"
                  className={`h-8 w-8 ${
                    isAnswered(index) && currentQuestion !== index ? "border-primary bg-primary/10" : ""
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Results</CardTitle>
              <CardDescription>
                You scored {calculateScore()} out of {quizData.questions.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {Math.round((calculateScore() / quizData.questions.length) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Score</div>
                    </div>
                  </div>
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="10"
                      strokeDasharray={`${(calculateScore() / quizData.questions.length) * 283} 283`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-4">
                {quizData.questions.map((question, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">Question {index + 1}</div>
                        <div>{question.question}</div>
                      </div>
                      {selectedAnswers[index] === question.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>

                    <div className="mt-2 space-y-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className={`rounded-md p-2 ${
                            option.id === question.correctAnswer
                              ? "bg-green-100 dark:bg-green-900/20"
                              : option.id === selectedAnswers[index] && option.id !== question.correctAnswer
                                ? "bg-red-100 dark:bg-red-900/20"
                                : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`mr-2 flex h-6 w-6 items-center justify-center rounded-full ${
                                option.id === question.correctAnswer
                                  ? "bg-green-500 text-white"
                                  : option.id === selectedAnswers[index] && option.id !== question.correctAnswer
                                    ? "bg-red-500 text-white"
                                    : "bg-muted"
                              }`}
                            >
                              {option.id.toUpperCase()}
                            </div>
                            <span>{option.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                View Detailed Analysis
              </Button>
              <Button>
                <Award className="mr-2 h-4 w-4" />
                Back to Classes
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
