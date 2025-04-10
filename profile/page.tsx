"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setAvatar(user.avatar || "")
    } else if (!isLoading) {
      // If not logged in and not loading, redirect to home
      router.push("/")
    }
  }, [user, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          avatar: avatar.charAt(0).toUpperCase(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: t("profileUpdated") })
        // Refresh the page after a short delay to show updated data
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setMessage({ type: "error", text: data.error || t("updateFailed") })
      }
    } catch (error) {
      console.error("Profile update error:", error)
      setMessage({ type: "error", text: t("updateFailed") })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/chat" className="mr-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t("profile")}</h1>
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle>{t("personalInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 text-3xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <span>{avatar.charAt(0).toUpperCase()}</span>
              </Avatar>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{t("avatarLetter")}</p>
                <Input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value.charAt(0))}
                  maxLength={1}
                  className="w-16 text-center mx-auto"
                />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                {t("name")}
              </label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                {t("email")}
              </label>
              <Input id="email" type="email" value={email} readOnly className="bg-muted cursor-not-allowed" />
              <p className="text-xs text-muted-foreground">{t("emailCannotBeChanged")}</p>
            </div>

            {/* Status message */}
            {message.text && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === "success"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {isSaving ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  {t("saving")}
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  {t("saveChanges")}
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

