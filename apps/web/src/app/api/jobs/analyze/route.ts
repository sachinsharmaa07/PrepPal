import { NextRequest, NextResponse } from 'next/server';

// NEXT_PUBLIC_API_URL is set to http://localhost:4000/v1 in .env.local
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${API_BASE}/jobs/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[Proxy] /api/jobs/analyze error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PROXY_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
