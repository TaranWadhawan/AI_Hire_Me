import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request) {
  try {
    const { question, answer } = await request.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required.' }, { status: 400 });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error("HUGGINGFACE_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: 'AI Configuration missing.' }, { status: 500 });
    }

    const prompt = `
      You are a senior technical interviewer. Your task is to evaluate a candidate's answer to a specific interview question.
      
      Question: "${question}"
      Candidate's Answer: "${answer}"
      
      Based on the answer provided, analyze its correctness, completeness, and clarity.
      Return a JSON object with:
      1. "score": integer between 0 and 100.
      2. "feedback": string with concise, constructive feedback.

      Your response MUST be ONLY valid JSON. Do not include any explanation or markdown tags.
    `;

    console.log("Verifying answer with Hugging Face Llama...");
    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const responseText = response.choices[0].message.content.trim();

    let verificationResult;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
      verificationResult = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse Llama verification response:", responseText);
      throw new Error("AI response was not in the expected format.");
    }

    return NextResponse.json(verificationResult);

  } catch (error) {
    console.error('Answer verification error:', error);
    return NextResponse.json({ error: 'Failed to verify the answer.' }, { status: 500 });
  }
}
