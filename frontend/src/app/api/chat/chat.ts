// /api/chat.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define the list of fallback models (try in order)
const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-pro',
];

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  if (!message || typeof message !== 'string') {
    return NextResponse.json(
      { error: 'Invalid message' },
      { status: 400 }
    );
  }

  // Create a system prompt for context
  const systemPrompt = `You are NexHire's AI assistant. Help users with job search tips, resume advice, interview prep, and career guidance. Be friendly, concise, and professional.`;

  // Try each model in order until one works
  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`🔄 Trying model: ${model}`);

      const geminiModel = genAI.getGenerativeModel({ model });

      const result = await geminiModel.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      });

      const responseText = result.response.text();
      return NextResponse.json({ reply: responseText });
    } catch (error: any) {
      console.warn(`❌ Failed with ${model}:`, error.message);

      // If it's a rate limit or quota error, skip to next model
      if (
        error.status === 429 ||
        error.message.includes('quota exceeded') ||
        error.message.includes('RESOURCE_EXHAUSTED')
      ) {
        continue; // Try the next model
      }

      // For other errors (e.g., invalid input), break early
      return NextResponse.json(
        { error: 'Failed to connect to AI service', details: error.message },
        { status: 500 }
      );
    }
  }

  // If all models fail
  return NextResponse.json(
    {
      error:
        'All AI models failed due to rate limits or internal issues. Please try again later.',
    },
    { status: 503 }
  );
}
