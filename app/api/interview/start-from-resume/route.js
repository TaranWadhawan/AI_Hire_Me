import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request) {
  try {
    const pdf = require('pdf-parse/lib/pdf-parse.js');
    console.log("--- START FROM RESUME REQUEST RECEIVED (LLAMA) ---");
    const formData = await request.formData();
    const file = formData.get('resume');
    const desiredPosition = formData.get('desiredPosition');

    if (!file || !desiredPosition) {
      console.warn("Missing file or position in form data.");
      return NextResponse.json({ error: 'A resume file and desired position are required.' }, { status: 400 });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error("HUGGINGFACE_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: 'AI Configuration missing.' }, { status: 500 });
    }

    console.log("Processing resume PDF for:", desiredPosition);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    console.log("File buffer created, size:", fileBuffer.length);
    
    let resumeText = "";
    try {
      console.log("Starting PDF text extraction...");
      const data = await pdf(fileBuffer);
      resumeText = data.text;
      console.log("PDF extraction successful. Text length:", resumeText.length);
      console.log("Text sample:", resumeText.substring(0, 50));
    } catch (pdfError) {
      console.error("PDF Parsing Error detail:", pdfError);
      return NextResponse.json({ error: `Failed to parse the PDF file: ${pdfError.message}` }, { status: 500 });
    }

    const prompt = `
      Analyze the following resume text for a candidate applying for "${desiredPosition}".
      
      Resume content:
      ---
      ${resumeText}
      ---

      Your task:
      1. Extract candidate info into a JSON object with keys: "fullName", "email", "linkedin", "experience", "skills", "education", "projects". Use empty strings for missing fields.
      2. Assess a difficulty level: "Junior", "Mid-level", or "Senior".
      
      Return a single JSON object with this structure: { "details": {...}, "assessedDifficulty": "..." }.
      
      Your response MUST be ONLY valid JSON. Do not include any explanation or markdown tags.
    `;

    console.log("Sending screen request to Hugging Face Llama...");
    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const responseText = response.choices[0].message.content.trim();
    
    // Find JSON block
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : responseText;

    let parsedData;
    try {
        parsedData = JSON.parse(jsonStr);
    } catch(e) {
        console.error("Llama did not return valid JSON. Content was:", responseText);
        throw new Error("AI failed to process the resume format properly. Please try again.");
    }
    
    const user = { 
      ...parsedData.details, 
      jobTitle: desiredPosition, 
      difficulty: parsedData.assessedDifficulty || 'Mid-level' 
    };

    console.log("Resume analysis complete for:", user.fullName);
    return NextResponse.json({ message: 'Resume processed successfully', user }, { status: 200 });

  } catch (error) {
    console.error('CRITICAL ROUTE ERROR (start-from-resume):', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
