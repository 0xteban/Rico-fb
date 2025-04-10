"use client"

import { useState } from "react"
import type { Message } from "@/lib/types"
import MessageItem from "./message-item"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function FunctionExamples() {
  const [messages] = useState<Message[]>([
    // Example 1: Expense Summary
    {
      id: "summary-1",
      content: {
        text: "Here's your expense summary for March 2025:",
        summary: {
          total: 1245.72,
          categories: [
            { name: "Food", amount: 320.45 },
            { name: "Housing", amount: 650.0 },
            { name: "Transportation", amount: 125.27 },
            { name: "Entertainment", amount: 150.0 },
          ],
        },
      },
      timestamp: new Date(),
      type: "summary",
      sender: "assistant",
    },

    // Example 2: Budget Set
    {
      id: "budget-1",
      content: {
        text: "I've set your monthly food budget as requested.",
        budgetInfo: {
          amount: 350,
          category: "Food & Dining",
          startDate: "2025-04-01",
          endDate: "2025-04-30",
        },
      },
      timestamp: new Date(),
      type: "budget",
      sender: "assistant",
    },

    // Example 3: Budget Status
    {
      id: "budget-status-1",
      content: {
        text: "Here's your current budget status for Entertainment:",
        budgetStatus: {
          category: "Entertainment",
          budgetAmount: 200,
          spentAmount: 175.5,
          remainingAmount: 24.5,
          startDate: "2025-03-01",
          endDate: "2025-03-31",
          percentUsed: 88,
        },
      },
      timestamp: new Date(),
      type: "budget-status",
      sender: "assistant",
    },

    // Example 4: Recent Expenses
    {
      id: "recent-expenses-1",
      content: {
        text: "Here are your most recent expenses:",
        recentExpenses: [
          { id: "exp1", title: "Grocery Shopping", amount: 87.32, category: "Food", date: "2025-03-25" },
          { id: "exp2", title: "Netflix Subscription", amount: 15.99, category: "Entertainment", date: "2025-03-24" },
          { id: "exp3", title: "Gas Station", amount: 45.67, category: "Transportation", date: "2025-03-22" },
          { id: "exp4", title: "Restaurant Dinner", amount: 78.45, category: "Food", date: "2025-03-20" },
          { id: "exp5", title: "Uber Ride", amount: 24.5, category: "Transportation", date: "2025-03-18" },
        ],
      },
      timestamp: new Date(),
      type: "recent-expenses",
      sender: "assistant",
    },

    // Example 5: Spending Insights
    {
      id: "insights-1",
      content: {
        text: "Based on your spending patterns this month, I've identified some insights that might help you save money:",
        insights: {
          timeFrame: "monthly",
          totalSpent: 1875.45,
          topCategory: "Food & Dining",
          monthOverMonthChange: 12.5,
          recommendations: [
            "Your restaurant spending has increased by 25% compared to last month. Consider cooking at home more often.",
            "You could save approximately $45 by switching to a different streaming service bundle.",
            "Your grocery bills tend to be higher on weekends. Try planning your shopping trips for weekdays.",
          ],
        },
      },
      timestamp: new Date(),
      type: "insights",
      sender: "assistant",
    },

    // Example 6: Financial Goal
    {
      id: "goal-1",
      content: {
        text: "I've set up your vacation savings goal as requested:",
        goal: {
          name: "Summer Vacation to Japan",
          targetAmount: 3000,
          deadline: "2025-07-15",
          currentAmount: 750,
          percentComplete: 25,
        },
      },
      timestamp: new Date(),
      type: "goal",
      sender: "assistant",
    },

    // Example 7: Recurring Expense
    {
      id: "recurring-expense-1",
      content: {
        text: "I've added your gym membership as a recurring expense:",
        recurringExpense: {
          title: "Fitness Club Membership",
          amount: 49.99,
          category: "Health & Fitness",
          startDate: "2025-04-01",
          frequency: "monthly",
          notes: "Billed on the 1st of each month. 3-month minimum commitment.",
        },
      },
      timestamp: new Date(),
      type: "recurring-expense",
      sender: "assistant",
    },

    // Example 8: Recurring Income
    {
      id: "recurring-income-1",
      content: {
        text: "I've added your salary as a recurring income source:",
        recurringIncome: {
          source: "ABC Company Salary",
          amount: 4500,
          startDate: "2025-04-15",
          frequency: "monthly",
          notes: "Net amount after taxes and deductions. Deposited on the 15th of each month.",
        },
      },
      timestamp: new Date(),
      type: "recurring-income",
      sender: "assistant",
    },
  ])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={cn("max-w-[85%]", message.sender === "user" ? "ml-auto" : "mr-auto")}
        >
          <MessageItem message={message} isConsecutive={false} />
        </motion.div>
      ))}
    </div>
  )
}

