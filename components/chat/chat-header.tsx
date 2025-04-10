"use client"

import Link from "next/link"
import { AccountSelector } from "@/components/account-selector"
import { ProfileMenu } from "@/components/profile-menu"
import type { Account } from "@/lib/types"

interface ChatHeaderProps {
  currentAccount: Account
  accounts: Account[]
  theme: "light" | "dark"
  onToggleTheme: () => void
  onSelectAccount: (account: Account) => void
  onCreateAccount: () => void
}

export function ChatHeader({
  currentAccount,
  accounts,
  theme,
  onToggleTheme,
  onSelectAccount,
  onCreateAccount,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-card rounded-b-xl shadow-md max-w-6xl mx-auto w-full">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer">
            Rico
          </h1>
        </Link>
      </div>

      <AccountSelector
        accounts={accounts}
        selectedAccount={currentAccount}
        onSelectAccount={onSelectAccount}
        onCreateAccount={onCreateAccount}
      />

      <ProfileMenu selectedAccount={currentAccount} theme={theme} onToggleTheme={onToggleTheme} />
    </header>
  )
}

