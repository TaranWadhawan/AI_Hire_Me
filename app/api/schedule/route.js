// app/api/schedule/route.js
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabaseClient'; // Import your Supabase client

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { candidateEmail, hrEmail, jobTitle, companyName } = await request.json();

    if (!candidateEmail || !hrEmail || !jobTitle) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    
    const token = randomUUID();
    const interviewLink = `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${token}`;

    // --- Supabase Logic: Insert a new record ---
    const { error } = await supabase
      .from('interviews')
      .insert({
        id: token,
        candidate_email: candidateEmail,
        hr_email: hrEmail,
        job_title: jobTitle,
      });

    if (error) {
      console.error("Supabase insert error detailed:", JSON.stringify(error, null, 2));
      throw new Error(`Failed to save the interview record: ${error.message}`);
    }
    // --- End Supabase Logic ---

    // UPDATED: Cream, Light Blue, Grey & Futuristic Invitation Template
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `Quantix AI <onboarding@resend.dev>`,
      to: candidateEmail,
      reply_to: hrEmail,
      subject: `Interview Invitation: ${jobTitle}`,
      html: `
        <div style="background-color: #FAF8F5; margin: 0; padding: 44px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
          <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; overflow: hidden; box-shadow: 0 16px 40px -10px rgba(15, 23, 42, 0.06);">
            
            <!-- Futuristic AI Header Banner -->
            <div style="background: linear-gradient(135deg, #FAF8F5 0%, #F0F9FF 100%); border-bottom: 1px solid #E0F2FE; padding: 36px 36px 28px;">
              <div style="display: inline-block; background: #E0F2FE; color: #0284C7; border: 1px solid #BAE6FD; padding: 4px 14px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 14px;">
                Autonomous Candidate Assessment
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #0F172A; letter-spacing: -0.02em;">Interview Invitation</h1>
              <p style="margin: 8px 0 0; font-size: 14.5px; color: #64748B; line-height: 1.5;">
                You're invited to complete an interactive AI screening for 
                <strong style="color: #0284C7;">${jobTitle}</strong>${companyName ? ` at <strong style="color: #0F172A;">${companyName}</strong>` : ''}.
              </p>
            </div>

            <!-- Body Details -->
            <div style="padding: 32px 36px;">
              <p style="margin: 0 0 16px; font-size: 14.5px; color: #334155; line-height: 1.6;">
                Hello,
              </p>
              <p style="margin: 0 0 24px; font-size: 14.5px; color: #475569; line-height: 1.65;">
                This automated screening is powered by Quantix AI and allows you to showcase your problem-solving skills and technical depth at your own pace.
              </p>

              <!-- Session Checklist Card (Subtle Neumorphic Feel) -->
              <div style="background: #FAF8F5; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; margin-bottom: 28px;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B;">Before you begin:</p>
                <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #475569; line-height: 1.6;">
                  <li>Find a quiet workspace free of distractions (estimated time: ~15 mins).</li>
                  <li>Ensure your microphone and camera permissions are enabled.</li>
                  <li>Have a stable internet connection ready.</li>
                </ul>
              </div>

              <!-- Primary Futuristic CTA Button -->
              <div style="text-align: center; margin: 36px 0 28px;">
                <a href="${interviewLink}" style="display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); color: #FFFFFF; font-size: 14.5px; font-weight: 600; text-decoration: none; border-radius: 10px; box-shadow: 0 8px 20px -4px rgba(2, 132, 199, 0.4); letter-spacing: 0.01em;">
                  Launch Interview Session &rarr;
                </a>
              </div>

              <!-- Fallback Direct URL Box -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px 16px; margin-top: 24px;">
                <p style="margin: 0 0 6px; font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: #64748B;">Alternative link:</p>
                <p style="margin: 0; font-size: 12px; word-break: break-all; color: #0284C7;">
                  <a href="${interviewLink}" style="color: #0284C7; text-decoration: underline;">${interviewLink}</a>
                </p>
              </div>

              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #F1F5F9; font-size: 13px; color: #64748B; line-height: 1.6;">
                Have questions or need to reschedule? Reply directly to this email to contact your hiring representative at <strong style="color: #334155;">${hrEmail}</strong>.
              </div>

              <div style="text-align: center; margin-top: 28px;">
                <p style="font-size: 11.5px; color: #94A3B8; margin: 0;">Quantix AI Automated Assessment Platform</p>
              </div>
            </div>

          </div>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend API Error:", emailError);
      return NextResponse.json({ 
        message: 'Interview record created, but email failed to send.', 
        warning: 'Resend Error: ' + emailError.message,
        token 
      }, { status: 201 });
    }

    return NextResponse.json({ message: 'Interview scheduled and invitation sent!', token });

  } catch (error) {
    console.error('Scheduling Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to schedule interview.' }, { status: 500 });
  }
}