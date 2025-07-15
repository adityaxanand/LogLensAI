"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Upload,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  Share,
  Settings,
  User,
  LogOut,
  Sparkles,
  History,
  Trash2,
  Eye,
  Activity,
  Zap,
  Shield,
  Database,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdvancedFilters } from "@/components/advanced-filters"
import { ProfileSettings } from "@/components/profile-settings"
import { AlertManagement } from "@/components/alert-management"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface LogEntry {
  id: string
  timestamp: string
  level: string
  message: string
  category: string
  source?: string
}

interface AnalysisResult {
  summary: string
  categories: { [key: string]: number }
  anomalies: string[]
  solutions: Array<{
    title: string
    description: string
    steps: string[]
    confidence: number
    simulatedOutput: string
  }>
  timeline: Array<{
    time: string
    errors: number
    warnings: number
    info: number
  }>
  performance: {
    responseTime: number
    throughput: number
    errorRate: number
    availability: number
  }
  security: {
    threats: number
    vulnerabilities: string[]
    riskLevel: string
  }
  insights: {
    patterns: string[]
    recommendations: string[]
    trends: string[]
  }
}

interface HistoryItem {
  id: string
  created_at: string
  logs_content: string
  analysis_result: AnalysisResult
}

interface FilterState {
  logLevel: string[]
  categories: string[]
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  searchTerm: string
  severity: string
  source: string[]
  showAnomaliesOnly: boolean
  minConfidence: number
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00", "#ff00ff", "#8dd1e1", "#d084d0"]

export default function Dashboard() {
  const [logs, setLogs] = useState("")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [activeTab, setActiveTab] = useState("analyzer")
  const [realTimeMode, setRealTimeMode] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [filters, setFilters] = useState<FilterState>({
    logLevel: [],
    categories: [],
    dateRange: { from: undefined, to: undefined },
    searchTerm: "",
    severity: "",
    source: [],
    showAnomaliesOnly: false,
    minConfidence: 0,
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/signin")
      } else {
        setUser(user)
        loadHistory()
      }
    }
    getUser()
  }, [router, supabase.auth])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh && analysis) {
      interval = setInterval(() => {
        analyzeLogs(true)
      }, refreshInterval * 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, analysis])

  const loadHistory = async () => {
    setLoadingHistory(true)
    try {
      const { data, error } = await supabase
        .from("log_analyses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) {
        console.error("Error loading history:", error)
      } else {
        setHistory(data || [])
      }
    } catch (error) {
      console.error("Error loading history:", error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const analyzeLogs = async (isAutoRefresh = false) => {
    if (!logs.trim()) {
      toast.error("Please enter some log data to analyze")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/analyze-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs, filters }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const result = await response.json()
      setAnalysis(result)

      // Save analysis to Supabase (only for manual analysis, not auto-refresh)
      if (user && !isAutoRefresh) {
        const { error } = await supabase.from("log_analyses").insert({
          user_id: user.id,
          logs_content: logs,
          analysis_result: result,
        })

        if (error) {
          console.error("Error saving analysis:", error)
        } else {
          loadHistory()
        }
      }

      if (!isAutoRefresh) {
        toast.success("Log analysis completed!")
      }
    } catch (error) {
      toast.error("Failed to analyze logs")
    } finally {
      setLoading(false)
    }
  }

  const loadSampleLogs = () => {
    const sampleLogs = `2024-01-15 10:30:15 INFO [AuthService] User login successful for user_id=123
2024-01-15 10:30:45 WARN [DatabasePool] Connection pool reaching capacity: 85/100
2024-01-15 10:31:02 ERROR [PaymentService] Payment processing failed for transaction_id=tx_456: Connection timeout
2024-01-15 10:31:15 INFO [CacheService] Cache hit rate: 92.5%
2024-01-15 10:31:30 ERROR [DatabaseService] Query timeout after 30s: SELECT * FROM user_sessions WHERE expires_at > NOW()
2024-01-15 10:32:00 WARN [SecurityService] Multiple failed login attempts detected for IP: 192.168.1.100
2024-01-15 10:32:15 INFO [APIGateway] Request processed successfully: GET /api/users/profile
2024-01-15 10:32:30 ERROR [EmailService] SMTP connection failed: Unable to connect to mail server
2024-01-15 10:33:00 INFO [BackupService] Daily backup completed successfully
2024-01-15 10:33:15 WARN [MemoryMonitor] High memory usage detected: 89% of available RAM
2024-01-15 10:33:30 ERROR [SecurityService] SQL injection attempt blocked from IP: 192.168.1.200
2024-01-15 10:34:00 INFO [LoadBalancer] Health check passed for all servers
2024-01-15 10:34:15 WARN [DiskMonitor] Disk usage at 78% on /var/log partition
2024-01-15 10:34:30 ERROR [APIGateway] Rate limit exceeded for API key: ak_prod_12345
2024-01-15 10:35:00 INFO [CacheService] Cache cleared successfully
2024-01-15 10:35:15 WARN [NetworkMonitor] High latency detected: 250ms average
2024-01-15 10:35:30 ERROR [DatabaseService] Connection pool exhausted, rejecting new connections
2024-01-15 10:36:00 INFO [BackupService] Incremental backup started
2024-01-15 10:36:15 WARN [CPUMonitor] CPU usage at 92% for 5 minutes
2024-01-15 10:36:30 ERROR [PaymentService] Credit card validation failed for card ending in 1234`

    setLogs(sampleLogs)
    toast.success("Sample logs loaded!")
  }

  const exportLogs = () => {
    if (!analysis) return

    const dataStr = JSON.stringify(analysis, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `log-analysis-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const shareAnalysis = async () => {
    if (!analysis) return

    try {
      const shareData = {
        logs,
        analysis,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch("/api/share-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shareData),
      })

      if (!response.ok) {
        throw new Error("Failed to create share link")
      }

      const { shareId } = await response.json()
      const shareUrl = `${window.location.origin}/shared/${shareId}`

      await navigator.clipboard.writeText(shareUrl)
      toast.success("Share link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to create share link")
    }
  }

  const loadHistoryItem = (item: HistoryItem) => {
    setLogs(item.logs_content)
    setAnalysis(item.analysis_result)
    setActiveTab("analyzer")
    toast.success("Analysis loaded from history!")
  }

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase.from("log_analyses").delete().eq("id", id)

      if (error) {
        throw error
      }

      setHistory(history.filter((item) => item.id !== id))
      toast.success("Analysis deleted!")
    } catch (error) {
      toast.error("Failed to delete analysis")
    }
  }

  const getAvailableCategories = () => {
    if (!analysis) return []
    return Object.keys(analysis.categories)
  }

  const getAvailableSources = () => {
    // Mock sources - in real app, extract from logs
    return ["AuthService", "DatabasePool", "PaymentService", "CacheService", "SecurityService", "APIGateway"]
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse" />
          </div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LogLens AI</span>
            {realTimeMode && (
              <Badge variant="secondary" className="animate-pulse">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              <Label htmlFor="auto-refresh" className="text-sm">
                Auto-refresh
              </Label>
            </div>

            {autoRefresh && (
              <Select
                value={refreshInterval.toString()}
                onValueChange={(value) => setRefreshInterval(Number.parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10s</SelectItem>
                  <SelectItem value="30">30s</SelectItem>
                  <SelectItem value="60">1m</SelectItem>
                  <SelectItem value="300">5m</SelectItem>
                </SelectContent>
              </Select>
            )}

            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setActiveTab("settings")}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setActiveTab("profile")}>
              <User className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Advanced Log Analysis Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="analyzer">Analyzer</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Log Input */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Log Input
                  </CardTitle>
                  <CardDescription>Paste your log data here for AI analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Switch id="real-time" checked={realTimeMode} onCheckedChange={setRealTimeMode} />
                    <Label htmlFor="real-time" className="text-sm">
                      Real-time mode
                    </Label>
                  </div>

                  <Textarea
                    placeholder="Paste your log entries here..."
                    value={logs}
                    onChange={(e) => setLogs(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />

                  <div className="flex space-x-2">
                    <Button onClick={loadSampleLogs} variant="outline" className="flex-1 bg-transparent">
                      Load Sample
                    </Button>
                    <Button onClick={() => analyzeLogs()} disabled={loading || !logs.trim()} className="flex-1">
                      {loading ? (
                        <>
                          <Brain className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>

                  {analysis && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={exportLogs} className="flex-1 bg-transparent">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={shareAnalysis} className="flex-1 bg-transparent">
                        <Share className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analysis Results */}
              <div className="lg:col-span-3 space-y-6">
                {/* Filters */}
                <AdvancedFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableCategories={getAvailableCategories()}
                  availableSources={getAvailableSources()}
                />

                <AnimatePresence>
                  {analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                                <p className="text-2xl font-bold">
                                  {Object.values(analysis.categories).reduce((a, b) => a + b, 0)}
                                </p>
                              </div>
                              <Database className="w-8 h-8 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Errors</p>
                                <p className="text-2xl font-bold text-red-500">{analysis.categories["Error"] || 0}</p>
                              </div>
                              <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                                <p className="text-2xl font-bold text-yellow-500">
                                  {analysis.categories["Warning"] || 0}
                                </p>
                              </div>
                              <Clock className="w-8 h-8 text-yellow-500" />
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Anomalies</p>
                                <p className="text-2xl font-bold text-blue-500">{analysis.anomalies?.length || 0}</p>
                              </div>
                              <TrendingUp className="w-8 h-8 text-blue-500" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* AI Summary */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Brain className="w-5 h-5 mr-2" />
                            AI Analysis Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm leading-relaxed mb-4">{analysis.summary}</p>

                          {analysis.insights && (
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-medium mb-2">Key Patterns Detected:</h4>
                                <ul className="text-sm space-y-1">
                                  {analysis.insights.patterns?.map((pattern, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                                      {pattern}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Recommendations:</h4>
                                <ul className="text-sm space-y-1">
                                  {analysis.insights.recommendations?.map((rec, index) => (
                                    <li key={index} className="flex items-start">
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                      {rec}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Solutions */}
                      {analysis.solutions && analysis.solutions.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              AI-Powered Solutions
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {analysis.solutions.map((solution, index) => (
                              <div key={index} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold">{solution.title}</h4>
                                  <Badge variant="secondary">{solution.confidence}% confidence</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{solution.description}</p>
                                <div className="space-y-2">
                                  <h5 className="text-sm font-medium">Steps to resolve:</h5>
                                  <ol className="text-sm space-y-1 ml-4">
                                    {solution.steps.map((step, stepIndex) => (
                                      <li key={stepIndex} className="list-decimal">
                                        {step}
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                                {solution.simulatedOutput && (
                                  <div className="mt-3 p-3 bg-muted rounded-lg">
                                    <h5 className="text-sm font-medium mb-2">Simulated Output:</h5>
                                    <code className="text-xs">{solution.simulatedOutput}</code>
                                  </div>
                                )}
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            {analysis ? (
              <>
                {/* Performance Metrics */}
                {analysis.performance && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                            <p className="text-2xl font-bold">{analysis.performance.responseTime}ms</p>
                          </div>
                          <Zap className="w-8 h-8 text-yellow-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Throughput</p>
                            <p className="text-2xl font-bold">{analysis.performance.throughput}/s</p>
                          </div>
                          <Activity className="w-8 h-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                            <p className="text-2xl font-bold text-red-500">{analysis.performance.errorRate}%</p>
                          </div>
                          <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Availability</p>
                            <p className="text-2xl font-bold text-green-500">{analysis.performance.availability}%</p>
                          </div>
                          <Shield className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={Object.entries(analysis.categories).map(([name, value]) => ({ name, value }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Log Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analysis.timeline}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="errors" stackId="1" stroke="#ff4444" fill="#ff4444" />
                          <Area type="monotone" dataKey="warnings" stackId="1" stroke="#ffaa00" fill="#ffaa00" />
                          <Area type="monotone" dataKey="info" stackId="1" stroke="#00aa00" fill="#00aa00" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Error Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analysis.timeline}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="errors" stroke="#ff4444" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Log Level Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={Object.entries(analysis.categories).map(([name, value]) => ({ name, value }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.entries(analysis.categories).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Security Overview */}
                {analysis.security && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Security Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-500 mb-2">{analysis.security.threats}</div>
                          <div className="text-sm text-muted-foreground">Threats Detected</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-yellow-500 mb-2">
                            {analysis.security.vulnerabilities?.length || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Vulnerabilities</div>
                        </div>
                        <div className="text-center">
                          <Badge
                            variant={
                              analysis.security.riskLevel === "High"
                                ? "destructive"
                                : analysis.security.riskLevel === "Medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-lg px-4 py-2"
                          >
                            {analysis.security.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>

                      {analysis.security.vulnerabilities && analysis.security.vulnerabilities.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium mb-3">Detected Vulnerabilities:</h4>
                          <ul className="space-y-2">
                            {analysis.security.vulnerabilities.map((vuln, index) => (
                              <li key={index} className="flex items-start">
                                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-sm">{vuln}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Analyze some logs first to see your dashboard metrics and visualizations.
                  </p>
                  <Button onClick={() => setActiveTab("analyzer")}>Go to Analyzer</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {analysis ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Advanced Insights
                    </CardTitle>
                    <CardDescription>Deep analysis and patterns discovered in your logs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {analysis.insights?.trends && (
                      <div>
                        <h4 className="font-medium mb-3">Trending Issues:</h4>
                        <div className="space-y-2">
                          {analysis.insights.trends.map((trend, index) => (
                            <div key={index} className="flex items-start p-3 bg-muted rounded-lg">
                              <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-sm">{trend}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.anomalies && analysis.anomalies.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Anomalies Detected:</h4>
                        <div className="space-y-2">
                          {analysis.anomalies.map((anomaly, index) => (
                            <div key={index} className="flex items-start p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-sm">{anomaly}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">System Health Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-4xl font-bold text-green-500 mb-2">87%</div>
                            <p className="text-sm text-muted-foreground">Overall system health based on log analysis</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Prediction Accuracy</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-4xl font-bold text-blue-500 mb-2">94%</div>
                            <p className="text-sm text-muted-foreground">AI model confidence in predictions</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Insights Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Analyze some logs first to generate advanced insights and trends.
                  </p>
                  <Button onClick={() => setActiveTab("analyzer")}>Start Analysis</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Analysis History
                </CardTitle>
                <CardDescription>View and manage your previous log analyses</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="text-center py-8">
                    <Brain className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading history...</p>
                  </div>
                ) : history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium">
                              Analysis from {new Date(item.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => loadHistoryItem(item)}>
                              <Eye className="w-4 h-4 mr-1" />
                              Load
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteHistoryItem(item.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.analysis_result.summary.substring(0, 200)}...
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>Logs: {Object.values(item.analysis_result.categories).reduce((a, b) => a + b, 0)}</span>
                          <span>Errors: {item.analysis_result.categories["Error"] || 0}</span>
                          <span>Anomalies: {item.analysis_result.anomalies?.length || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Analysis History</h3>
                    <p className="text-muted-foreground">
                      Your previous log analyses will appear here once you start analyzing logs.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <AlertManagement userId={user.id} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
