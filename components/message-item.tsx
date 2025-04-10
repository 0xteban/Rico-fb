import type { Message } from "@/lib/types"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Calendar, Tag } from "lucide-react"

interface MessageItemProps {
  message: Message
  isConsecutive?: boolean
}

export default function MessageItem({ message, isConsecutive = false }: MessageItemProps) {
  const isUser = message.sender === "user"

  const getBubbleStyle = () => {
    const baseStyle = "p-3 shadow-sm inline-block max-w-full break-words"

    if (isUser) {
      return cn(baseStyle, "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-sm")
    } else {
      return cn(baseStyle, "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl rounded-tl-sm")
    }
  }

  if (message.type === "expense") {
    const expense = message.content
    return (
      <div className={cn("mb-2", isConsecutive ? "mt-1" : "mt-4")}>
        <div
          className={cn(
            "rounded-xl overflow-hidden bg-background dark:bg-gray-800 border border-border dark:border-gray-700 shadow-md",
            isUser ? "ml-auto" : "mr-auto",
          )}
        >
          <div className="p-3 bg-muted/50 dark:bg-gray-800 border-b border-border dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-muted-foreground text-xs mr-2">{expense.vendor}</span>
            </div>
            <span className="font-bold text-foreground">${expense.amount.toFixed(2)}</span>
          </div>
          <div className="p-3">
            <p className="text-foreground font-medium mb-2">{expense.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {expense.categories?.map((category, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-foreground/80 flex items-center"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {category}
                </span>
              ))}
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {expense.date}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (message.type === "image") {
    return (
      <div className={cn("mb-2", isConsecutive ? "mt-1" : "mt-4")}>
        <div className={getBubbleStyle()}>
          <div className="relative h-60 w-full rounded-lg overflow-hidden">
            <Image
              src={message.content.imageUrl || "/placeholder.svg"}
              alt={message.content.caption || "Uploaded image"}
              fill
              className="object-cover"
            />
          </div>
          {message.content.caption && <p className="mt-2 text-sm">{message.content.caption}</p>}
        </div>
      </div>
    )
  }

  if (message.type === "summary") {
    const summary = message.content.summary
    return (
      <div className={cn("mb-2", isConsecutive ? "mt-1" : "mt-4")}>
        <div className="bg-background dark:bg-gray-800 rounded-xl overflow-hidden border border-border dark:border-gray-700 shadow-md">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-900 dark:text-white">{message.content.text}</p>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-500 dark:text-gray-400">Total Spending</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">${summary?.total.toFixed(2)}</span>
            </div>
            <div className="space-y-2">
              {summary?.categories.map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-2"
                      style={{
                        backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                      }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                  </div>
                  <span className="text-gray-900 dark:text-white">${category.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (message.type === "budget") {
    const budget = message.content.budgetInfo
    return (
      <div className={cn("mb-2", isConsecutive ? "mt-1" : "mt-4")}>
        <div className="bg-background dark:bg-gray-800 rounded-xl overflow-hidden border border-border dark:border-gray-700 shadow-md">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-900 dark:text-white">{message.content.text}</p>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{budget?.category}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(budget?.startDate || "").toLocaleDateString()} -{" "}
                {new Date(budget?.endDate || "").toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">${budget?.amount.toFixed(2)}</span>
              <span className="text-sm text-green-500">Budget Set</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (message.type === "budget-status") {
    const status = message.content.budgetStatus
    return (
      <div className={cn("mb-2", isConsecutive ? "mt-1" : "mt-4")}>
        <div className="bg-background dark:bg-gray-800 rounded-xl overflow-hidden border border-border dark:border-gray-700 shadow-md">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-900 dark:text-white">{message.content.text}</p>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{status?.category}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(status?.startDate || "").toLocaleDateString()} -{" "}
                {new Date(status?.endDate || "").toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold">${status?.spentAmount.toFixed(2)}</span>
              <span className="text-sm">of ${status?.budgetAmount.toFixed(2)}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
              <div
                className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${status?.percentUsed}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-500">${status?.remainingAmount.toFixed(2)} remaining</span>
              <span>{status?.percentUsed}% used</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (message.type === "recent-expenses") {
    const expenses = message.content.recentExpenses
    return (
      <div className={cn("mb-2", isConsecutive ? "mt-1" : "mt-4")}>
        <div className="bg-background dark:bg-gray-800 rounded-xl overflow-hidden border border-border dark:border-gray-700 shadow-md">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-900 dark:text-white">{message.content.text}</p>
          </div>
          <div className="p-3">
            <div className="space-y-3">
              {expenses?.map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="mr-2">{expense.category}</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="font-bold">${expense.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (message.type === "insights") {
    const insights = message.content.insights
    return (
      <div className={cn("mb-2", isConsecutive ? "mt-1" : "mt-4")}>
        <div className="bg-background dark:bg-gray-800 rounded-xl overflow-hidden border border-border dark:border-gray-700 shadow-md">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-900 dark:text-white">{message.content.text}</p>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Monthly Spending</span>
                <span className="font-bold">${insights?.totalSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Top Category</span>
                <span className="text-sm font-medium">{insights?.topCategory}</span>
              </div>
              {insights?.monthOverMonthChange && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Month-over-Month</span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      insights.monthOverMonthChange > 0 ? "text-red-500" : "text-green-500",
                    )}
                  >
                    {insights.monthOverMonthChange > 0 ? "+" : ""}
                    {insights.monthOverMonthChange}%
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Recommendations:</h4>
              <ul className="space-y-2 text-sm">
                {insights?.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mr-2 mt-0.5">
                      <span className="text-xs">{index + 1}</span>
                    </div>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (message.type === "goal") {
    const goal = message.content.goal
    return (
      <div className={cn("mb-2", isConsecutive ? "mt-1" : "mt-4")}>
        <div className="bg-background dark:bg-gray-800 rounded-xl overflow-hidden border border-border dark:border-gray-700 shadow-md">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-900 dark:text-white">{message.content.text}</p>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">{goal?.name}</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold">${goal?.currentAmount}</span>
              <span className="text-sm">of ${goal?.targetAmount} goal</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
              <div
                className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${goal?.percentComplete}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>{goal?.percentComplete}% complete</span>
              <span>Deadline: {new Date(goal?.deadline || "").toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (message.type === "recurring-expense") {
    const expense = message.content.recurringExpense
    return (
      <div className={cn("mb-2", isConsecutive ? "mt-1" : "mt-4")}>
        <div className="bg-background dark:bg-gray-800 rounded-xl overflow-hidden border border-border dark:border-gray-700 shadow-md">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-900 dark:text-white">{message.content.text}</p>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">{expense?.title}</h3>
              <span className="text-xl font-bold">${expense?.amount.toFixed(2)}</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{expense?.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frequency</span>
                <span>{expense?.frequency.charAt(0).toUpperCase() + expense?.frequency.slice(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date</span>
                <span>{new Date(expense?.startDate || "").toLocaleDateString()}</span>
              </div>
              {expense?.notes && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-muted-foreground">{expense.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (message.type === "recurring-income") {
    const income = message.content.recurringIncome
    return (
      <div className={cn("mb-2", isConsecutive ? "mt-1" : "mt-4")}>
        <div className="bg-background dark:bg-gray-800 rounded-xl overflow-hidden border border-border dark:border-gray-700 shadow-md">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-900 dark:text-white">{message.content.text}</p>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">{income?.source}</h3>
              <span className="text-xl font-bold text-green-500">+${income?.amount.toFixed(2)}</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frequency</span>
                <span>{income?.frequency.charAt(0).toUpperCase() + income?.frequency.slice(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date</span>
                <span>{new Date(income?.startDate || "").toLocaleDateString()}</span>
              </div>
              {income?.notes && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-muted-foreground">{income.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default text message
  return (
    <div className={cn("mb-2 flex", isConsecutive ? "mt-1" : "mt-4", isUser ? "justify-end" : "justify-start")}>
      <div className={getBubbleStyle()}>
        <p className="break-words">{message.content.text}</p>
      </div>
    </div>
  )
}

