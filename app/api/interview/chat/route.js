// app/api/interview/chat/route.js
import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request) {
  try {
    const { message, history, userData } = await request.json();
    console.log("Chat API Request for:", userData?.jobTitle);

    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error("HUGGINGFACE_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: 'AI Configuration missing.' }, { status: 500 });
    }

    const systemPrompt = `You are an expert interviewer for the role of ${userData.jobTitle}. The candidate's details are: ${JSON.stringify(userData)}. Your personality is professional and encouraging. Keep responses concise.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).map(msg => ({
        role: (msg.role === 'model' || msg.role === 'ai') ? 'assistant' : msg.role,
        content: msg.text || msg.content
      })),
      { role: "user", content: message }
    ];

    console.log("Generating chat response with Hugging Face Llama...");
    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to get a response from AI.' }, { status: 500 });
  }
}

