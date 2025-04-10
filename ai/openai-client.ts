import OpenAI from "openai"

/**
 * Initialize and return an OpenAI client instance
 * @returns OpenAI client or null if initialization fails
 */
export function getOpenAIClient() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not defined in environment variables")
      throw new Error("OpenAI API key is missing")
    }

    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Enable for browser testing only
    })
  } catch (error) {
    console.error("Error initializing OpenAI client:", error)
    return null
  }
}

