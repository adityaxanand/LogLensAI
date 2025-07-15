"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User, Bell, Shield, CreditCard, Key, Crown, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  company?: string
  role?: string
  location?: string
  bio?: string
  phone?: string
  timezone: string
  created_at: string
}

interface NotificationSettings {
  email_alerts: boolean
  push_notifications: boolean
  weekly_reports: boolean
  security_alerts: boolean
  system_updates: boolean
}

interface SubscriptionInfo {
  plan: string
  status: string
  current_period_end: string
  usage: {
    logs_processed: number
    logs_limit: number
    analyses_count: number
    analyses_limit: number
  }
}

export function ProfileSettings({ user }: { user: any }) {
  const [profile, setProfile] = useState<UserProfile>({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || "",
    avatar_url: user.user_metadata?.avatar_url || "",
    company: "",
    role: "",
    location: "",
    bio: "",
    phone: "",
    timezone: "UTC",
    created_at: user.created_at,
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_alerts: true,
    push_notifications: true,
    weekly_reports: false,
    security_alerts: true,
    system_updates: false,
  })

  const [subscription] = useState<SubscriptionInfo>({
    plan: "Professional",
    status: "active",
    current_period_end: "2024-02-15",
    usage: {
      logs_processed: 7500000,
      logs_limit: 10000000,
      analyses_count: 45,
      analyses_limit: 100,
    },
  })

  const [loading, setLoading] = useState(false)
  const [passwordDialog, setPasswordDialog] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const supabase = createClient()

  const updateProfile = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          company: profile.company,
          role: profile.role,
          location: profile.location,
          bio: profile.bio,
          phone: profile.phone,
          timezone: profile.timezone,
        },
      })

      if (error) throw error
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      toast.success("Password updated successfully!")
      setPasswordDialog(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      toast.error("Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  const updateNotifications = async (key: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
    // In a real app, you'd save this to the database
    toast.success("Notification preferences updated")
  }

  const usagePercentage = (subscription.usage.logs_processed / subscription.usage.logs_limit) * 100
  const analysesPercentage = (subscription.usage.analyses_count / subscription.usage.analyses_limit) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Badge variant="secondary" className="flex items-center">
          <Crown className="w-4 h-4 mr-1" />
          {subscription.plan}
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile.email} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="Your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profile.role}
                    onChange={(e) => setProfile((prev) => ({ ...prev, role: e.target.value }))}
                    placeholder="Your job title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(value) => setProfile((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <Button onClick={updateProfile} disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {key
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {key === "email_alerts" && "Receive email notifications for critical alerts"}
                      {key === "push_notifications" && "Get push notifications on your device"}
                      {key === "weekly_reports" && "Weekly summary of your log analysis"}
                      {key === "security_alerts" && "Important security-related notifications"}
                      {key === "system_updates" && "Updates about new features and improvements"}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => updateNotifications(key as keyof NotificationSettings, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">Last updated 30 days ago</p>
                </div>
                <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Change Password</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setPasswordDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={updatePassword} disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Active Sessions</h4>
                  <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                </div>
                <Button variant="outline">View Sessions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Subscription & Usage
              </CardTitle>
              <CardDescription>Manage your subscription and view usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                    {subscription.plan} Plan
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {subscription.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Logs Processed</span>
                    <span>
                      {subscription.usage.logs_processed.toLocaleString()} /{" "}
                      {subscription.usage.logs_limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Analyses Created</span>
                    <span>
                      {subscription.usage.analyses_count} / {subscription.usage.analyses_limit}
                    </span>
                  </div>
                  <Progress value={analysesPercentage} className="h-2" />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button>Upgrade Plan</Button>
                <Button variant="outline">View Billing</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                API Keys
              </CardTitle>
              <CardDescription>Manage your API keys for integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Production API Key</h4>
                  <p className="text-sm text-muted-foreground font-mono">ll_prod_••••••••••••••••</p>
                  <p className="text-sm text-muted-foreground">Created on Jan 15, 2024</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Development API Key</h4>
                  <p className="text-sm text-muted-foreground font-mono">ll_dev_••••••••••••••••</p>
                  <p className="text-sm text-muted-foreground">Created on Jan 10, 2024</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                </div>
              </div>

              <Button>Create New API Key</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
