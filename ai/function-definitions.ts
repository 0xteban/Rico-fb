/**
 * Function definitions for OpenAI function calling
 */
export const functionDefinitions = [
  {
    name: "add_expense",
    description: "Log a new expense transaction",
    parameters: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "The amount of the expense",
        },
        description: {
          type: "string",
          description: "Description of the expense",
        },
        vendor: {
          type: "string",
          description: "The vendor or merchant name",
        },
        date: {
          type: "string",
          description: "The date of the expense (YYYY-MM-DD)",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Categories the expense belongs to (e.g., Food, Transportation)",
        },
      },
      required: ["amount", "description", "vendor", "date"],
    },
  },
  {
    name: "get_expense_summary",
    description: "Get a summary of expenses by time period and/or category",
    parameters: {
      type: "object",
      properties: {
        timeFrame: {
          type: "string",
          description: "Time period for the summary (e.g., 'this month', 'last week')",
        },
        category: {
          type: "string",
          description: "Optional category to filter by",
        },
      },
      required: ["timeFrame"],
    },
  },
  {
    name: "set_budget",
    description: "Set a budget for a specific category",
    parameters: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "The budget amount",
        },
        category: {
          type: "string",
          description: "The category for this budget",
        },
        startDate: {
          type: "string",
          description: "Start date for the budget period (YYYY-MM-DD)",
        },
        endDate: {
          type: "string",
          description: "End date for the budget period (YYYY-MM-DD)",
        },
      },
      required: ["amount", "category", "startDate", "endDate"],
    },
  },
  {
    name: "check_budget_status",
    description: "Check the status of a budget",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "The category to check",
        },
      },
      required: ["category"],
    },
  },
  {
    name: "list_recent_expenses",
    description: "List recent expenses",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of expenses to return",
        },
        category: {
          type: "string",
          description: "Optional category to filter by",
        },
      },
      required: ["limit"],
    },
  },
  {
    name: "get_spending_insights",
    description: "Get insights about spending patterns",
    parameters: {
      type: "object",
      properties: {
        timeFrame: {
          type: "string",
          description: "Time period for the insights (e.g., 'this month', 'last 3 months')",
        },
      },
      required: ["timeFrame"],
    },
  },
  {
    name: "set_financial_goal",
    description: "Set a financial goal",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the goal",
        },
        targetAmount: {
          type: "number",
          description: "Target amount to save",
        },
        deadline: {
          type: "string",
          description: "Deadline for the goal (YYYY-MM-DD)",
        },
        currentAmount: {
          type: "number",
          description: "Current amount saved (optional)",
        },
      },
      required: ["name", "targetAmount", "deadline"],
    },
  },
  {
    name: "query_user_data",
    description: "Search through user's financial notes and history",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
      },
      required: ["query"],
    },
  },
]

/**
 * Get function definitions formatted for OpenAI tools
 * @returns Array of function definitions formatted as OpenAI tools
 */
export function getFunctionTools() {
  return functionDefinitions.map((func) => ({
    type: "function" as const,
    function: func,
  }))
}

