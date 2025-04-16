"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, UserPlus, MoreHorizontal, Edit, Trash, Eye, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabase } from "@/lib/supabase"

interface User {
  id: string
  email: string
  full_name: string
  role: "admin" | "teacher" | "student"
  created_at: string
  status?: "active" | "inactive"
}

export default function AdminUsersPage() {
  const { isAdmin, isLoading, user, signUp } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [newUserData, setNewUserData] = useState({
    email: "",
    fullName: "",
    password: "",
    role: "student" as "admin" | "teacher" | "student",
  })

  useEffect(() => {
    // Redirect if not admin
    if (!isLoading && !isAdmin) {
      router.push("/")
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true)
        const supabase = getSupabase()
        const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        // Add status field (in a real app, this would come from the database)
        const usersWithStatus = data.map((user: any) => ({
          ...user,
          status: "active" as "active" | "inactive",
        }))

        setUsers(usersWithStatus)
        setFilteredUsers(usersWithStatus)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        })
      } finally {
        setIsLoadingUsers(false)
      }
    }

    if (isAdmin && !isLoading) {
      fetchUsers()
    }
  }, [isAdmin, isLoading, toast])

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = users.filter(
        (user) =>
          user.full_name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query),
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const handleCreateUser = async () => {
    setFormError(null)
    setIsCreatingUser(true)

    try {
      // Validate form
      if (!newUserData.email || !newUserData.fullName || !newUserData.password) {
        setFormError("All fields are required")
        return
      }

      if (newUserData.password.length < 8) {
        setFormError("Password must be at least 8 characters long")
        return
      }

      // Create user
      const { success, error } = await signUp(
        newUserData.email,
        newUserData.password,
        newUserData.fullName,
        newUserData.role,
      )

      if (success) {
        toast({
          title: "User created",
          description: `${newUserData.fullName} has been added as a ${newUserData.role}`,
          variant: "success",
        })

        // Reset form and close dialog
        setNewUserData({
          email: "",
          fullName: "",
          password: "",
          role: "student",
        })
        setIsCreatingUser(false)

        // Refresh user list
        const supabase = getSupabase()
        const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

        if (data) {
          const usersWithStatus = data.map((user: any) => ({
            ...user,
            status: "active" as "active" | "inactive",
          }))
          setUsers(usersWithStatus)
          setFilteredUsers(usersWithStatus)
        }
      } else {
        setFormError(error || "Failed to create user")
      }
    } catch (error) {
      console.error("Error creating user:", error)
      setFormError("An unexpected error occurred")
    } finally {
      setIsCreatingUser(false)
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser) return

    try {
      const supabase = getSupabase()
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: selectedUser.full_name,
          role: selectedUser.role,
        })
        .eq("id", selectedUser.id)

      if (error) {
        throw error
      }

      toast({
        title: "User updated",
        description: `${selectedUser.full_name}'s information has been updated`,
        variant: "success",
      })

      // Update user in the list
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, ...selectedUser } : user)),
      )
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, ...selectedUser } : user)),
      )

      setIsEditingUser(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const supabase = getSupabase()

      // Delete user profile
      const { error: profileError } = await supabase.from("profiles").delete().eq("id", selectedUser.id)

      if (profileError) {
        throw profileError
      }

      // In a real app, you would also delete the auth user
      // This requires admin privileges and would be done on the server
      // await supabase.auth.admin.deleteUser(selectedUser.id)

      toast({
        title: "User deleted",
        description: `${selectedUser.full_name} has been removed from the system`,
        variant: "success",
      })

      // Remove user from the list
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id))
      setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id))

      setIsConfirmingDelete(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users and permissions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage all users on the platform</CardDescription>
            </div>
            <Button onClick={() => setIsCreatingUser(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or role..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoadingUsers ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
              <p className="text-lg font-medium">No users found</p>
              <p className="text-muted-foreground">Try adjusting your search query</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : user.role === "teacher"
                                ? "bg-secondary/10 text-secondary"
                                : "bg-accent/10 text-accent"
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                          }`}
                        >
                          {user.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                // In a real app, you would navigate to a user details page
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setIsEditingUser(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setIsConfirmingDelete(true)
                              }}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreatingUser} onOpenChange={(open) => !open && setIsCreatingUser(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newUserData.fullName}
                onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <RadioGroup
                value={newUserData.role}
                onValueChange={(value: "admin" | "teacher" | "student") =>
                  setNewUserData({ ...newUserData, role: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher">Teacher</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Administrator</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingUser(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={isCreatingUser}>
              {isCreatingUser ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditingUser} onOpenChange={(open) => !open && setIsEditingUser(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-fullName">Full Name</Label>
                <Input
                  id="edit-fullName"
                  value={selectedUser.full_name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" value={selectedUser.email} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <RadioGroup
                  value={selectedUser.role}
                  onValueChange={(value: "admin" | "teacher" | "student") =>
                    setSelectedUser({ ...selectedUser, role: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="edit-student" />
                    <Label htmlFor="edit-student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="edit-teacher" />
                    <Label htmlFor="edit-teacher">Teacher</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="edit-admin" />
                    <Label htmlFor="edit-admin">Administrator</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingUser(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isConfirmingDelete} onOpenChange={(open) => !open && setIsConfirmingDelete(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p>
                Are you sure you want to delete <strong>{selectedUser.full_name}</strong>?
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                This will permanently remove the user and all associated data from the system.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
