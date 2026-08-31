import { NextRequest, NextResponse } from 'next/server';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

export async function GET(req: NextRequest) {
  try {
    const qs = req.nextUrl.search;
    const response = await fetch(`${API_BASE}/jobs${qs}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { code: 'PROXY_ERROR', message: error.message } }, { status: 500 });
  }
}
