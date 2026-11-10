const iso = (value) => new Date(value).toISOString();

const base = () => ({
  client: { name: 'Northstar Home', initials: 'NH', contact: 'Maya Patel', plan: 'Growth partner' },
  performance: {
    lastSyncedAt: iso(Date.now() - 18 * 60 * 1000), source: 'stored snapshot',
    range: 'Last 30 days', score: 82, delta: '+14.8%',
    metrics: [
      { label: 'Reach', value: '125.4K', delta: '+18.5%', tone: 'blue' },
      { label: 'Engagement', value: '8,420', delta: '+12.2%', tone: 'lime' },
      { label: 'Qualified leads', value: '186', delta: '+24.7%', tone: 'coral' },
      { label: 'Ad efficiency', value: '3.8×', delta: '+0.6×', tone: 'ink' },
    ],
    chart: [34, 42, 37, 52, 48, 63, 58, 67, 61, 72, 75, 82],
  },
  services: [
    { id: 'branding', name: 'Branding', short: 'Brand', mode: 'manual', status: 'In review', detail: '2 deliverables need your eye', tone: 'coral', icon: '✦' },
    { id: 'website', name: 'Website Development', short: 'Web', mode: 'manual + monitor', status: 'On track', detail: 'Sprint 04 · QA next', tone: 'blue', icon: '⌁' },
    { id: 'ppc', name: 'PPC & SEO', short: 'PPC / SEO', mode: 'API connected', status: 'Performing', detail: '186 qualified leads', tone: 'lime', icon: '↗' },
    { id: 'social', name: 'Social Media Marketing', short: 'Social', mode: 'API connected', status: 'Performing', detail: '8.4K engagements', tone: 'blue', icon: '◎' },
    { id: 'campaign', name: 'Digital Campaign', short: 'Campaign', mode: 'Hybrid', status: 'Live', detail: 'Spring launch · 68%', tone: 'lime', icon: '◌' },
    { id: 'creative', name: 'Creative Production', short: 'Creative', mode: 'CMS managed', status: 'In production', detail: 'Shoot scheduled Friday', tone: 'coral', icon: '▧' },
    { id: 'influencer', name: 'Influencer Marketing', short: 'Influencer', mode: 'CMS managed', status: 'Planning', detail: '6 creators shortlisted', tone: 'ink', icon: '◈' },
  ],
  deliverables: [
    { id: 'brand-kit', service: 'Branding', title: 'Brand system · round 02', subtitle: 'Three routes for the Northstar identity', status: 'awaiting approval', due: 'Due today', updated: '22 min ago', files: 3, clientComment: '' },
    { id: 'campaign-brief', service: 'Digital Campaign', title: 'Spring campaign brief', subtitle: 'Launch story, audiences, and media plan', status: 'approved', due: 'Approved', updated: 'Yesterday', files: 1, clientComment: '' },
    { id: 'site-qa', service: 'Website Development', title: 'Homepage QA notes', subtitle: 'Final content and interaction pass', status: 'in progress', due: 'Due Nov 14', updated: '2 days ago', files: 8, clientComment: '' },
  ],
  activity: [
    { icon: '↗', title: 'Campaign performance is trending above target', detail: 'Digital Campaign · 2 hours ago', tone: 'lime' },
    { icon: '✦', title: 'New brand routes are ready for review', detail: 'Branding · 22 minutes ago', tone: 'coral' },
    { icon: '✓', title: 'Homepage content pass approved', detail: 'Website Development · Yesterday', tone: 'blue' },
  ],
  integrations: [
    { name: 'Meta Business', type: 'Social reach + engagement', status: 'Connected', lastSync: '10:42 AM', tone: 'blue' },
    { name: 'Google Ads', type: 'Spend + conversion data', status: 'Connected', lastSync: '10:41 AM', tone: 'lime' },
    { name: 'Analytics 4', type: 'Traffic + conversion data', status: 'Connected', lastSync: '10:39 AM', tone: 'coral' },
    { name: 'Search Console', type: 'Organic search insights', status: 'Connected', lastSync: 'Yesterday', tone: 'ink' },
  ],
});

export function createRepository() {
  let data = base();
  let syncCount = 0;
  return {
    getDashboard() { return structuredClone(data); },
    syncPerformance() {
      syncCount += 1;
      data = { ...data, performance: { ...data.performance, lastSyncedAt: iso(Date.now() + syncCount), score: Math.min(99, data.performance.score + 1) }, activity: [{ icon: '↻', title: 'Performance data synced successfully', detail: 'All connected sources · Just now', tone: 'blue' }, ...data.activity] };
      return structuredClone(data);
    },
    respondToDeliverable(id, response) {
      const deliverable = data.deliverables.find((item) => item.id === id);
      if (!deliverable) throw new Error('Deliverable not found');
      const status = response.status === 'approved' ? 'approved' : 'revision requested';
      data = { ...data, deliverables: data.deliverables.map((item) => item.id === id ? { ...item, status, clientComment: response.comment || '' } : item), activity: [{ icon: status === 'approved' ? '✓' : '↺', title: `${deliverable.title} ${status}`, detail: 'Client workspace · Just now', tone: status === 'approved' ? 'lime' : 'coral' }, ...data.activity] };
      return structuredClone(data);
    },
    getAdminOverview() {
      return { client: data.client, services: data.services, integrations: data.integrations, deliverables: data.deliverables, pendingApprovals: data.deliverables.filter((item) => item.status === 'awaiting approval').length, lastSyncedAt: data.performance.lastSyncedAt };
    },
  };
}
