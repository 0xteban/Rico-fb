import { NextResponse } from "next/server"
import { getCurrentUser, getUserAccounts } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user accounts
    const accounts = await getUserAccounts(user.id)

    return NextResponse.json({ user, accounts })
  } catch (error: any) {
    console.error("Get current user error:", error)
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 })
  }
}

