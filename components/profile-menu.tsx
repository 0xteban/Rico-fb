"use client"

import Link from "next/link"
import { User, Settings, LogOut, Sun, Moon, BookOpen } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import type { Account } from "@/lib/types"

interface ProfileMenuProps {
  selectedAccount: Account
  theme: "light" | "dark"
  onToggleTheme: () => void
}

export function ProfileMenu({ selectedAccount, theme, onToggleTheme }: ProfileMenuProps) {
  const { t } = useLanguage()
  const { user, logout } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-pointer">
          <span>{user?.avatar || selectedAccount.avatar}</span>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-popover text-popover-foreground border-border rounded-xl shadow-xl"
      >
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-medium">{user?.name || "Guest User"}</p>
          <p className="text-xs text-muted-foreground">{user?.email || "guest@example.com"}</p>
        </div>
        <Link href="/profile" className="w-full">
          <DropdownMenuItem className="cursor-pointer hover:bg-muted rounded-lg my-1 py-2 px-4">
            <div className="flex items-center w-full">
              <div className="h-8 w-8 mr-3 flex items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <span>{t("profile")}</span>
            </div>
          </DropdownMenuItem>
        </Link>
        <Link href="/settings" className="w-full">
          <DropdownMenuItem className="cursor-pointer hover:bg-muted rounded-lg my-1 py-2 px-4">
            <div className="flex items-center w-full">
              <div className="h-8 w-8 mr-3 flex items-center justify-center rounded-full bg-muted">
                <Settings className="h-4 w-4 text-muted-foreground" />
              </div>
              <span>{t("settings")}</span>
            </div>
          </DropdownMenuItem>
        </Link>
        <Link href="/memories" className="w-full">
          <DropdownMenuItem className="cursor-pointer hover:bg-muted rounded-lg my-1 py-2 px-4">
            <div className="flex items-center w-full">
              <div className="h-8 w-8 mr-3 flex items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <span>{t("personalize")}</span>
            </div>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer hover:bg-muted rounded-lg my-1 py-2 px-4" onClick={onToggleTheme}>
          <div className="flex items-center w-full">
            <div className="h-8 w-8 mr-3 flex items-center justify-center rounded-full bg-muted">
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <span>{theme === "dark" ? t("lightTheme") : t("darkTheme")}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-muted text-red-500 rounded-lg my-1 py-2 px-4"
          onClick={logout}
        >
          <div className="flex items-center w-full">
            <div className="h-8 w-8 mr-3 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <LogOut className="h-4 w-4 text-red-500" />
            </div>
            <span>{t("logout")}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

