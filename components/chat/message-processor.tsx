"use client"

import { useState } from "react"
import type { Message } from "@/lib/types"
import { useLanguage } from "@/contexts/language-context"
import { generateAIResponse } from "@/lib/ai/ai-service"

interface MessageProcessorProps {
  onProcessingComplete: (messages: Message[]) => void
}

export function useMessageProcessor(onProcessingComplete: (messages: Message[]) => void) {
  const { language } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)

  const processMessage = async (userMessage: Message, allMessages: Message[]) => {
    setIsProcessing(true)

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

      // Add user message and loading message to the UI
      onProcessingComplete([...allMessages, userMessage, loadingMessage])

      // Define system prompt for financial assistant
      const systemPrompt = `You are Rico, an AI financial assistant. 
      Help users manage their finances, track expenses, create budgets, and provide financial insights.
      Be concise, helpful, and focus on financial matters. 
      If you don't know something specific about the user's finances, you can ask for more information.
      Use the available functions to help users track their finances.
      Current language: ${language}`

      // Generate AI response
      const response = await generateAIResponse([...allMessages, userMessage], systemPrompt)

      // Create response messages
      const responseMessages: Message[] = []

      // Remove loading message
      const messagesWithoutLoading = [...allMessages, userMessage].filter((msg) => msg.id !== loadingMessageId)

      if (response.error) {
        // Handle error
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: {
            text:
              language === "en"
                ? "I'm sorry, I encountered an error. Please try again."
                : "Lo siento, encontré un error. Por favor, inténtalo de nuevo.",
          },
          timestamp: new Date(),
          type: "text",
          sender: "assistant",
        }
        responseMessages.push(errorMessage)
      } else {
        // Check if we have a function result
        if (response.functionName && response.functionResult) {
          // Create appropriate message based on function type
          let functionMessage: Message

          switch (response.functionName) {
            case "add_expense":
              functionMessage = {
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
              break

            case "get_expense_summary":
              functionMessage = {
                id: (Date.now() + 2).toString(),
                content: {
                  text:
                    response.text ||
                    `${language === "en" ? "Expense summary for" : "Resumen de gastos para"} ${response.functionResult.timeFrame}:`,
                  summary: {
                    total: response.functionResult.total,
                    categories: response.functionResult.categories,
                  },
                },
                timestamp: new Date(),
                type: "summary",
                sender: "assistant",
              }
              break

            case "set_budget":
              functionMessage = {
                id: (Date.now() + 2).toString(),
                content: {
                  text:
                    response.text ||
                    (language === "en" ? "Budget set successfully" : "Presupuesto establecido con éxito"),
                  budgetInfo: {
                    amount: response.functionResult.amount,
                    category: response.functionResult.category,
                    startDate: response.functionResult.startDate,
                    endDate: response.functionResult.endDate,
                  },
                },
                timestamp: new Date(),
                type: "budget",
                sender: "assistant",
              }
              break

            case "check_budget_status":
              functionMessage = {
                id: (Date.now() + 2).toString(),
                content: {
                  text:
                    response.text ||
                    `${language === "en" ? "Budget status for" : "Estado del presupuesto para"} ${response.functionResult.category}:`,
                  budgetStatus: {
                    category: response.functionResult.category,
                    budgetAmount: response.functionResult.budgetAmount,
                    spentAmount: response.functionResult.spentAmount,
                    remainingAmount: response.functionResult.remainingAmount,
                    startDate: response.functionResult.startDate,
                    endDate: response.functionResult.endDate,
                    percentUsed: response.functionResult.percentUsed,
                  },
                },
                timestamp: new Date(),
                type: "budget-status",
                sender: "assistant",
              }
              break

            case "list_recent_expenses":
              functionMessage = {
                id: (Date.now() + 2).toString(),
                content: {
                  text: response.text || (language === "en" ? "Recent expenses" : "Gastos recientes"),
                  recentExpenses: response.functionResult.expenses,
                },
                timestamp: new Date(),
                type: "recent-expenses",
                sender: "assistant",
              }
              break

            case "get_spending_insights":
              functionMessage = {
                id: (Date.now() + 2).toString(),
                content: {
                  text: response.text || (language === "en" ? "Spending insights" : "Análisis de gastos"),
                  insights: {
                    timeFrame: response.functionResult.timeFrame,
                    totalSpent: response.functionResult.totalSpent,
                    topCategory: response.functionResult.topCategory,
                    monthOverMonthChange: response.functionResult.monthOverMonthChange,
                    recommendations: response.functionResult.recommendations,
                  },
                },
                timestamp: new Date(),
                type: "insights",
                sender: "assistant",
              }
              break

            case "set_financial_goal":
              functionMessage = {
                id: (Date.now() + 2).toString(),
                content: {
                  text:
                    response.text ||
                    (language === "en" ? "Financial goal set successfully" : "Meta financiera establecida con éxito"),
                  goal: {
                    name: response.functionResult.name,
                    targetAmount: response.functionResult.targetAmount,
                    deadline: response.functionResult.deadline,
                    currentAmount: response.functionResult.currentAmount || 0,
                    percentComplete: response.functionResult.percentComplete || 0,
                  },
                },
                timestamp: new Date(),
                type: "goal",
                sender: "assistant",
              }
              break

            case "query_user_data":
              // For query results, we'll just use a text message with the results
              functionMessage = {
                id: (Date.now() + 2).toString(),
                content: {
                  text: response.text || response.functionResult.results.join("\n"),
                },
                timestamp: new Date(),
                type: "text",
                sender: "assistant",
              }
              break

            default:
              // Default to text message if function type is not recognized
              functionMessage = {
                id: (Date.now() + 2).toString(),
                content: {
                  text: response.text || JSON.stringify(response.functionResult),
                },
                timestamp: new Date(),
                type: "text",
                sender: "assistant",
              }
          }

          responseMessages.push(functionMessage)
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
      onProcessingComplete([...messagesWithoutLoading, ...responseMessages])
    } catch (error) {
      console.error("Error in chat:", error)
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: {
          text:
            language === "en"
              ? "I'm sorry, something went wrong. Please try again."
              : "Lo siento, algo salió mal. Por favor, inténtalo de nuevo.",
        },
        timestamp: new Date(),
        type: "text",
        sender: "assistant",
      }
      onProcessingComplete([...allMessages, userMessage, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  return { processMessage, isProcessing }
}

