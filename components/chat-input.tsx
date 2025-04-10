"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { Camera, Image, Mic, Paperclip, Send, X } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onFileUpload: (file: File) => void
  onCameraCapture: () => void
  onVoiceInput: (audioBlob: Blob) => Promise<string | null>
  isLoading: boolean
}

export function ChatInput({ onSendMessage, onFileUpload, onCameraCapture, onVoiceInput, isLoading }: ChatInputProps) {
  const { t } = useLanguage()
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Clean up recording resources on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileUpload(files[0])
      // Reset the input
      e.target.value = ""
    }
  }

  const handleCameraClick = () => {
    onCameraCapture()
  }

  const handleVoiceRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }

      setIsRecording(false)
      setRecordingTime(0)
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

          // Stop all tracks
          stream.getTracks().forEach((track) => track.stop())

          // Process the audio with the voice input handler
          const transcribedText = await onVoiceInput(audioBlob)

          if (transcribedText) {
            setMessage(transcribedText)
            // Focus the textarea
            if (textareaRef.current) {
              textareaRef.current.focus()
            }
          }
        }

        // Start recording
        mediaRecorder.start()
        setIsRecording(true)

        // Start timer
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
      } catch (error) {
        console.error("Error accessing microphone:", error)
        alert(t("microphoneAccessError"))
      }
    }
  }

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="p-4 border-t border-border bg-background">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("typeMessage")}
          className="pr-12 min-h-[50px] max-h-[200px] resize-none rounded-2xl"
          disabled={isLoading || isRecording}
        />

        <div className="absolute right-3 bottom-3">
          {message.trim() ? (
            <Button
              type="submit"
              size="icon"
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              onClick={handleSend}
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="rounded-full text-muted-foreground"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="mt-2 flex items-center justify-between bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded-lg">
          <div className="flex items-center">
            <div className="animate-pulse h-3 w-3 bg-red-500 rounded-full mr-2"></div>
            <span>
              {t("recording")} {formatRecordingTime(recordingTime)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/20"
            onClick={handleVoiceRecording}
          >
            <X className="h-4 w-4 mr-1" />
            {t("stop")}
          </Button>
        </div>
      )}

      {/* Input options */}
      <div className={`mt-2 flex ${isExpanded ? "justify-between" : "justify-center"} space-x-2`}>
        {isExpanded ? (
          <>
            <Button type="button" size="icon" variant="outline" className="rounded-full" onClick={handleCameraClick}>
              <Camera className="h-5 w-5 text-muted-foreground" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="outline"
              className={`rounded-full ${isRecording ? "bg-red-100 text-red-500 border-red-500" : ""}`}
              onClick={handleVoiceRecording}
              disabled={isLoading}
            >
              <Mic className="h-5 w-5 text-muted-foreground" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className="h-5 w-5 text-muted-foreground" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv"
              className="hidden"
            />
          </>
        ) : (
          <>
            <Button type="button" size="icon" variant="outline" className="rounded-full" onClick={handleCameraClick}>
              <Camera className="h-5 w-5 text-muted-foreground" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="outline"
              className={`rounded-full ${isRecording ? "bg-red-100 text-red-500 border-red-500" : ""}`}
              onClick={handleVoiceRecording}
              disabled={isLoading}
            >
              <Mic className="h-5 w-5 text-muted-foreground" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className="h-5 w-5 text-muted-foreground" />
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv"
              className="hidden"
            />
          </>
        )}
      </div>
    </div>
  )
}

