"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, BookOpen, Plus, Star, Trash2 } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Memory {
  id: number
  text: string
  is_suggested: boolean
  is_user_created: boolean
  created_at: string
}

export default function MemoriesPage() {
  const { t } = useLanguage()
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [memories, setMemories] = useState<Memory[]>([])
  const [suggestedMemories, setSuggestedMemories] = useState<Memory[]>([])
  const [newMemoryText, setNewMemoryText] = useState("")
  const [isAddingMemory, setIsAddingMemory] = useState(false)
  const [isLoadingMemories, setIsLoadingMemories] = useState(true)
  const [activeTab, setActiveTab] = useState("your-memories")

  // Load memories when component mounts
  useEffect(() => {
    if (user) {
      fetchMemories()
    } else if (!isLoading) {
      // If not logged in and not loading, redirect to home
      router.push("/")
    }
  }, [user, isLoading, router])

  const fetchMemories = async () => {
    setIsLoadingMemories(true)
    try {
      const response = await fetch("/api/memories")
      const data = await response.json()

      if (response.ok) {
        // Separate user memories and suggested memories
        const userMems = data.memories.filter((m: Memory) => !m.is_suggested)
        const suggestedMems = data.memories.filter((m: Memory) => m.is_suggested)

        setMemories(userMems)
        setSuggestedMemories(suggestedMems)
      }
    } catch (error) {
      console.error("Error fetching memories:", error)
    } finally {
      setIsLoadingMemories(false)
    }
  }

  const addMemory = async () => {
    if (!newMemoryText.trim()) return

    setIsAddingMemory(true)
    try {
      const response = await fetch("/api/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newMemoryText,
          is_user_created: true,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMemories([...memories, data.memory])
        setNewMemoryText("")
      }
    } catch (error) {
      console.error("Error adding memory:", error)
    } finally {
      setIsAddingMemory(false)
    }
  }

  const deleteMemory = async (id: number) => {
    try {
      const response = await fetch(`/api/memories/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMemories(memories.filter((m) => m.id !== id))
      }
    } catch (error) {
      console.error("Error deleting memory:", error)
    }
  }

  const addSuggestedMemory = async (memory: Memory) => {
    try {
      // First, update the memory to mark it as not suggested
      const response = await fetch(`/api/memories/${memory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_suggested: false,
        }),
      })

      if (response.ok) {
        // Move the memory from suggested to user memories
        setSuggestedMemories(suggestedMemories.filter((m) => m.id !== memory.id))
        setMemories([...memories, { ...memory, is_suggested: false }])
      }
    } catch (error) {
      console.error("Error adding suggested memory:", error)
    }
  }

  const dismissSuggestedMemory = async (id: number) => {
    try {
      const response = await fetch(`/api/memories/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuggestedMemories(suggestedMemories.filter((m) => m.id !== id))
      }
    } catch (error) {
      console.error("Error dismissing suggested memory:", error)
    }
  }

  if (isLoading || isLoadingMemories) {
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
        <h1 className="text-2xl font-bold">{t("memories")}</h1>
      </div>

      <Card className="border border-border shadow-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            {t("whatAreMemories")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("memoriesExplanation")}</p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="your-memories">{t("yourMemories")}</TabsTrigger>
            <TabsTrigger value="suggested-memories" className="relative">
              {t("suggestedMemories")}
              {suggestedMemories.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  {suggestedMemories.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="your-memories" className="space-y-4 pt-4">
            {/* Add new memory form */}
            <Card className="border border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder={t("enterNewMemory")}
                    value={newMemoryText}
                    onChange={(e) => setNewMemoryText(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button
                    onClick={addMemory}
                    disabled={!newMemoryText.trim() || isAddingMemory}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    {isAddingMemory ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        {t("adding")}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("addMemory")}
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* List of memories */}
            {memories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t("noMemoriesYet")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {memories.map((memory) => (
                  <Card key={memory.id} className="border border-border shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <p className="flex-1">{memory.text}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMemory(memory.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="suggested-memories" className="space-y-4 pt-4">
            {suggestedMemories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t("noSuggestedMemories")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestedMemories.map((memory) => (
                  <Card key={memory.id} className="border border-border shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <p className="flex-1">{memory.text}</p>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => addSuggestedMemory(memory)}
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => dismissSuggestedMemory(memory.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

