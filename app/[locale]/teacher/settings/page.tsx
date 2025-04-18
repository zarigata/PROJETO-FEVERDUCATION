"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/app/i18n/client"
import { useToast } from "@/components/ui/toast-provider"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Bell,
  Shield,
  Languages,
  Moon,
  Palette,
  Upload,
  Save,
  Mail,
  Globe,
  BookOpen,
  GraduationCap,
  Calendar,
} from "lucide-react"

export default function SettingsPage() {
  const { t, locale, changeLocale } = useLanguage()
  const { addToast } = useToast()

  // Profile settings
  const [profile, setProfile] = useState({
    name: "Ms. Johnson",
    email: "johnson@school.edu",
    phone: "+1 (555) 123-4567",
    bio: "Experienced mathematics teacher with a passion for making complex concepts accessible to all students.",
    website: "www.teacherjohnson.edu",
    subject: "Mathematics",
    education: "M.Ed. in Mathematics Education",
    yearsTeaching: "8",
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newStudentAlerts: true,
    assignmentSubmissions: true,
    weeklyReports: true,
    systemUpdates: false,
  })

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: "system",
    fontSize: "medium",
    colorScheme: "default",
    reducedMotion: false,
    highContrast: false,
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "students",
    activityStatus: true,
    dataSharing: false,
    analytics: true,
  })

  const handleProfileUpdate = () => {
    // In a real app, this would send the updated profile to the server
    addToast("Profile updated successfully", "success")
  }

  const handleNotificationUpdate = () => {
    // In a real app, this would update notification settings on the server
    addToast("Notification preferences updated", "success")
  }

  const handleAppearanceUpdate = () => {
    // In a real app, this would update appearance settings on the server
    addToast("Appearance settings updated", "success")
  }

  const handlePrivacyUpdate = () => {
    // In a real app, this would update privacy settings on the server
    addToast("Privacy settings updated", "success")
  }

  const handleLanguageChange = (value: string) => {
    if (value === "en" || value === "ja" || value === "pt") {
      changeLocale(value)
      addToast(
        `Language changed to ${value === "en" ? "English" : value === "ja" ? "Japanese" : "Portuguese"}`,
        "success",
      )
    }
  }

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.common?.settings || "Settings"}</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and public profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt={profile.name} />
                      <AvatarFallback className="text-2xl">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" /> Change Photo
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        className="min-h-[100px]"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject Area</Label>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="subject"
                          value={profile.subject}
                          onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="education"
                          value={profile.education}
                          onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsTeaching">Years Teaching</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="yearsTeaching"
                          type="number"
                          min="0"
                          value={profile.yearsTeaching}
                          onChange={(e) => setProfile({ ...profile, yearsTeaching: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleProfileUpdate} className="gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account and connected services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <Select value={locale} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Connected Accounts</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Google</p>
                          <p className="text-sm text-muted-foreground">Connected to your Google account</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Microsoft</p>
                          <p className="text-sm text-muted-foreground">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how and when you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Delivery Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, emailNotifications: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, pushNotifications: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="newStudentAlerts">New Student Alerts</Label>
                        <p className="text-sm text-muted-foreground">When a new student joins your class</p>
                      </div>
                      <Switch
                        id="newStudentAlerts"
                        checked={notifications.newStudentAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, newStudentAlerts: checked })}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="assignmentSubmissions">Assignment Submissions</Label>
                        <p className="text-sm text-muted-foreground">When students submit assignments</p>
                      </div>
                      <Switch
                        id="assignmentSubmissions"
                        checked={notifications.assignmentSubmissions}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, assignmentSubmissions: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weeklyReports">Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">Weekly summary of class activity</p>
                      </div>
                      <Switch
                        id="weeklyReports"
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="systemUpdates">System Updates</Label>
                        <p className="text-sm text-muted-foreground">Updates about the platform and new features</p>
                      </div>
                      <Switch
                        id="systemUpdates"
                        checked={notifications.systemUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNotificationUpdate} className="gap-2">
                  <Save className="h-4 w-4" /> Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the application looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={appearance.theme}
                        onValueChange={(value) => setAppearance({ ...appearance, theme: value })}
                      >
                        <SelectTrigger id="theme" className="w-full">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select
                      value={appearance.fontSize}
                      onValueChange={(value) => setAppearance({ ...appearance, fontSize: value })}
                    >
                      <SelectTrigger id="fontSize" className="w-full">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colorScheme">Color Scheme</Label>
                    <Select
                      value={appearance.colorScheme}
                      onValueChange={(value) => setAppearance({ ...appearance, colorScheme: value })}
                    >
                      <SelectTrigger id="colorScheme" className="w-full">
                        <SelectValue placeholder="Select color scheme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Accessibility</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reducedMotion">Reduced Motion</Label>
                        <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                      </div>
                      <Switch
                        id="reducedMotion"
                        checked={appearance.reducedMotion}
                        onCheckedChange={(checked) => setAppearance({ ...appearance, reducedMotion: checked })}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="highContrast">High Contrast</Label>
                        <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                      </div>
                      <Switch
                        id="highContrast"
                        checked={appearance.highContrast}
                        onCheckedChange={(checked) => setAppearance({ ...appearance, highContrast: checked })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleAppearanceUpdate} className="gap-2">
                  <Save className="h-4 w-4" /> Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <Select
                      value={privacy.profileVisibility}
                      onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                    >
                      <SelectTrigger id="profileVisibility" className="w-full">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="activityStatus">Activity Status</Label>
                      <p className="text-sm text-muted-foreground">Show when you're active on the platform</p>
                    </div>
                    <Switch
                      id="activityStatus"
                      checked={privacy.activityStatus}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, activityStatus: checked })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data & Analytics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dataSharing">Data Sharing</Label>
                        <p className="text-sm text-muted-foreground">Share anonymized data to improve the platform</p>
                      </div>
                      <Switch
                        id="dataSharing"
                        checked={privacy.dataSharing}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, dataSharing: checked })}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="analytics">Analytics</Label>
                        <p className="text-sm text-muted-foreground">Allow usage analytics to be collected</p>
                      </div>
                      <Switch
                        id="analytics"
                        checked={privacy.analytics}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, analytics: checked })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start text-left">
                      Download Your Data
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left text-destructive hover:text-destructive"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handlePrivacyUpdate} className="gap-2">
                  <Save className="h-4 w-4" /> Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
