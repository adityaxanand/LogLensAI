"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Brain, CheckCircle, Sparkles, AlertTriangle, Clock, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
}

interface SharedData {
  logs: string
  analysis: AnalysisResult
  timestamp: string
}

export default function SharedAnalysis() {
  const [sharedData, setSharedData] = useState<SharedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const loadSharedAnalysis = async () => {
      try {
        const { data, error } = await supabase
          .from("shared_analyses")
          .select("data")
          .eq("share_id", params.shareId)
          .single()

        if (error) {
          throw error
        }

        if (!data) {
          setError("Shared analysis not found or has expired")
          return
        }

        setSharedData(data.data)
      } catch (error) {
        console.error("Error loading shared analysis:", error)
        setError("Failed to load shared analysis")
      } finally {
        setLoading(false)
      }
    }

    if (params.shareId) {
      loadSharedAnalysis()
    }
  }, [params.shareId, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse" />
          </div>
          <p>Loading shared analysis...</p>
        </div>
      </div>
    )
  }

  if (error || !sharedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Analysis Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error || "This shared analysis may have expired or been removed."}
            </p>
            <Link href="/">
              <Button>Go to LogLens AI</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { analysis } = sharedData

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LogLens AI</span>
            <Badge variant="secondary">Shared Analysis</Badge>
          </div>
          <Link href="/">
            <Button variant="outline">Get LogLens AI</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shared Log Analysis</h1>
          <p className="text-muted-foreground">
            Shared on {new Date(sharedData.timestamp).toLocaleDateString()} at{" "}
            {new Date(sharedData.timestamp).toLocaleTimeString()}
          </p>
        </div>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                    <p className="text-2xl font-bold">
                      {Object.values(analysis.categories).reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                  <BarChart className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
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
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                    <p className="text-2xl font-bold text-yellow-500">{analysis.categories["Warning"] || 0}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
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
              <p className="text-sm leading-relaxed">{analysis.summary}</p>
            </CardContent>
          </Card>

          {/* Charts */}
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
          </div>

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
        </div>
      </div>
    </div>
  )
}
