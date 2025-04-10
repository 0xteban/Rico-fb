"use client"

import { useState, useRef } from "react"
import { X, Info, User, Users, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface NewAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateAccount: (accountData: {
    name: string
    description: string
    type: "personal" | "shared"
  }) => void
}

export function NewAccountModal({ isOpen, onClose, onCreateAccount }: NewAccountModalProps) {
  const { t, language } = useLanguage()
  const [accountType, setAccountType] = useState<"personal" | "shared">("personal")
  const [accountName, setAccountName] = useState("")
  const [description, setDescription] = useState("")
  const [showTooltip, setShowTooltip] = useState(false)
  const [showShareLink, setShowShareLink] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareableLinkRef = useRef<HTMLInputElement>(null)

  const handleCreateAccount = () => {
    if (!accountName.trim()) return

    onCreateAccount({
      name: accountName,
      description,
      type: accountType,
    })

    if (accountType === "shared") {
      setShowShareLink(true)
    } else {
      resetAndClose()
    }
  }

  const resetAndClose = () => {
    setAccountName("")
    setDescription("")
    setAccountType("personal")
    setShowShareLink(false)
    setCopied(false)
    onClose()
  }

  const copyShareableLink = () => {
    if (shareableLinkRef.current) {
      shareableLinkRef.current.select()
      document.execCommand("copy")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Generate a fake shareable link for demo purposes
  const shareableLink = `https://rico.finance/join/${Math.random().toString(36).substring(2, 10)}`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background border border-border rounded-xl shadow-lg overflow-hidden">
        {!showShareLink ? (
          <>
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h2 className="text-xl font-bold">{t("createNewAccount")}</h2>
              <Button variant="ghost" size="icon" onClick={resetAndClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-5">
              <p className="text-muted-foreground mb-6">{t("createNewAccountDescription")}</p>

              {/* Account Type Selection */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-medium">{t("accountType")}</h3>
                  <button
                    className="text-muted-foreground hover:text-foreground"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(!showTooltip)}
                  >
                    <Info className="h-4 w-4" />
                  </button>
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-10 mt-2 p-3 bg-popover border border-border rounded-lg shadow-lg text-sm max-w-xs ml-6 mt-6"
                      >
                        {accountType === "personal" ? (
                          <p>{t("personalAccountDescription")}</p>
                        ) : (
                          <p>{t("sharedAccountDescription")}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                  <button
                    className={cn(
                      "flex items-center justify-center gap-2 py-3 rounded-md transition-all",
                      accountType === "personal"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => setAccountType("personal")}
                  >
                    <User className="h-5 w-5" />
                    <span>{t("personal")}</span>
                  </button>
                  <button
                    className={cn(
                      "flex items-center justify-center gap-2 py-3 rounded-md transition-all",
                      accountType === "shared"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => setAccountType("shared")}
                  >
                    <Users className="h-5 w-5" />
                    <span>{t("shared")}</span>
                  </button>
                </div>
              </div>

              {/* Account Name */}
              <div className="mb-4">
                <label htmlFor="account-name" className="block text-sm font-medium mb-2">
                  {t("accountName")}
                </label>
                <Input
                  id="account-name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder={
                    accountType === "personal" ? t("personalAccountNamePlaceholder") : t("sharedAccountNamePlaceholder")
                  }
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="account-description" className="block text-sm font-medium mb-2">
                  {t("description")} ({t("optional")})
                </label>
                <Textarea
                  id="account-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    accountType === "personal"
                      ? t("personalAccountDescriptionPlaceholder")
                      : t("sharedAccountDescriptionPlaceholder")
                  }
                  className="w-full resize-none"
                  rows={3}
                />
              </div>

              {/* Shared Account Note */}
              {accountType === "shared" && (
                <div className="mb-6 text-sm text-muted-foreground">{t("sharedAccountNote")}</div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={resetAndClose}>
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleCreateAccount}
                  disabled={!accountName.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  {t("createAccount")}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h2 className="text-xl font-bold">{t("inviteMembers")}</h2>
              <Button variant="ghost" size="icon" onClick={resetAndClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-5">
              <div className="mb-6">
                <p className="text-muted-foreground mb-4">{t("accountCreatedSuccessfully")}</p>
                <p className="font-medium mb-2">{t("shareThisLink")}</p>

                <div className="flex gap-2">
                  <Input ref={shareableLinkRef} value={shareableLink} readOnly className="flex-1" />
                  <Button onClick={copyShareableLink} variant="outline" className="flex-shrink-0">
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? t("copied") : t("copy")}
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="text-muted-foreground">{t("inviteLinkDescription")}</p>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={resetAndClose}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  {t("done")}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

