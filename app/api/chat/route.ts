import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log("API_CHAT: Request received");
    const body = await req.json();
    console.log("API_CHAT: Body:", JSON.stringify(body, null, 2));

    // Check for API key first
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("API_CHAT: Missing API Key");
      return new Response(JSON.stringify({
        error: "Configuration Error",
        message: "API Key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY."
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract messages properly
    const messages = body.messages || [];
    console.log("API_CHAT: Messages count:", messages.length);

    if (messages.length === 0) {
      return new Response(JSON.stringify({
        error: "No messages provided"
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("API_CHAT: Calling Gemini API...");
    const result = await streamText({
      model: google('gemini-3-flash-preview'),
      messages: messages,
      system: "Tu es l'Architecte Neuronal, une IA cyberpunk sophistiquée. Réponds de manière concise et technique.",
    });

    console.log("API_CHAT: Returning stream response");
    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("API_CHAT_ERROR:", error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
