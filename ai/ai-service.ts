import type { Message } from "@/lib/types"
import { getOpenAIClient } from "./openai-client"
import { convertMessagesToAIFormat } from "./message-utils"
import { getFunctionTools } from "./function-definitions"
import { handleFunctionCall } from "./function-handlers"

/**
 * Generate an AI response based on messages and system prompt
 * @param messages Array of messages for context
 * @param systemPrompt System prompt to guide the AI
 * @returns Generated response with optional function call results
 */
export async function generateAIResponse(messages: Message[], systemPrompt?: string) {
  try {
    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.warn("Invalid or empty messages array provided to generateAIResponse")
      return {
        text: "I couldn't process your request. Please try again.",
        error: "Invalid input: messages array is invalid or empty",
      }
    }

    // Get the OpenAI client
    const openai = getOpenAIClient()

    if (!openai) {
      console.error("Failed to initialize OpenAI client")
      return {
        text: "I'm sorry, I encountered an error connecting to the AI service.",
        error: "Failed to initialize AI service",
      }
    }

    // Format messages for the OpenAI API
    const aiMessages = convertMessagesToAIFormat(messages)

    if (!aiMessages || aiMessages.length === 0) {
      console.warn("Failed to convert messages to AI format")
      return {
        text: "I couldn't process your request. Please try again.",
        error: "Failed to convert messages to AI format",
      }
    }

    // Add system prompt if provided
    const fullMessages = systemPrompt ? [{ role: "system" as const, content: systemPrompt }, ...aiMessages] : aiMessages

    // Get function tools
    const tools = getFunctionTools()

    // Generate response using GPT-4o with function calling
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: fullMessages as any, // Type assertion to handle our custom format
      temperature: 0.7,
      max_tokens: 1000,
      tools: tools,
      tool_choice: "auto",
    })

    const responseMessage = completion.choices[0]?.message

    if (!responseMessage) {
      throw new Error("No response received from OpenAI")
    }

    // Check if the model wants to call a function
    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0]

      if (!toolCall || !toolCall.function) {
        throw new Error("Invalid tool call response from OpenAI")
      }

      // Handle the function call
      const functionResult = await handleFunctionCall(toolCall.function)

      // Send the function result back to the model to get a final response
      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          ...(fullMessages as any),
          responseMessage,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            name: toolCall.function.name,
            content: JSON.stringify(functionResult),
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      // Return both the function result and the final text response
      return {
        text: secondResponse.choices[0]?.message?.content || "",
        functionName: toolCall.function.name,
        functionResult,
        error: null,
      }
    }

    // If no function call, just return the text response
    return {
      text: responseMessage?.content || "",
      error: null,
    }
  } catch (error) {
    console.error("Error generating AI response:", error)
    return {
      text: "I'm sorry, I encountered an error. Please try again.",
      error: error instanceof Error ? error.message : "An error occurred while generating a response",
    }
  }
}

/**
 * Transcribe audio using OpenAI's Whisper API
 * @param audioBlob Audio blob to transcribe
 * @returns Transcription result
 */
export async function transcribeAudio(audioBlob: Blob) {
  try {
    if (!audioBlob || !(audioBlob instanceof Blob)) {
      throw new Error("Invalid audio data provided")
    }

    // Get the OpenAI client
    const openai = getOpenAIClient()

    if (!openai) {
      console.error("Failed to initialize OpenAI client")
      return {
        text: null,
        error: "Failed to initialize AI service",
      }
    }

    // Convert blob to File object
    const audioFile = new File([audioBlob], "audio.webm", { type: "audio/webm" })

    // Call the OpenAI API to transcribe the audio
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    })

    return { text: transcription.text, error: null }
  } catch (error) {
    console.error("Error transcribing audio:", error)
    return {
      text: null,
      error: error instanceof Error ? error.message : "An error occurred while transcribing audio",
    }
  }
}

