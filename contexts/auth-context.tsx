"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  name: string
  avatar?: string
}

interface Account {
  id: number
  name: string
  type: "personal" | "shared"
  description?: string
}

interface AuthContextType {
  user: User | null
  accounts: Account[]
  selectedAccount: Account | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  selectAccount: (account: Account) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setAccounts(data.accounts || [])

          // Set selected account to first account if available
          if (data.accounts && data.accounts.length > 0) {
            setSelectedAccount(data.accounts[0])
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Get user accounts
      const accountsResponse = await fetch("/api/auth/me")
      const accountsData = await accountsResponse.json()

      setUser(data.user)
      setAccounts(accountsData.accounts || [])

      // Set selected account to first account if available
      if (accountsData.accounts && accountsData.accounts.length > 0) {
        setSelectedAccount(accountsData.accounts[0])
      }

      router.push("/chat")
    } catch (error: any) {
      setError(error.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      // Get user accounts
      const accountsResponse = await fetch("/api/auth/me")
      const accountsData = await accountsResponse.json()

      setUser(data.user)
      setAccounts(accountsData.accounts || [])

      // Set selected account to first account if available
      if (accountsData.accounts && accountsData.accounts.length > 0) {
        setSelectedAccount(accountsData.accounts[0])
      }

      router.push("/chat")
    } catch (error: any) {
      setError(error.message || "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setIsLoading(true)

    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      setAccounts([])
      setSelectedAccount(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Select account function
  const selectAccount = (account: Account) => {
    setSelectedAccount(account)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accounts,
        selectedAccount,
        isLoading,
        error,
        login,
        signup,
        logout,
        selectAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

