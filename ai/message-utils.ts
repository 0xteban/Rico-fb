import type { Message } from "@/lib/types"

/**
 * Convert our app's message format to the format expected by the OpenAI API
 * @param messages Array of app messages
 * @returns Array of messages formatted for OpenAI API
 */
export function convertMessagesToAIFormat(messages: Message[]) {
  if (!messages || !Array.isArray(messages)) {
    console.warn("Invalid messages array provided to convertMessagesToAIFormat")
    return []
  }

  return messages.map((message) => {
    // Check if message or message.content is undefined
    if (!message || !message.content) {
      console.warn("Received undefined message or message content")
      return {
        role: "user",
        content: "",
      }
    }

    // Determine role with null check
    const role =
      message.sender && typeof message.sender === "string"
        ? message.sender.toLowerCase() === "user"
          ? "user"
          : "assistant"
        : "user"

    // Handle image content
    if ("imageUrl" in message.content && message.content.imageUrl) {
      return {
        role,
        content: [
          {
            type: "image_url",
            image_url: {
              url: message.content.imageUrl,
              detail: "high",
            },
          },
          {
            type: "text",
            text: message.content.caption || "Please analyze this image.",
          },
        ],
      }
    }

    // Handle text and other content types
    let contentText = ""
    if ("text" in message.content && message.content.text) {
      contentText = message.content.text
    } else if ("amount" in message.content && message.content.description) {
      contentText = `Expense: ${message.content.description} - $${message.content.amount}`
    } else {
      try {
        contentText = JSON.stringify(message.content)
      } catch (error) {
        console.warn("Failed to stringify message content:", error)
        contentText = "Message content could not be processed"
      }
    }

    return {
      role,
      content: contentText,
    }
  })
}

