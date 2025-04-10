import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const TOKEN_EXPIRY = "7d"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Register the user
    const user = await registerUser(email, password, name)

    if (!user) {
      return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })

    // Set cookie
    cookies().set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: error.message || "An error occurred during signup" }, { status: 500 })
  }
}

