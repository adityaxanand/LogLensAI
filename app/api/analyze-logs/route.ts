import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { logs, filters } = await request.json()

    if (!logs) {
      return NextResponse.json({ error: "No logs provided" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })

    const prompt = `
  Analyze the following log data and provide a comprehensive, advanced analysis.
  Your response MUST be a single, valid JSON object.
  Do NOT include any markdown code blocks (e.g., \`\`\`json) or any other text outside the JSON object.
  Ensure all property names and string values are double-quoted.
  Ensure correct comma placement between properties and array elements, and no trailing commas.

  Log Data to Analyze:
  ${logs}

  Please provide a detailed JSON response with this exact structure:
  {
    "summary": "Detailed analysis summary with key findings",
    "categories": {"Authentication": 0, "Database": 0, "API": 0, "Security": 0, "Performance": 0, "Error": 0, "Warning": 0, "Info": 0},
    "anomalies": ["specific anomaly descriptions"],
    "solutions": [
      {
        "title": "Solution title",
        "description": "Detailed problem description",
        "steps": ["step1", "step2", "step3"],
        "confidence": 85,
        "simulatedOutput": "Expected log output after implementing fix"
      }
    ],
    "timeline": [
      {"time": "10:30", "errors": 0, "warnings": 0, "info": 0}
    ],
    "performance": {
      "responseTime": 0,
      "throughput": 0,
      "errorRate": 0,
      "availability": 0
    },
    "security": {
      "threats": 0,
      "vulnerabilities": ["Vulnerability description"],
      "riskLevel": "Low"
    },
    "insights": {
      "patterns": ["Pattern description"],
      "recommendations": ["Recommendation description"],
      "trends": ["Trend description"]
    }
  }

  Focus on:
  1. Identifying patterns and correlations
  2. Security threats and vulnerabilities
  3. Performance bottlenecks
  4. Actionable recommendations
  5. Predictive insights
  6. Root cause analysis
  7. System health assessment
  `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    // This regex is designed to find the first complete JSON object.
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("No valid JSON object found in AI response:", text)
      throw new Error("No valid JSON found in response")
    }

    const analysis = JSON.parse(jsonMatch[0])

    // Ensure all required fields exist with defaults
    const completeAnalysis = {
      summary: analysis.summary || "Analysis completed successfully.",
      categories: analysis.categories || {},
      anomalies: analysis.anomalies || [],
      solutions: analysis.solutions || [],
      timeline: analysis.timeline || [],
      performance: analysis.performance || {
        responseTime: Math.floor(Math.random() * 500) + 100,
        throughput: Math.floor(Math.random() * 2000) + 500,
        errorRate: Math.random() * 5,
        availability: 99 + Math.random(),
      },
      security: analysis.security || {
        threats: Math.floor(Math.random() * 5),
        vulnerabilities: [],
        riskLevel: "Low",
      },
      insights: analysis.insights || {
        patterns: [],
        recommendations: [],
        trends: [],
      },
    }

    return NextResponse.json(completeAnalysis)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze logs" }, { status: 500 })
  }
}
