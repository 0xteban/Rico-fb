"use client"
import { ChevronDown, Plus, Users, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Account } from "@/lib/types"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

interface AccountSelectorProps {
  accounts: Account[]
  selectedAccount: Account
  onSelectAccount: (account: Account) => void
  onCreateAccount: () => void
}

export function AccountSelector({ accounts, selectedAccount, onSelectAccount, onCreateAccount }: AccountSelectorProps) {
  const { t } = useLanguage()
  const { accounts: authAccounts, selectedAccount: authSelectedAccount, selectAccount } = useAuth()

  // Use auth accounts if available, otherwise use props
  const displayAccounts = authAccounts.length > 0 ? authAccounts : accounts
  const displaySelectedAccount = authSelectedAccount || selectedAccount

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "shared":
        return <Users className="h-4 w-4 mr-1" />
      default:
        return <User className="h-4 w-4 mr-1" />
    }
  }

  const handleSelectAccount = (account: Account) => {
    if (authAccounts.length > 0) {
      selectAccount(account)
    } else {
      onSelectAccount(account)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-between w-52 bg-muted hover:bg-muted/80 rounded-full text-foreground"
        >
          <div className="flex items-center">
            <span className="truncate">{displaySelectedAccount.name}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 bg-popover text-popover-foreground border-border rounded-xl shadow-xl"
      >
        {displayAccounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            onClick={() => handleSelectAccount(account)}
            className="cursor-pointer hover:bg-muted rounded-lg my-1 py-2"
          >
            <div className="flex items-center w-full">
              <div className="flex flex-col">
                <span>{account.name}</span>
                <span className="text-xs text-muted-foreground flex items-center">
                  {typeof getAccountTypeIcon(account.type) === "string"
                    ? getAccountTypeIcon(account.type)
                    : getAccountTypeIcon(account.type)}
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                </span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem onClick={onCreateAccount} className="cursor-pointer hover:bg-muted rounded-lg my-1 py-2">
          <div className="flex items-center text-blue-500 w-full">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/20 text-blue-500 mr-3">
              <Plus className="h-4 w-4" />
            </div>
            <span>{t("createNewAccount")}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

