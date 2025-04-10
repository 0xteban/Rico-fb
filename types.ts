export interface User {
  id: number
  email: string
  name: string
  avatar?: string
}

export interface Account {
  id: string | number
  name: string
  avatar?: string
  type: "personal" | "shared"
  description?: string
}

export interface ExpenseContent {
  amount: number
  description: string
  vendor: string
  date: string
  categories?: string[]
  text?: never
  imageUrl?: never
  caption?: never
  summary?: never
  budgetInfo?: never
  recentExpenses?: never
  insights?: never
  goal?: never
  recurringExpense?: never
  recurringIncome?: never
  budgetStatus?: never
}

export interface TextContent {
  text: string
  amount?: never
  description?: never
  vendor?: never
  date?: never
  categories?: never
  imageUrl?: never
  caption?: never
  summary?: never
  budgetInfo?: never
  recentExpenses?: never
  insights?: never
  goal?: never
  recurringExpense?: never
  recurringIncome?: never
  budgetStatus?: never
}

export interface ImageContent {
  imageUrl: string
  caption?: string
  amount?: never
  description?: never
  vendor?: never
  date?: never
  categories?: never
  text?: never
  summary?: never
  budgetInfo?: never
  recentExpenses?: never
  insights?: never
  goal?: never
  recurringExpense?: never
  recurringIncome?: never
  budgetStatus?: never
}

export interface SummaryContent {
  text: string
  summary: {
    total: number
    categories: Array<{
      name: string
      amount: number
    }>
  }
  amount?: never
  description?: never
  vendor?: never
  date?: never
  categories?: never
  imageUrl?: never
  caption?: never
  budgetInfo?: never
  recentExpenses?: never
  insights?: never
  goal?: never
  recurringExpense?: never
  recurringIncome?: never
  budgetStatus?: never
}

export interface BudgetContent {
  text: string
  budgetInfo: {
    amount: number
    category: string
    startDate: string
    endDate: string
  }
  amount?: never
  description?: never
  vendor?: never
  date?: never
  categories?: never
  imageUrl?: never
  caption?: never
  summary?: never
  recentExpenses?: never
  insights?: never
  goal?: never
  recurringExpense?: never
  recurringIncome?: never
  budgetStatus?: never
}

export interface BudgetStatusContent {
  text: string
  budgetStatus: {
    category: string
    budgetAmount: number
    spentAmount: number
    remainingAmount: number
    startDate: string
    endDate: string
    percentUsed: number
  }
  amount?: never
  description?: never
  vendor?: never
  date?: never
  categories?: never
  imageUrl?: never
  caption?: never
  summary?: never
  budgetInfo?: never
  recentExpenses?: never
  insights?: never
  goal?: never
  recurringExpense?: never
  recurringIncome?: never
}

export interface RecentExpensesContent {
  text: string
  recentExpenses: Array<{
    id: string
    title: string
    amount: number
    category: string
    date: string
  }>
  amount?: never
  description?: never
  vendor?: never
  date?: never
  categories?: never
  imageUrl?: never
  caption?: never
  summary?: never
  budgetInfo?: never
  insights?: never
  goal?: never
  recurringExpense?: never
  recurringIncome?: never
  budgetStatus?: never
}

export interface InsightsContent {
  text: string
  insights: {
    timeFrame: string
    totalSpent: number
    topCategory: string
    recommendations: string[]
    monthOverMonthChange?: number
  }
  amount?: never
  description?: never
  vendor?: never
  date?: never
  categories?: never
  imageUrl?: never
  caption?: never
  summary?: never
  budgetInfo?: never
  recentExpenses?: never
  insights?: never
  goal?: never
  recurringExpense?: never
  recurringIncome?: never
  budgetStatus?: never
}

export interface GoalContent {
  text: string
  goal: {
    name: string
    targetAmount: number
    deadline: string
    currentAmount?: number
    percentComplete?: number
  }
  amount?: never
  description?: never
  vendor?: never
  date?: never
  categories?: never
  imageUrl?: never
  caption?: never
  summary?: never
  budgetInfo?: never
  recentExpenses?: never
  insights?: never
  recurringExpense?: never
  recurringIncome?: never
  budgetStatus?: never
}

export interface RecurringExpenseContent {
  text: string
  recurringExpense: {
    title: string
    amount: number
    category: string
    startDate: string
    frequency: string
    notes?: string
  }
  amount?: never
  description?: never
  vendor?: never
  date?: never
  categories?: never
  imageUrl?: never
  caption?: never
  summary?: never
  budgetInfo?: never
  recentExpenses?: never
  insights?: never
  goal?: never
  recurringIncome?: never
  budgetStatus?: never
}

export interface RecurringIncomeContent {
  text: string
  recurringIncome: {
    source: string
    amount: number
    startDate: string
    frequency: string
    notes?: string
  }
  amount?: never
  description?: never
  vendor?: never
  date?: never
  categories?: never
  imageUrl?: never
  caption?: never
  summary?: never
  budgetInfo?: never
  recentExpenses?: never
  insights?: never
  goal?: never
  recurringExpense?: never
  budgetStatus?: never
}

export type MessageContent =
  | ExpenseContent
  | TextContent
  | ImageContent
  | SummaryContent
  | BudgetContent
  | BudgetStatusContent
  | RecentExpensesContent
  | InsightsContent
  | GoalContent
  | RecurringExpenseContent
  | RecurringIncomeContent

export interface Message {
  id: string
  content: any
  timestamp: Date
  type: string
  sender?: "user" | "assistant"
}

export interface Memory {
  id: number
  text: string
  is_suggested: boolean
  is_user_created: boolean
  created_at: string
}

