"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Calendar,
  Shield,
  Camera,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import type { User as UserType } from "@/lib/supabase"

interface ProfileProps {
  userId?: string
  user: UserType | null
}

export default function Profile({ userId, user }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: "",
    location: "",
    bio: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileSave = () => {
    // TODO: Implement profile update logic
    setIsEditing(false)
  }

  const handlePasswordChange = () => {
    // TODO: Implement password change logic
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Manage your account and preferences
          </p>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Card */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="w-24 h-24 border-4 border-slate-600">
                  <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-slate-600 bg-slate-800 hover:bg-slate-700"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-white">{user?.user_metadata?.full_name || "User"}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </CardDescription>
                <div className="flex justify-center gap-2">
                  <Badge variant="outline" className="border-green-500/30 text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                    Pro Member
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-lg bg-slate-700/30">
                  <div className="text-lg font-bold text-white">2.5K</div>
                  <div className="text-xs text-slate-400">Transactions</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-700/30">
                  <div className="text-lg font-bold text-white">156</div>
                  <div className="text-xs text-slate-400">Days Active</div>
                </div>
              </div>
              <Separator className="bg-slate-700/50" />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="h-4 w-4" />
                  Joined December 2023
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Shield className="h-4 w-4" />
                  Account Secured
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants} className="lg:col-span-2">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                Profile Info
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Personal Information</CardTitle>
                      <CardDescription>Update your personal details and preferences</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      {isEditing ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-slate-300">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        disabled={!isEditing}
                        className="bg-slate-700/30 border-slate-600 text-white disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="bg-slate-700/30 border-slate-600 text-white disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-300">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="bg-slate-700/30 border-slate-600 text-white disabled:opacity-60"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-slate-300">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        disabled={!isEditing}
                        className="bg-slate-700/30 border-slate-600 text-white disabled:opacity-60"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-slate-300">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-700/30 border-slate-600 text-white disabled:opacity-60 min-h-[100px]"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  {isEditing && (
                    <div className="flex justify-end">
                      <Button
                        onClick={handleProfileSave}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                  <CardDescription>Manage your password and security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-slate-300">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="bg-slate-700/30 border-slate-600 text-white pr-10"
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-slate-300">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="bg-slate-700/30 border-slate-600 text-white pr-10"
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-slate-300">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="bg-slate-700/30 border-slate-600 text-white pr-10"
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-700/50" />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-white">Security Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="text-sm font-medium text-white">Email Verified</p>
                            <p className="text-xs text-slate-400">Your email address is verified</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-green-500/30 text-green-400">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-400" />
                          <div>
                            <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                            <p className="text-xs text-slate-400">Add an extra layer of security</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Enable
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handlePasswordChange}
                      className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
