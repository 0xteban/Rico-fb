import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function PUT(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get request body
    const { name, avatar } = await request.json()

    // Validate input
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Update user profile
    const result = await executeQuery<any[]>(
      "UPDATE users SET name = $1, avatar = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, name, avatar",
      [name, avatar || user.avatar, user.id],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    const updatedUser = result[0]

    return NextResponse.json({ user: updatedUser })
  } catch (error: any) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: error.message || "An error occurred while updating profile" }, { status: 500 })
  }
}

