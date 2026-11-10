import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.FLY_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4173';

type Context = { params: Promise<{ path: string[] }> };

async function forward(request: Request, context: Context) {
  const { path: pathParts } = await context.params;
  const path = pathParts.join('/');
  const target = `${BACKEND_URL.replace(/\/$/, '')}/api/${path}`;
  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer();
  const response = await fetch(target, {
    method: request.method,
    headers: { 'Content-Type': request.headers.get('content-type') || 'application/json' },
    body,
    cache: 'no-store',
  });
  const responseBody = await response.arrayBuffer();
  return new NextResponse(responseBody, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('content-type') || 'application/json' },
  });
}

export async function GET(request: Request, context: Context) { return forward(request, context); }
export async function POST(request: Request, context: Context) { return forward(request, context); }
