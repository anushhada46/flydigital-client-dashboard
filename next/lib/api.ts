import type { AdminOverview, Dashboard } from './types';

// Browser requests stay same-origin and are forwarded by Next's API proxy.
// Set NEXT_PUBLIC_API_BASE_URL only when the browser should call the backend directly.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...init, cache: 'no-store', headers: { 'Content-Type': 'application/json', ...init?.headers } });
  if (!response.ok) throw new Error(`Fly API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const flyApi = {
  getDashboard: () => request<Dashboard>('/api/dashboard'),
  getAdminOverview: () => request<AdminOverview>('/api/admin/overview'),
  syncPerformance: () => request<Dashboard>('/api/sync', { method: 'POST', body: JSON.stringify({}) }),
  respondToDeliverable: (id: string, status: 'approved' | 'revision', comment: string) => request<Dashboard>(`/api/deliverables/${id}/respond`, { method: 'POST', body: JSON.stringify({ status, comment }) }),
};
