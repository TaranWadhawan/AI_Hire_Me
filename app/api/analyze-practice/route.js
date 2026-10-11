import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const MAX_VIOLATIONS = 5;

export async function POST(request) {
  try {
    const { jobTitle, transcript } = await request.json();
    
    if (!jobTitle || !transcript) {
        return NextResponse.json({ error: 'Job title and transcript are required.' }, { status: 400 });
    }

    const proctoringTerminationMessage = 'INTERVIEW TERMINATED DUE TO PROCTORING VIOLATIONS.';
    const wasTerminatedByProctoring = transcript.some(msg => msg.role === 'system' && msg.text === proctoringTerminationMessage);
    
    let feedbackHtml;

    if (wasTerminatedByProctoring) {
      feedbackHtml = `
        <div style="background: #FFFFFF; border: 1px solid #FECACA; border-left: 5px solid #EF4444; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background: #FEE2E2; color: #DC2626; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 9999px;">Terminated</span>
            <h3 style="margin: 0 0 0 10px; color: #1E293B; font-size: 16px; font-weight: 600;">Practice Session Terminated</h3>
          </div>
          <p style="color: #64748B; font-size: 14px; margin: 8px 0 12px; line-height: 1.5;">The practice session was automatically terminated after exceeding the maximum allowed proctoring violations (${MAX_VIOLATIONS}).</p>
          <div style="display: inline-block; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 6px 14px; border-radius: 8px;">
            <span style="font-size: 13px; color: #64748B;">Final Recommendation:</span>
            <span style="font-size: 13px; font-weight: 700; color: #EF4444; margin-left: 6px;">Reject</span>
          </div>
        </div>`;
    } else {
      const formattedTranscript = transcript.map(msg => `${msg.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${msg.text}`).join('\n');
      const prompt = `
        You are an expert HR analyst and technical recruiter. Your task is to provide a detailed, professional feedback summary based on the following interview transcript for a candidate applying for the role of "${jobTitle}".
        
        Your response MUST be in well-formatted HTML. Do not include \`\`\`html or any other markdown. Your entire response should be a single block of HTML that can be directly embedded in an email.
        
        The feedback summary should include the following sections, using <h4> for section titles and <ul>/<li> for lists:
        1.  <h4>Overall Summary</h4><p>A brief 2-3 sentence paragraph summarizing the candidate's performance, communication style, and technical depth.</p>
        2.  <h4>Competency Scores</h4><ul><li><strong>Communication Skills:</strong> [score]/10</li><li><strong>Technical Knowledge:</strong> [score]/10 based on their answers</li><li><strong>Problem-Solving Approach:</strong> [score]/10</li></ul>
        3.  <h4>Strengths</h4><ul><li>[A key strength]</li><li>[Another key strength]</li></ul>
        4.  <h4>Areas for Improvement</h4><ul><li>[A constructive area for improvement]</li></ul>
        5.  <h4>Final Recommendation</h4><p><strong>[Your final verdict, which must be one of: "Strongly Recommend", "Recommend", "Proceed with Caution", or "Not a Fit"]</strong></p>

        Transcript:
        ---
        ${formattedTranscript}
        ---
      `;
      
      console.log("Generating practice analysis with Hugging Face Llama...");
      const response = await hf.chatCompletion({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      });

      feedbackHtml = response.choices[0].message.content.trim();
      
      if (feedbackHtml.startsWith('```html')) {
        feedbackHtml = feedbackHtml.replace(/^```html\n/, '').replace(/\n```$/, '');
      } else if (feedbackHtml.startsWith('```')) {
        feedbackHtml = feedbackHtml.replace(/^```\n/, '').replace(/\n```$/, '');
      }
    }

    return NextResponse.json({ 
      message: 'Analysis complete.',
      report: feedbackHtml
    });

  } catch (error) {
    console.error('Practice Submission Error:', error);
    return NextResponse.json({ error: 'Failed to process the practice interview analysis.' }, { status: 500 });
  }
}