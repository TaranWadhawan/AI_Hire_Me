// app/api/interview-details/[token]/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Import your Supabase client

export async function GET(request, { params }) {
  try {
    const { token } = await params;
    console.log(">>> API REQUEST: fetch interview details for token:", token);

    if (!token) {
      console.warn(">>> API WARNING: No token provided in params.");
      return NextResponse.json({ error: 'No token provided.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', token)
      .single();

    if (error || !data) {
      console.error("Supabase select error:", error);
      return NextResponse.json({ error: 'Interview link is invalid or has expired.' }, { status: 404 });
    }

    // Convert snake_case from DB to camelCase for the frontend
    const record = {
        candidateEmail: data.candidate_email,
        hrEmail: data.hr_email,
        jobTitle: data.job_title,
        companyName: data.company_name,
        status: data.status,
    };
    
    return NextResponse.json(record);

  } catch (error) {
    console.error('Failed to fetch interview details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}