import { NextResponse } from 'next/server';
import { repository } from '../../../lib/repository';

type Context = { params: Promise<{ path: string[] }> };

async function handleRequest(request: Request, context: Context) {
  const { path: pathParts } = await context.params;
  const path = pathParts.join('/');

  if (process.env.FLY_BACKEND_URL) {
    const BACKEND_URL = process.env.FLY_BACKEND_URL.replace(/\/$/, '');
    const target = `${BACKEND_URL}/api/${path}`;
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

  try {
    if (path === 'dashboard' && request.method === 'GET') {
      return NextResponse.json(repository.getDashboard());
    }
    if (path === 'sync' && request.method === 'POST') {
      return NextResponse.json(repository.syncPerformance());
    }
    if (path === 'admin/overview' && request.method === 'GET') {
      return NextResponse.json(repository.getAdminOverview());
    }
    const match = path.match(/^deliverables\/([^/]+)\/respond$/);
    if (match && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      return NextResponse.json(repository.respondToDeliverable(match[1], body));
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    const status = err?.message === 'Deliverable not found' ? 404 : 500;
    return NextResponse.json({ error: err?.message || 'Server error' }, { status });
  }
}

export async function GET(request: Request, context: Context) { return handleRequest(request, context); }
export async function POST(request: Request, context: Context) { return handleRequest(request, context); }