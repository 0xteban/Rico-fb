"use client"

import { useState } from "react"
import type { Message } from "@/lib/types"
import { useLanguage } from "@/contexts/language-context"
import { generateAIResponse } from "@/lib/ai/ai-service"

interface ImageAnalyzerProps {
  onAnalysisComplete: (messages: Message[]) => void
}

export function useImageAnalyzer(onAnalysisComplete: (messages: Message[]) => void) {
  const { language } = useLanguage()
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeImage = async (imageMessage: Message, allMessages: Message[]) => {
    setIsAnalyzing(true)

    try {
      // Create a temporary loading message
      const loadingMessageId = (Date.now() + 1).toString()
      const loadingMessage: Message = {
        id: loadingMessageId,
        content: { text: "..." },
        timestamp: new Date(),
        type: "text",
        sender: "assistant",
      }

      // Add loading message to the UI
      onAnalysisComplete([...allMessages, imageMessage, loadingMessage])

      // Define system prompt for image analysis
      const systemPrompt = `You are Rico, an AI financial assistant. 
      Analyze the image which may contain receipts, invoices, financial documents, or other financial information.
      Extract relevant financial details like amounts, dates, vendors, and categories.
      If appropriate, suggest adding the expense or transaction to the user's records.
      Current language: ${language}`

      // Generate AI response with vision capabilities
      const response = await generateAIResponse([...allMessages, imageMessage], systemPrompt)

      // Create response messages
      const responseMessages: Message[] = []

      // Remove loading message
      const messagesWithoutLoading = [...allMessages, imageMessage].filter((msg) => msg.id !== loadingMessageId)

      if (response.error) {
        // Handle error
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: {
            text:
              language === "en"
                ? "I'm sorry, I encountered an error analyzing the image. Please try again."
                : "Lo siento, encontré un error al analizar la imagen. Por favor, inténtalo de nuevo.",
          },
          timestamp: new Date(),
          type: "text",
          sender: "assistant",
        }
        responseMessages.push(errorMessage)
      } else {
        // Check if we have a function result (e.g., extracted expense)
        if (response.functionName === "add_expense" && response.functionResult) {
          // Add the extracted expense
          const expenseMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: {
              amount: response.functionResult.amount,
              description: response.functionResult.description,
              vendor: response.functionResult.vendor,
              date: response.functionResult.date,
              categories: response.functionResult.categories || [],
            },
            timestamp: new Date(),
            type: "expense",
            sender: "assistant",
          }

          // Add explanation message
          const explanationMessage: Message = {
            id: (Date.now() + 3).toString(),
            content: {
              text:
                response.text ||
                (language === "en"
                  ? `I've extracted this expense from your receipt.`
                  : `He extraído este gasto de tu recibo.`),
            },
            timestamp: new Date(),
            type: "text",
            sender: "assistant",
          }

          responseMessages.push(expenseMessage, explanationMessage)
        } else if (response.text) {
          // Add AI response to chat as text message
          const aiMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: { text: response.text },
            timestamp: new Date(),
            type: "text",
            sender: "assistant",
          }
          responseMessages.push(aiMessage)
        }
      }

      // Return all messages including the new ones
      onAnalysisComplete([...messagesWithoutLoading, ...responseMessages])
    } catch (error) {
      console.error("Error analyzing image:", error)
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: {
          text:
            language === "en"
              ? "I'm sorry, something went wrong analyzing the image. Please try again."
              : "Lo siento, algo salió mal al analizar la imagen. Por favor, inténtalo de nuevo.",
        },
        timestamp: new Date(),
        type: "text",
        sender: "assistant",
      }
      onAnalysisComplete([...allMessages, imageMessage, errorMessage])
    } finally {
      setIsAnalyzing(false)
    }
  }

  return { analyzeImage, isAnalyzing }
}

