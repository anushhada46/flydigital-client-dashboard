export type Tone = 'blue' | 'lime' | 'coral' | 'ink';

export type Metric = { label: string; value: string; delta: string; tone: Tone };
export type Service = { id: string; name: string; mode: string; status: string; detail: string; tone: Tone; icon: string };
export type Deliverable = { id: string; service: string; title: string; subtitle: string; status: string; due: string; updated: string; files: number; clientComment: string };
export type Activity = { icon: string; title: string; detail: string; tone: Tone };
export type Integration = { name: string; type: string; status: string; lastSync: string; tone: Tone };

export type Dashboard = {
  client: { name: string; initials: string; contact: string; plan: string };
  performance: { lastSyncedAt: string; source: string; range: string; score: number; delta: string; metrics: Metric[]; chart: number[] };
  services: Service[];
  deliverables: Deliverable[];
  activity: Activity[];
  integrations: Integration[];
};

export type AdminOverview = Pick<Dashboard, 'client' | 'services' | 'integrations' | 'deliverables'> & { pendingApprovals: number; lastSyncedAt: string };
