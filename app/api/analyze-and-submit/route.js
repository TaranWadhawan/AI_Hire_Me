import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabaseClient';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_VIOLATIONS = 5;

export async function POST(request) {
  try {
    const { token: interviewToken, transcript } = await request.json();
    
    const { data: record, error: fetchError } = await supabase
      .from('interviews')
      .select('job_title, hr_email, candidate_email, status')
      .eq('id', interviewToken)
      .single();
    
    if (fetchError || !record) {
      return NextResponse.json({ error: 'Interview not found.' }, { status: 404 });
    }
    if (record.status === 'completed') {
      return NextResponse.json({ error: 'This interview has already been completed.' }, { status: 400 });
    }

    const proctoringTerminationMessage = 'INTERVIEW TERMINATED DUE TO PROCTORING VIOLATIONS.';
    const wasTerminatedByProctoring = transcript.some(msg => msg.role === 'system' && msg.text === proctoringTerminationMessage);
    
    let feedbackHtml;

    if (wasTerminatedByProctoring) {
      feedbackHtml = `
        <div style="background: #FFFFFF; border: 1px solid #FECACA; border-left: 5px solid #EF4444; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background: #FEE2E2; color: #DC2626; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 9999px;">Terminated</span>
            <h3 style="margin: 0 0 0 10px; color: #1E293B; font-size: 16px; font-weight: 600;">Interview Terminated</h3>
          </div>
          <p style="color: #64748B; font-size: 14px; margin: 8px 0 12px; line-height: 1.5;">The candidate's interview session was automatically terminated after exceeding the maximum allowed proctoring violations (${MAX_VIOLATIONS}).</p>
          <div style="display: inline-block; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 6px 14px; border-radius: 8px;">
            <span style="font-size: 13px; color: #64748B;">Final Recommendation:</span>
            <span style="font-size: 13px; font-weight: 700; color: #EF4444; margin-left: 6px;">Reject</span>
          </div>
        </div>`;
    } else {
      const formattedTranscript = transcript.map(msg => `${msg.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${msg.text}`).join('\n');
      const prompt = `
        You are an expert HR analyst and technical recruiter. Your task is to provide a detailed, professional feedback summary based on the following interview transcript for a candidate applying for the role of "${record.job_title}".
        
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
      
      console.log("Generating analysis with Hugging Face Llama...");
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

    const { error: updateError } = await supabase
      .from('interviews')
      .update({
        status: 'completed',
        transcript: transcript,
        feedback: feedbackHtml,
      })
      .eq('id', interviewToken);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      throw new Error("Failed to save interview results to the database.");
    }

    // UPDATED: Modern Minimalist / Cream & Light Blue Futuristic Email Template
    await resend.emails.send({
      from: 'Quantix AI Reports <onboarding@resend.dev>',
      to: record.hr_email,
      subject: `Interview Report: ${record.candidate_email} for ${record.job_title}`,
      html: `
        <div style="background-color: #FAF8F5; margin: 0; padding: 40px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
          <div style="max-width: 680px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 36px rgba(15, 23, 42, 0.05);">
            
            <!-- Futuristic Header with Light Blue Accent Glow -->
            <div style="background: linear-gradient(135deg, #FAF8F5 0%, #F0F9FF 100%); border-bottom: 1px solid #E0F2FE; padding: 32px 36px;">
              <div style="display: inline-block; background: #E0F2FE; color: #0284C7; border: 1px solid #BAE6FD; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 12px;">
                AI Telemetry Evaluation
              </div>
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #0F172A; letter-spacing: -0.02em;">Interview Intelligence Report</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748B;">Candidate: <strong style="color: #0284C7;">${record.candidate_email}</strong> &bull; Target Role: <strong style="color: #334155;">${record.job_title}</strong></p>
            </div>

            <div style="padding: 32px 36px;">
              <!-- AI Feedback Card with Soft Neumorphic Shadow -->
              <div style="margin-bottom: 24px;">
                <h3 style="font-size: 16px; font-weight: 600; color: #0F172A; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.04em;">Executive AI Analysis</h3>
                <div style="background: #FAF8F5; border: 1px solid #E2E8F0; border-radius: 14px; padding: 22px; font-size: 14px; line-height: 1.7; color: #334155; box-shadow: inset 0 2px 4px rgba(0,0,0,0.015);">
                  ${feedbackHtml}
                </div>
              </div>

              <!-- Full Transcript Section -->
              <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #F1F5F9;">
                <h3 style="font-size: 15px; font-weight: 600; color: #0F172A; margin: 0 0 14px; letter-spacing: -0.01em;">Session Transcript</h3>
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; font-size: 13.5px; max-height: 420px; overflow-y: auto;">
                  ${transcript.map(msg => `
                    <div style="margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #EDF2F7;">
                      <span style="display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 8px; border-radius: 6px; ${
                        msg.role === 'ai' 
                          ? 'background: #E0F2FE; color: #0284C7; border: 1px solid #BAE6FD;' 
                          : 'background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0;'
                      }">
                        ${msg.role === 'ai' ? 'AI Evaluator' : 'Candidate'}
                      </span>
                      <p style="margin: 8px 0 0; color: #334155; line-height: 1.5;">${msg.text}</p>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Minimal Futuristic Footer -->
              <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #F1F5F9;">
                <p style="font-size: 12px; color: #94A3B8; margin: 0;">Quantix AI Evaluation Engine &bull; Automated Confidential Report</p>
              </div>
            </div>

          </div>
        </div>
      `,
    });

    return NextResponse.json({ 
      message: 'Analysis complete. Feedback has been sent to the HR manager.',
      report: feedbackHtml
    });

  } catch (error) {
    console.error('Submission Error:', error);
    return NextResponse.json({ error: 'Failed to process the interview submission.' }, { status: 500 });
  }
}