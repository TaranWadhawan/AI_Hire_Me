import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'A quiz topic is required.' }, { status: 400 });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error("HUGGINGFACE_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: 'AI Configuration missing.' }, { status: 500 });
    }

    const prompt = `
      You are an expert quiz generator for technical topics. Your task is to generate a 5-question multiple-choice quiz about the topic: "${topic}".
      
      Return a JSON object with a single key named "questions".
      Each question object must have:
      1. "questionText": The question string.
      2. "options": Array of exactly 4 strings.
      3. "correctAnswer": Integer (0-3) for the correct index.

      Your response MUST be ONLY valid JSON. Do not include any explanation or markdown tags.
    `;

    console.log("Generating quiz with Hugging Face Llama...");
    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const responseText = response.choices[0].message.content.trim();

    let quizData;
    try {
      // Find JSON block if Llama included extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
      quizData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse Llama quiz response:", responseText);
      throw new Error("The AI generated the quiz in an unexpected format.");
    }

    return NextResponse.json(quizData);

  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate the quiz.' }, { status: 500 });
  }
}
