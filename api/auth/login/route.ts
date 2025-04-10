import { type NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Login the user
    const result = await loginUser(email, password)

    if (!result) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set cookie
    cookies().set({
      name: "auth_token",
      value: result.token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ user: result.user })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: error.message || "An error occurred during login" }, { status: 500 })
  }
}

