import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const shareData = await request.json()
    const supabase = createClient()

    // Generate a unique share ID
    const shareId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Store the shared analysis
    const { error } = await supabase.from("shared_analyses").insert({
      share_id: shareId,
      data: shareData,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    })

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json({ shareId })
  } catch (error) {
    console.error("Share analysis error:", error)
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 })
  }
}
