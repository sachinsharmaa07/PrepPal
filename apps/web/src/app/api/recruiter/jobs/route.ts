import { NextRequest, NextResponse } from 'next/server';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

export async function GET(req: NextRequest) {
  try {
    const qs = req.nextUrl.search;
    const auth = req.headers.get('authorization') || '';
    const response = await fetch(`${API_BASE}/jobs/mine${qs}`, {
      headers: { 'Authorization': auth },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { code: 'PROXY_ERROR', message: error.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const auth = req.headers.get('authorization') || '';
    const response = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': auth },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { code: 'PROXY_ERROR', message: error.message } }, { status: 500 });
  }
}
