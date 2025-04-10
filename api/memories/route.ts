import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// GET /api/memories - Get all memories for the current user
export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get memories for the user
    const memories = await executeQuery<any[]>("SELECT * FROM memories WHERE user_id = $1 ORDER BY created_at DESC", [
      user.id,
    ])

    return NextResponse.json({ memories })
  } catch (error: any) {
    console.error("Get memories error:", error)
    return NextResponse.json({ error: error.message || "An error occurred while fetching memories" }, { status: 500 })
  }
}

// POST /api/memories - Create a new memory
export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get request body
    const { text, is_suggested = false, is_user_created = true } = await request.json()

    // Validate input
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Create memory
    const result = await executeQuery<any[]>(
      "INSERT INTO memories (user_id, text, is_suggested, is_user_created) VALUES ($1, $2, $3, $4) RETURNING *",
      [user.id, text, is_suggested, is_user_created],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Failed to create memory" }, { status: 500 })
    }

    const memory = result[0]

    return NextResponse.json({ memory })
  } catch (error: any) {
    console.error("Create memory error:", error)
    return NextResponse.json({ error: error.message || "An error occurred while creating memory" }, { status: 500 })
  }
}

