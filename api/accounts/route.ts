import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get request body
    const { name, type, description } = await request.json()

    // Validate input
    if (!name || !type) {
      return NextResponse.json({ error: "Name and type are required" }, { status: 400 })
    }

    // Create account
    const accountResult = await executeQuery<any[]>(
      "INSERT INTO accounts (name, type, description) VALUES ($1, $2, $3) RETURNING id, name, type, description",
      [name, type, description || null],
    )

    if (accountResult.length === 0) {
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
    }

    const account = accountResult[0]

    // Link user to account
    await executeQuery("INSERT INTO user_accounts (user_id, account_id) VALUES ($1, $2)", [user.id, account.id])

    return NextResponse.json({ account })
  } catch (error: any) {
    console.error("Create account error:", error)
    return NextResponse.json(
      { error: error.message || "An error occurred while creating the account" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user accounts
    const accounts = await executeQuery<any[]>(
      `SELECT a.* 
       FROM accounts a
       JOIN user_accounts ua ON a.id = ua.account_id
       WHERE ua.user_id = $1`,
      [user.id],
    )

    return NextResponse.json({ accounts })
  } catch (error: any) {
    console.error("Get accounts error:", error)
    return NextResponse.json({ error: error.message || "An error occurred while fetching accounts" }, { status: 500 })
  }
}

