import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Initialize the database connection
export const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)

// Helper function to execute SQL queries
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T> {
  try {
    const result = await sql(query, params)
    return result as T
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

