import { cookies } from "next/headers"
import { executeQuery } from "./db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const TOKEN_EXPIRY = "7d" // Token expires in 7 days

// User type definition
export interface User {
  id: number
  email: string
  name: string
  avatar?: string
}

// Register a new user
export async function registerUser(email: string, password: string, name: string): Promise<User | null> {
  try {
    // Check if user already exists
    const existingUser = await executeQuery<any[]>("SELECT * FROM users WHERE email = $1", [email])

    if (existingUser.length > 0) {
      throw new Error("User already exists")
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Get first letter of name for avatar
    const avatar = name.charAt(0).toUpperCase()

    // Insert the new user
    const result = await executeQuery<any[]>(
      "INSERT INTO users (email, password_hash, name, avatar) VALUES ($1, $2, $3, $4) RETURNING id, email, name, avatar",
      [email, hashedPassword, name, avatar],
    )

    if (result.length === 0) {
      return null
    }

    const user = result[0]

    // Create a personal account for the user
    const accountResult = await executeQuery<any[]>(
      "INSERT INTO accounts (name, type, description) VALUES ($1, $2, $3) RETURNING id",
      [`${name}'s Account`, "personal", "Personal account"],
    )

    if (accountResult.length > 0) {
      // Link user to account
      await executeQuery("INSERT INTO user_accounts (user_id, account_id) VALUES ($1, $2)", [
        user.id,
        accountResult[0].id,
      ])
    }

    return user
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

// Login a user
export async function loginUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
  try {
    // Find the user
    const users = await executeQuery<any[]>(
      "SELECT id, email, password_hash, name, avatar FROM users WHERE email = $1",
      [email],
    )

    if (users.length === 0) {
      return null
    }

    const user = users[0]

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return null
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
      token,
    }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

// Get current user from token
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return null
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }

    // Get user from database
    const users = await executeQuery<any[]>("SELECT id, email, name, avatar FROM users WHERE id = $1", [decoded.id])

    if (users.length === 0) {
      return null
    }

    return users[0]
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

// Get user accounts
export async function getUserAccounts(userId: number) {
  try {
    const accounts = await executeQuery<any[]>(
      `SELECT a.* 
       FROM accounts a
       JOIN user_accounts ua ON a.id = ua.account_id
       WHERE ua.user_id = $1`,
      [userId],
    )

    return accounts
  } catch (error) {
    console.error("Get user accounts error:", error)
    throw error
  }
}

