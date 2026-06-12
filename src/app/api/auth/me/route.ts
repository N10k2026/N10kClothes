import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Database not available on Vercel serverless
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function PUT(request: NextRequest) {
  // Database not available on Vercel serverless
  return NextResponse.json(
    { error: 'Profile update is temporarily unavailable.' },
    { status: 503 }
  );
}
