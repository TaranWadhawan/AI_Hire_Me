// app/api/interview/start-from-form/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    

    console.log('Received form data:', body);
    
    // Simulate a user object creation
    const user = { ...body };

    return NextResponse.json({ message: 'Form submitted successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
