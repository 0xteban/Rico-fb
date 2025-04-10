"use client"

import { useState, useRef, useEffect } from "react"
import { MessageList } from "./message-list"
import { CameraOverlay } from "./camera-overlay"
import { ChatInput } from "./chat-input"
import { NewAccountModal } from "./new-account-modal"
import { ChatHeader } from "./chat/chat-header"
import { useMessageProcessor } from "./chat/message-processor"
import { useImageAnalyzer } from "./chat/image-analyzer"
import type { Message, Account } from "@/lib/types"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { transcribeAudio } from "@/lib/ai/ai-service"

export default function ChatInterface() {
  const { language } = useLanguage()
  const { user, accounts, selectedAccount, selectAccount } = useAuth()
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: {
        amount: 19.72,
        description: "Gym membership",
        vendor: "Smart Fit Guadalupe",
        date: "2025-03-19",
        categories: ["Health", "Fitness"],
      },
      timestamp: new Date("2025-03-19"),
      type: "expense",
    },
    {
      id: "2",
      content: {
        amount: 69.0,
        description: "Cancha 1 Hora 30 Min Padel, Alquiler Pala Padel",
        vendor: "Volea Padel & Pickleball Club",
        date: "2025-01-14",
        categories: ["Sports", "Recreation"],
      },
      timestamp: new Date("2025-01-14"),
      type: "expense",
    },
  ])
  const [showCamera, setShowCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Use our custom hooks for message processing and image analysis
  const { processMessage, isProcessing } = useMessageProcessor(setMessages)
  const { analyzeImage, isAnalyzing } = useImageAnalyzer(setMessages)

  // Initialize theme on component mount
  useEffect(() => {
    // Check if user has a saved preference or use system preference
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark")
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else if (prefersDark) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Save theme preference when it changes
  useEffect(() => {
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    if (showCamera && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
    }

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [showCamera, cameraStream])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  // Fallback account if no selected account
  const fallbackAccount: Account = {
    id: "1",
    name: user?.name ? `${user.name}'s Account` : "Personal Account",
    avatar: user?.avatar || "P",
    type: "personal",
  }

  // Use selected account from auth context or fallback
  const currentAccount = selectedAccount || fallbackAccount

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: { text: message },
        timestamp: new Date(),
        type: "text",
        sender: "user",
      }

      // Process the message
      await processMessage(userMessage, messages)
    }
  }

  const handleFileUpload = (file: File) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: {
            imageUrl: event.target?.result as string,
            caption: language === "en" ? "Please analyze this image" : "Por favor, analiza esta imagen",
          },
          timestamp: new Date(),
          type: "image",
          sender: "user",
        }

        // Process the image with GPT-4o vision
        analyzeImage(newMessage, messages)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVoiceInput = async (audioBlob: Blob) => {
    try {
      // Transcribe the audio
      const transcription = await transcribeAudio(audioBlob)

      if (transcription.error) {
        throw new Error(transcription.error)
      }

      if (transcription.text) {
        // Return the transcribed text
        return transcription.text
      }
    } catch (error) {
      console.error("Error processing voice input:", error)
      // Show error toast or notification
      alert(
        language === "en"
          ? "Sorry, I couldn't process your voice input. Please try again."
          : "Lo siento, no pude procesar tu entrada de voz. Por favor, inténtalo de nuevo.",
      )
      return null
    }
  }

  const handleCameraCapture = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        setCameraStream(stream)
        setShowCamera(true)
      } catch (err) {
        console.error("Error accessing camera:", err)
      }
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvasRef.current.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageUrl = canvas.toDataURL("image/png")
        const newMessage: Message = {
          id: Date.now().toString(),
          content: {
            imageUrl,
            caption: language === "en" ? "Please analyze this receipt" : "Por favor, analiza este recibo",
          },
          timestamp: new Date(),
          type: "image",
          sender: "user",
        }

        setShowCamera(false)

        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop())
          setCameraStream(null)
        }

        // Process the image with GPT-4o vision
        analyzeImage(newMessage, messages)
      }
    }
  }

  const closeCamera = () => {
    setShowCamera(false)
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
  }

  const handleCreateAccount = async (accountData: {
    name: string
    description: string
    type: "personal" | "shared"
  }) => {
    try {
      // Create account in database
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      })

      if (!response.ok) {
        throw new Error("Failed to create account")
      }

      const data = await response.json()

      // Refresh accounts list
      const accountsResponse = await fetch("/api/auth/me")
      const accountsData = await accountsResponse.json()

      // Close modal for personal accounts
      if (accountData.type === "personal") {
        setIsNewAccountModalOpen(false)
      }

      return data.account
    } catch (error) {
      console.error("Error creating account:", error)
      return null
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background text-foreground">
      {/* Header */}
      <ChatHeader
        currentAccount={currentAccount}
        accounts={accounts}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelectAccount={selectAccount}
        onCreateAccount={() => setIsNewAccountModalOpen(true)}
      />

      {/* Messages Container */}
      <MessageList messages={messages} />

      {/* Input Area */}
      <div className="max-w-6xl mx-auto w-full">
        <ChatInput
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          onCameraCapture={handleCameraCapture}
          onVoiceInput={handleVoiceInput}
          isLoading={isProcessing || isAnalyzing}
        />
      </div>

      {/* Camera Overlay */}
      {showCamera && (
        <CameraOverlay videoRef={videoRef} canvasRef={canvasRef} onClose={closeCamera} onCapture={capturePhoto} />
      )}

      {/* New Account Modal */}
      <NewAccountModal
        isOpen={isNewAccountModalOpen}
        onClose={() => setIsNewAccountModalOpen(false)}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  )
}

