import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// PUT /api/memories/[id] - Update a memory
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    // Get request body
    const { text, is_suggested } = await request.json()

    // Build update query based on provided fields
    const updateFields = []
    const queryParams = []
    let paramIndex = 1

    if (text !== undefined) {
      updateFields.push(`text = $${paramIndex}`)
      queryParams.push(text)
      paramIndex++
    }

    if (is_suggested !== undefined) {
      updateFields.push(`is_suggested = $${paramIndex}`)
      queryParams.push(is_suggested)
      paramIndex++
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    // Add user_id and memory id to params
    queryParams.push(user.id)
    queryParams.push(id)

    // Update memory
    const result = await executeQuery<any[]>(
      `UPDATE memories SET ${updateFields.join(", ")} WHERE user_id = $${paramIndex} AND id = $${paramIndex + 1} RETURNING *`,
      queryParams,
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Memory not found or not authorized" }, { status: 404 })
    }

    const memory = result[0]

    return NextResponse.json({ memory })
  } catch (error: any) {
    console.error("Update memory error:", error)
    return NextResponse.json({ error: error.message || "An error occurred while updating memory" }, { status: 500 })
  }
}

// DELETE /api/memories/[id] - Delete a memory
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    // Delete memory
    const result = await executeQuery<any[]>("DELETE FROM memories WHERE user_id = $1 AND id = $2 RETURNING id", [
      user.id,
      id,
    ])

    if (result.length === 0) {
      return NextResponse.json({ error: "Memory not found or not authorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete memory error:", error)
    return NextResponse.json({ error: error.message || "An error occurred while deleting memory" }, { status: 500 })
  }
}

