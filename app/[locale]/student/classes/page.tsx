"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/app/i18n/client"
import { useToast } from "@/components/ui/toast-provider"
import {
  Search,
  BookOpen,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  MoreHorizontal,
  Eye,
  FileText,
  MessageSquare,
  Star,
  StarOff,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample classes data
const initialClasses = [
  {
    id: 1,
    name: "Mathematics 101",
    description: "Introduction to Algebra and Calculus",
    teacher: "Ms. Johnson",
    schedule: "Mon, Wed, Fri - 9:00 AM",
    duration: "1h 30m",
    students: 28,
    progress: 65,
    nextClass: "Tomorrow, 9:00 AM",
    isFavorite: true,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    id: 2,
    name: "Science",
    description: "Biology, Chemistry and Physics",
    teacher: "Mr. Davis",
    schedule: "Tue, Thu - 11:00 AM",
    duration: "1h 30m",
    students: 24,
    progress: 42,
    nextClass: "Today, 11:00 AM",
    isFavorite: false,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
  {
    id: 3,
    name: "History",
    description: "World History and Civilizations",
    teacher: "Mrs. Wilson",
    schedule: "Mon, Wed - 2:00 PM",
    duration: "1h 30m",
    students: 30,
    progress: 78,
    nextClass: "Today, 2:00 PM",
    isFavorite: true,
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  },
  {
    id: 4,
    name: "English Literature",
    description: "Classic and Contemporary Literature",
    teacher: "Mr. Thompson",
    schedule: "Tue, Thu - 10:00 AM",
    duration: "1h 30m",
    students: 26,
    progress: 89,
    nextClass: "Thursday, 10:00 AM",
    isFavorite: false,
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
]

export default function StudentClassesPage() {
  const { t } = useLanguage()
  const { addToast } = useToast()

  const [classes, setClasses] = useState(initialClasses)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedClass, setSelectedClass] = useState<(typeof initialClasses)[0] | null>(null)
  const [isClassDetailsOpen, setIsClassDetailsOpen] = useState(false)

  // Filter classes based on search query and active tab
  const filteredClasses = classes.filter((cls) => {
    // Filter by search query
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by tab
    if (activeTab === "favorites") {
      return matchesSearch && cls.isFavorite
    }

    return matchesSearch
  })

  const toggleFavorite = (id: number) => {
    setClasses(classes.map((cls) => (cls.id === id ? { ...cls, isFavorite: !cls.isFavorite } : cls)))

    const cls = classes.find((c) => c.id === id)
    if (cls) {
      addToast(cls.isFavorite ? `Removed ${cls.name} from favorites` : `Added ${cls.name} to favorites`, "success")
    }
  }

  const viewClassDetails = (cls: (typeof initialClasses)[0]) => {
    setSelectedClass(cls)
    setIsClassDetailsOpen(true)
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.common?.classes || "My Classes"}</h1>
            <p className="text-muted-foreground">View and manage your enrolled classes</p>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search classes..."
              className="w-full md:w-[300px] pl-9 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredClasses.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No classes found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "No classes match your search criteria" : "You are not enrolled in any classes yet"}
                </p>
                <Button>Join a Class</Button>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredClasses.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    classData={cls}
                    onToggleFavorite={() => toggleFavorite(cls.id)}
                    onViewDetails={() => viewClassDetails(cls)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {filteredClasses.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8 text-center">
                <Star className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No favorite classes</h3>
                <p className="text-muted-foreground mb-4">Mark classes as favorites to see them here</p>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredClasses.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    classData={cls}
                    onToggleFavorite={() => toggleFavorite(cls.id)}
                    onViewDetails={() => viewClassDetails(cls)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Class Details Dialog */}
        <Dialog open={isClassDetailsOpen} onOpenChange={setIsClassDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedClass && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedClass.name}
                    {selectedClass.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                  </DialogTitle>
                  <DialogDescription>{selectedClass.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt={selectedClass.teacher} />
                      <AvatarFallback>
                        {selectedClass.teacher
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedClass.teacher}</p>
                      <p className="text-sm text-muted-foreground">Instructor</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Schedule</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p>{selectedClass.schedule}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p>{selectedClass.duration}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Students</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <p>{selectedClass.students} students</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Next Class</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p>{selectedClass.nextClass}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Course Progress</span>
                      <span className="font-medium">{selectedClass.progress}%</span>
                    </div>
                    <Progress value={selectedClass.progress} className="h-2" />
                  </div>
                </div>
                <DialogFooter className="flex justify-between items-center">
                  <Button variant="outline" className="gap-2" onClick={() => toggleFavorite(selectedClass.id)}>
                    {selectedClass.isFavorite ? (
                      <>
                        <StarOff className="h-4 w-4" />
                        Remove from Favorites
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4" />
                        Add to Favorites
                      </>
                    )}
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Contact Teacher
                    </Button>
                    <Button>Go to Class</Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

// Helper component for class cards
function ClassCard({
  classData,
  onToggleFavorite,
  onViewDetails,
}: {
  classData: (typeof initialClasses)[0]
  onToggleFavorite: () => void
  onViewDetails: () => void
}) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col">
        <div className={`h-2 w-full ${classData.color}`} />
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                {classData.name}
                {classData.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
              </CardTitle>
              <CardDescription>{classData.description}</CardDescription>
            </div>
            <Badge variant="outline">{classData.nextClass}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={classData.teacher} />
              <AvatarFallback>
                {classData.teacher
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{classData.teacher}</p>
              <p className="text-xs text-muted-foreground">Instructor</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Course Progress</span>
              <span className="font-medium">{classData.progress}%</span>
            </div>
            <Progress value={classData.progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button variant="ghost" size="sm" onClick={onToggleFavorite}>
            {classData.isFavorite ? (
              <>
                <StarOff className="mr-2 h-4 w-4" />
                Unfavorite
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" />
                Favorite
              </>
            )}
          </Button>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onViewDetails}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  View Assignments
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Teacher
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="gap-2">
              Go to Class
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}
