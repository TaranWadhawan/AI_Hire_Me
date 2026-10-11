import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request) {
  try {
    const pdf = require('pdf-parse/lib/pdf-parse.js');
    const formData = await request.formData();
    const resumeFile = formData.get('resume');
    const jobDescription = formData.get('jobDescription');

    if (!resumeFile || !jobDescription) {
      return NextResponse.json({ error: 'Resume file and job description are required.' }, { status: 400 });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error("HUGGINGFACE_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: 'AI Configuration missing.' }, { status: 500 });
    }

    console.log("Processing screening resume PDF...");
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
    
    let resumeText = "";
    try {
      const data = await pdf(fileBuffer);
      resumeText = data.text;
    } catch (pdfError) {
      console.error("PDF Parsing Error:", pdfError);
      return NextResponse.json({ error: 'Failed to parse the PDF file.' }, { status: 500 });
    }

    const prompt = `
      You are an expert HR screening agent. Analyze the following resume against the providing job description.
      
      Job Description:
      ---
      ${jobDescription}
      ---

      Resume Content:
      ---
      ${resumeText}
      ---

      Your task is to provide a detailed analysis and return it as a single, valid JSON object.
      The JSON object must have these exact keys:
      - "score": An integer from 0 to 100 representing how well the resume matches the job description.
      - "strengths": An array of 3-4 strings, each highlighting a key strength or relevant experience from the resume.
      - "weaknesses": An array of 2-3 strings, each pointing out a potential gap or area of concern.
      - "verdict": A short, conclusive statement, such as "Strong Match", "Potential Fit", or "Not a Good Match".
      
      Your response MUST be ONLY valid JSON. Do not include any explanation or markdown tags.
    `;

    console.log("Sending screening request to Hugging Face Llama...");
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

    let screeningResult;
    try {
      screeningResult = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse Llama screening JSON:", responseText);
      throw new Error("The AI returned a response in an unexpected format.");
    }

    return NextResponse.json(screeningResult);

  } catch (error) {
    console.error('Resume screening error:', error);
    return NextResponse.json({ error: 'Failed to screen resume. The AI may be experiencing high load.' }, { status: 500 });
  }
}
