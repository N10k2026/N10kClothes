import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Database not available on Vercel serverless - auth requires persistent storage
    return NextResponse.json(
      { error: 'Authentication is temporarily unavailable. Please try again later.' },
      { status: 503 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
