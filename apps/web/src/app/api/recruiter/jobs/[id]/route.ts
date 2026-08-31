import { NextRequest, NextResponse } from 'next/server';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const auth = req.headers.get('authorization') || '';
    const response = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': auth },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { code: 'PROXY_ERROR', message: error.message } }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const qs = req.nextUrl.search;
    const auth = req.headers.get('authorization') || '';
    const response = await fetch(`${API_BASE}/jobs/${id}${qs}`, {
      method: 'DELETE',
      headers: { 'Authorization': auth },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { code: 'PROXY_ERROR', message: error.message } }, { status: 500 });
  }
}
