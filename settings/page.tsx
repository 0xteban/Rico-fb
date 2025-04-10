"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Bell, Globe, Moon, Shield, Trash2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage()
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [dataExportLoading, setDataExportLoading] = useState(false)
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Initialize theme on component mount
  useEffect(() => {
    // Check if user has a saved preference or use system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    localStorage.setItem("theme", newTheme)
  }

  // Handle language change
  const handleLanguageChange = (value: string) => {
    setLanguage(value as "en" | "es")
  }

  // Handle notifications toggle
  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled)
    // Here you would typically save this preference to the user's profile
  }

  // Handle data export
  const handleDataExport = async () => {
    setDataExportLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a sample data object
      const userData = {
        profile: {
          name: user?.name,
          email: user?.email,
          avatar: user?.avatar,
        },
        accounts: [
          {
            name: "Personal Account",
            type: "personal",
          },
        ],
        // Add more data as needed
      }

      // Convert to JSON and create download link
      const dataStr = JSON.stringify(userData, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `rico-data-export-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    } catch (error) {
      console.error("Data export error:", error)
    } finally {
      setDataExportLoading(false)
    }
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user?.email) {
      return
    }

    setDeleteLoading(true)
    try {
      // Here you would call your API to delete the account
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Log the user out
      await logout()

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Account deletion error:", error)
    } finally {
      setDeleteLoading(false)
      setDeleteAccountDialogOpen(false)
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
        <h1 className="text-2xl font-bold">{t("settings")}</h1>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>{t("appearance")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-muted">
                  <Moon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{t("darkMode")}</p>
                  <p className="text-sm text-muted-foreground">{t("darkModeDescription")}</p>
                </div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>{t("language")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-muted">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{t("appLanguage")}</p>
                  <p className="text-sm text-muted-foreground">{t("languageDescription")}</p>
                </div>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder={t("selectLanguage")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>{t("notifications")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-muted">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{t("pushNotifications")}</p>
                  <p className="text-sm text-muted-foreground">{t("notificationsDescription")}</p>
                </div>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={handleNotificationsToggle} />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>{t("privacyAndData")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-muted">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{t("exportData")}</p>
                  <p className="text-sm text-muted-foreground">{t("exportDataDescription")}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDataExport} disabled={dataExportLoading}>
                {dataExportLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
                    {t("exporting")}
                  </span>
                ) : (
                  t("export")
                )}
              </Button>
            </div>

            <div className="pt-2">
              <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("deleteAccount")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("deleteAccountConfirmation")}</DialogTitle>
                    <DialogDescription className="pt-4">{t("deleteAccountWarning")}</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm font-medium mb-2">{t("typeEmailToConfirm")}:</p>
                    <Input
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder={user?.email}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteAccountDialogOpen(false)}>
                      {t("cancel")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmation !== user?.email || deleteLoading}
                    >
                      {deleteLoading ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          {t("deleting")}
                        </span>
                      ) : (
                        t("deleteAccount")
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

