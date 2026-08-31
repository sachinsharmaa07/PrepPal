import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

export async function POST(req: NextRequest) {
  try {
    // Forward multipart/form-data directly to the Express API
    const formData = await req.formData();

    const response = await fetch(`${API_BASE}/resume/upload`, {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type header — fetch sets the multipart boundary automatically
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[Proxy] /api/resume/upload error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PROXY_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
