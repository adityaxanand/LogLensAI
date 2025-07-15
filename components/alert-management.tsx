"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Bell, Plus, Edit, Trash2, Mail, MessageSquare, Webhook, Clock, Activity } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Alert {
  id: string
  name: string
  description: string
  conditions: {
    logLevel: string[]
    keywords: string[]
    threshold: number
    timeWindow: number
  }
  notifications: {
    email: boolean
    slack: boolean
    webhook: boolean
    emailAddress?: string
    slackChannel?: string
    webhookUrl?: string
  }
  isActive: boolean
  createdAt: string
  lastTriggered?: string
  triggerCount: number
}

export function AlertManagement({ userId }: { userId: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    conditions: {
      logLevel: [] as string[],
      keywords: [] as string[],
      threshold: 1,
      timeWindow: 5,
    },
    notifications: {
      email: true,
      slack: false,
      webhook: false,
      emailAddress: "",
      slackChannel: "",
      webhookUrl: "",
    },
    isActive: true,
  })

  const supabase = createClient()

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      const formattedAlerts =
        data?.map((alert) => ({
          id: alert.id,
          name: alert.name,
          description: alert.description || "",
          conditions: alert.conditions,
          notifications: alert.notification_settings,
          isActive: alert.is_active,
          createdAt: alert.created_at,
          lastTriggered: alert.last_triggered,
          triggerCount: alert.trigger_count || 0,
        })) || []

      setAlerts(formattedAlerts)
    } catch (error) {
      console.error("Error loading alerts:", error)
      toast.error("Failed to load alerts")
    } finally {
      setLoading(false)
    }
  }

  const saveAlert = async () => {
    setLoading(true)
    try {
      const alertData = {
        user_id: userId,
        name: formData.name,
        description: formData.description,
        conditions: formData.conditions,
        notification_settings: formData.notifications,
        is_active: formData.isActive,
      }

      if (editingAlert) {
        const { error } = await supabase.from("alerts").update(alertData).eq("id", editingAlert.id)

        if (error) throw error
        toast.success("Alert updated successfully!")
      } else {
        const { error } = await supabase.from("alerts").insert(alertData)

        if (error) throw error
        toast.success("Alert created successfully!")
      }

      setDialogOpen(false)
      resetForm()
      loadAlerts()
    } catch (error) {
      console.error("Error saving alert:", error)
      toast.error("Failed to save alert")
    } finally {
      setLoading(false)
    }
  }

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase.from("alerts").delete().eq("id", alertId)

      if (error) throw error
      toast.success("Alert deleted successfully!")
      loadAlerts()
    } catch (error) {
      console.error("Error deleting alert:", error)
      toast.error("Failed to delete alert")
    }
  }

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("alerts").update({ is_active: isActive }).eq("id", alertId)

      if (error) throw error
      toast.success(`Alert ${isActive ? "enabled" : "disabled"}`)
      loadAlerts()
    } catch (error) {
      console.error("Error toggling alert:", error)
      toast.error("Failed to update alert")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      conditions: {
        logLevel: [],
        keywords: [],
        threshold: 1,
        timeWindow: 5,
      },
      notifications: {
        email: true,
        slack: false,
        webhook: false,
        emailAddress: "",
        slackChannel: "",
        webhookUrl: "",
      },
      isActive: true,
    })
    setEditingAlert(null)
  }

  const openEditDialog = (alert: Alert) => {
    setEditingAlert(alert)
    setFormData({
      name: alert.name,
      description: alert.description,
      conditions: alert.conditions,
      notifications: alert.notifications,
      isActive: alert.isActive,
    })
    setDialogOpen(true)
  }

  const addKeyword = (keyword: string) => {
    if (keyword && !formData.conditions.keywords.includes(keyword)) {
      setFormData((prev) => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          keywords: [...prev.conditions.keywords, keyword],
        },
      }))
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        keywords: prev.conditions.keywords.filter((k) => k !== keyword),
      },
    }))
  }

  const toggleLogLevel = (level: string) => {
    const currentLevels = formData.conditions.logLevel
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter((l) => l !== level)
      : [...currentLevels, level]

    setFormData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        logLevel: newLevels,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Alert Management</h2>
          <p className="text-muted-foreground">Configure intelligent alerts for your log monitoring</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAlert ? "Edit Alert" : "Create New Alert"}</DialogTitle>
              <DialogDescription>Configure conditions and notifications for your alert</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alert-name">Alert Name</Label>
                  <Input
                    id="alert-name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., High Error Rate Alert"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alert-description">Description</Label>
                  <Textarea
                    id="alert-description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this alert monitors..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Conditions */}
              <div className="space-y-4">
                <h4 className="font-medium">Alert Conditions</h4>

                <div className="space-y-2">
                  <Label>Log Levels</Label>
                  <div className="flex flex-wrap gap-2">
                    {["ERROR", "WARN", "INFO", "DEBUG"].map((level) => (
                      <Button
                        key={level}
                        type="button"
                        variant={formData.conditions.logLevel.includes(level) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleLogLevel(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.conditions.keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeKeyword(keyword)}
                      >
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add keyword and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addKeyword(e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Threshold (occurrences)</Label>
                    <Input
                      id="threshold"
                      type="number"
                      min="1"
                      value={formData.conditions.threshold}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          conditions: { ...prev.conditions, threshold: Number.parseInt(e.target.value) || 1 },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeWindow">Time Window (minutes)</Label>
                    <Input
                      id="timeWindow"
                      type="number"
                      min="1"
                      value={formData.conditions.timeWindow}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          conditions: { ...prev.conditions, timeWindow: Number.parseInt(e.target.value) || 5 },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium">Notification Settings</h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <Label>Email Notifications</Label>
                    </div>
                    <Switch
                      checked={formData.notifications.email}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked },
                        }))
                      }
                    />
                  </div>
                  {formData.notifications.email && (
                    <Input
                      placeholder="Email address"
                      value={formData.notifications.emailAddress}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, emailAddress: e.target.value },
                        }))
                      }
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4" />
                      <Label>Slack Notifications</Label>
                    </div>
                    <Switch
                      checked={formData.notifications.slack}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, slack: checked },
                        }))
                      }
                    />
                  </div>
                  {formData.notifications.slack && (
                    <Input
                      placeholder="#channel-name"
                      value={formData.notifications.slackChannel}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, slackChannel: e.target.value },
                        }))
                      }
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Webhook className="w-4 h-4" />
                      <Label>Webhook</Label>
                    </div>
                    <Switch
                      checked={formData.notifications.webhook}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, webhook: checked },
                        }))
                      }
                    />
                  </div>
                  {formData.notifications.webhook && (
                    <Input
                      placeholder="https://your-webhook-url.com"
                      value={formData.notifications.webhookUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, webhookUrl: e.target.value },
                        }))
                      }
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Alert Active</Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveAlert} disabled={loading || !formData.name}>
                {loading ? "Saving..." : editingAlert ? "Update Alert" : "Create Alert"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Activity className="w-8 h-8 animate-pulse mx-auto mb-2" />
              <p>Loading alerts...</p>
            </CardContent>
          </Card>
        ) : alerts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Alerts Configured</h3>
              <p className="text-muted-foreground mb-4">
                Create your first alert to start monitoring your logs for critical events.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{alert.name}</h3>
                      <Badge variant={alert.isActive ? "default" : "secondary"}>
                        {alert.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {alert.triggerCount > 0 && <Badge variant="outline">{alert.triggerCount} triggers</Badge>}
                    </div>

                    {alert.description && <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Levels: {alert.conditions.logLevel.join(", ") || "All"}</span>
                      </div>

                      {alert.conditions.keywords.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <span>Keywords: {alert.conditions.keywords.join(", ")}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {alert.conditions.threshold} in {alert.conditions.timeWindow}min
                        </span>
                      </div>

                      {alert.lastTriggered && (
                        <div className="flex items-center space-x-1">
                          <span>Last: {new Date(alert.lastTriggered).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mt-3">
                      {alert.notifications.email && (
                        <Badge variant="outline" className="text-xs">
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Badge>
                      )}
                      {alert.notifications.slack && (
                        <Badge variant="outline" className="text-xs">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Slack
                        </Badge>
                      )}
                      {alert.notifications.webhook && (
                        <Badge variant="outline" className="text-xs">
                          <Webhook className="w-3 h-3 mr-1" />
                          Webhook
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch checked={alert.isActive} onCheckedChange={(checked) => toggleAlert(alert.id, checked)} />
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(alert)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAlert(alert.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
