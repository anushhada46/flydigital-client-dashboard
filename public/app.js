const state = { dashboard: null, view: location.hash === '#admin' ? 'admin' : 'workspace', filter: 'All services', syncing: false, toast: '' };
const app = document.querySelector('#app');
const formatTime = (date) => new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(date));
const api = {
  get: (path) => fetch(path).then((response) => response.json()),
  post: (path, body) => fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then((response) => response.json()),
};

function icon(symbol, tone = '') { return `<span class="icon ${tone}" aria-hidden="true">${symbol}</span>`; }
function navItem(label, symbol, view) { return `<button class="nav-item ${state.view === view ? 'active' : ''}" data-view="${view}">${icon(symbol)}<span>${label}</span>${view === 'workspace' ? '<span class="nav-dot"></span>' : ''}</button>`; }

function sidebar(data) {
  return `<aside class="sidebar">
    <div class="brand"><div class="brand-mark">F</div><div><strong>fly</strong><span>digital studio</span></div></div>
    <div class="workspace-switcher"><div class="avatar">${data.client.initials}</div><div><small>WORKSPACE</small><b>${data.client.name}</b></div><span class="chevron">⌄</span></div>
    <nav class="nav" aria-label="Main navigation">${navItem('Overview', '⌂', 'workspace')}${navItem('Projects', '▦', 'projects')}<div class="nav-label">Workspace</div>${navItem('Performance', '↗', 'performance')}${navItem('Deliverables', '▧', 'deliverables')}<div class="nav-label">Manage</div>${navItem('Admin view', '⚙', 'admin')}</nav>
    <div class="sidebar-bottom"><div class="sync-mini">${icon('↻','blue')}<div><small>DATA SYNC</small><b>All systems healthy</b></div></div><button class="help-link">${icon('?')} Help centre</button><div class="user-row"><div class="avatar small">MP</div><div><b>Maya Patel</b><span>Client account</span></div><span class="more">•••</span></div></div>
  </aside>`;
}

function topbar(data) {
  return `<header class="topbar"><div class="crumb"><span>Client workspace</span><i>/</i><b>${state.view === 'admin' ? 'Admin view' : 'Overview'}</b></div><div class="top-actions"><button class="icon-button" aria-label="Notifications">♧<span class="notification-dot"></span></button><button class="avatar top-avatar">${data.client.initials}</button></div></header>`;
}

function scoreRing(score) {
  const circumference = 2 * Math.PI * 43;
  const dash = circumference * score / 100;
  return `<div class="score-ring"><svg viewBox="0 0 110 110" aria-hidden="true"><circle class="ring-track" cx="55" cy="55" r="43"></circle><circle class="ring-value" cx="55" cy="55" r="43" stroke-dasharray="${dash} ${circumference}"></circle></svg><div class="score-number"><b>${score}</b><span>/ 100</span></div></div>`;
}

function hero(data) {
  return `<section class="hero-grid"><div class="hero-copy"><p class="eyebrow">GOOD MORNING, MAYA <span class="spark">✳</span></p><h1>Make good<br><em>things happen.</em></h1><p class="hero-sub">Here’s a pulse check on everything we’re building together.</p><div class="hero-links"><button class="button primary" data-scroll="deliverables">Review deliverables <span>↗</span></button><button class="text-button" data-scroll="performance">View performance <span>↘</span></button></div></div><div class="attention-card"><div class="attention-head"><span class="kicker">YOUR ATTENTION</span><span class="status-pill coral">2 actions</span></div><div class="attention-main">${scoreRing(data.performance.score)}<div><h3>Momentum is good.</h3><p>Two small things from the team are waiting on you.</p><button class="arrow-link" data-scroll="deliverables">See what’s waiting <span>↗</span></button></div></div><div class="attention-footer"><span>${icon('↗','coral')} Spring campaign is 68% ready</span><span>Updated ${formatTime(data.performance.lastSyncedAt)}</span></div></div></section>`;
}

function metricStrip(data) {
  return `<section class="metrics" id="performance"><div class="section-intro"><div><p class="eyebrow">PERFORMANCE PULSE</p><h2>What’s moving the needle</h2></div><div class="range-control"><button class="range active">30 days</button><button class="range">90 days</button><button class="range">Year</button></div></div><div class="metric-grid">${data.performance.metrics.map((metric) => `<article class="metric-card"><div class="metric-top"><span>${metric.label}</span>${icon(metric.tone === 'lime' ? '↗' : '•', metric.tone)}</div><b>${metric.value}</b><small class="delta ${metric.tone}">${metric.delta}</small></article>`).join('')}</div>${chart(data)}</section>`;
}

function chart(data) {
  const points = data.performance.chart.map((value, index) => `${index * 68 + 12},${160 - value * 1.45}`).join(' ');
  const area = `12,160 ${points} 760,160`;
  return `<div class="chart-card"><div class="chart-heading"><div><b>Impact over time</b><span>Combined performance index</span></div><span class="chart-legend"><i></i> Momentum</span></div><div class="chart-wrap"><svg viewBox="0 0 780 180" preserveAspectRatio="none" role="img" aria-label="Performance momentum over the last 30 days"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2369ff" stop-opacity=".22"/><stop offset="1" stop-color="#2369ff" stop-opacity="0"/></linearGradient></defs><line x1="0" y1="35" x2="780" y2="35"/><line x1="0" y1="95" x2="780" y2="95"/><line x1="0" y1="155" x2="780" y2="155"/><polygon points="${area}" fill="url(#chartFill)"/><polyline points="${points}" fill="none" stroke="#2369ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="chart-labels"><span>Nov 01</span><span>Nov 08</span><span>Nov 15</span><span>Nov 22</span><span>Nov 30</span></div></div></div>`;
}

function services(data) {
  const filters = ['All services', 'API connected', 'CMS managed'];
  const visible = state.filter === 'All services' ? data.services : data.services.filter((service) => state.filter === service.mode || (state.filter === 'API connected' && service.mode.includes('API')) || (state.filter === 'CMS managed' && service.mode.includes('CMS')));
  return `<section class="services"><div class="section-intro"><div><p class="eyebrow">THE WORKSPACE</p><h2>Seven ways we move forward</h2></div><div class="service-filters">${filters.map((filter) => `<button class="filter ${state.filter === filter ? 'active' : ''}" data-filter="${filter}">${filter}</button>`).join('')}</div></div><div class="service-grid">${visible.map((service) => `<article class="service-card"><div class="service-card-top">${icon(service.icon, service.tone)}<span class="mode">${service.mode}</span></div><h3>${service.name}</h3><div class="service-bottom"><div><b>${service.status}</b><span>${service.detail}</span></div><span class="circle-arrow">↗</span></div></article>`).join('')}</div></section>`;
}

function deliverables(data) {
  return `<section class="lower-grid" id="deliverables"><div class="deliverables panel"><div class="panel-head"><div><p class="eyebrow">FROM THE STUDIO</p><h2>Deliverables</h2></div><button class="text-button">View all <span>↗</span></button></div><div class="deliverable-list">${data.deliverables.map((item) => `<article class="deliverable" data-deliverable="${item.id}"><div class="file-icon">${icon(item.service === 'Branding' ? '✦' : item.service === 'Digital Campaign' ? '◌' : '▧', item.status === 'awaiting approval' ? 'coral' : 'blue')}</div><div class="deliverable-copy"><div class="deliverable-title"><h3>${item.title}</h3><span class="status-pill ${item.status === 'awaiting approval' ? 'coral' : item.status === 'approved' ? 'lime' : 'blue'}">${item.status}</span></div><p>${item.subtitle}</p><small>${item.files} files <i>·</i> ${item.updated}</small>${item.clientComment ? `<div class="comment">“${item.clientComment}”</div>` : ''}</div>${item.status === 'awaiting approval' || item.status === 'revision requested' ? `<button class="circle-arrow deliverable-action" data-action="respond" data-id="${item.id}" aria-label="Respond to ${item.title}">↗</button>` : `<span class="check-mark">✓</span>`}</article>`).join('')}</div></div><div class="activity panel"><div class="panel-head"><div><p class="eyebrow">RECENTLY</p><h2>Activity</h2></div><span class="live-dot">● Live</span></div><div class="activity-list">${data.activity.slice(0, 4).map((item) => `<div class="activity-item">${icon(item.icon, item.tone)}<div><b>${item.title}</b><span>${item.detail}</span></div></div>`).join('')}</div><div class="sync-footer"><span>Last sync</span><b>${formatTime(data.performance.lastSyncedAt)}</b><button class="sync-button" data-sync ${state.syncing ? 'disabled' : ''}>${state.syncing ? 'Syncing…' : '↻ Sync data'}</button></div></div></section>`;
}

function admin(data) {
  const pending = data.deliverables.filter((item) => item.status === 'awaiting approval').length;
  return `<section class="admin-view"><div class="admin-hero"><div><p class="eyebrow">AGENCY OPERATIONS</p><h1>Keep the work<br><em>in motion.</em></h1><p>One view for client health, connected accounts, and the next team action.</p></div><button class="button primary" data-sync>↻ Sync all sources</button></div><div class="admin-stats"><div><span>Active client</span><b>${data.client.name}</b><small>${data.client.plan}</small></div><div><span>Subscribed services</span><b>${data.services.length}</b><small>All seven service lines</small></div><div><span>Connected accounts</span><b>${data.integrations.length}</b><small>API snapshots healthy</small></div><div><span>Pending approvals</span><b>${pending}</b><small>Needs client attention</small></div></div><div class="admin-grid"><div class="panel admin-panel"><div class="panel-head"><div><p class="eyebrow">ACCOUNT MAP</p><h2>Connected platforms</h2></div><span class="status-pill lime">Healthy</span></div>${data.integrations.map((item) => `<div class="integration-row">${icon(item.name === 'Meta Business' ? '◎' : item.name === 'Google Ads' ? 'G' : item.name === 'Analytics 4' ? 'A' : '⌁', item.tone)}<div><b>${item.name}</b><span>${item.type}</span></div><div class="integration-status"><b>${item.status}</b><span>${item.lastSync}</span></div></div>`).join('')}</div><div class="panel admin-panel"><div class="panel-head"><div><p class="eyebrow">SERVICE COVERAGE</p><h2>Work in flight</h2></div></div>${data.services.map((service) => `<div class="coverage-row"><span>${service.name}</span><b class="${service.tone}">${service.status}</b><i>${service.mode}</i></div>`).join('')}</div></div></section>`;
}

function workspace(data) { return `<main>${hero(data)}${metricStrip(data)}${services(data)}${deliverables(data)}</main>`; }

function render() {
  const data = state.dashboard;
  if (!data) { app.innerHTML = '<div class="loading">Loading your workspace<span>✳</span></div>'; return; }
  app.innerHTML = `<div class="app-shell">${sidebar(data)}<div class="page"><div class="page-inner">${topbar(data)}${state.view === 'admin' ? admin(data) : workspace(data)}<footer>Fly Digital <span>•</span> Built for momentum <span>•</span> ${new Date().getFullYear()}</footer></div></div></div>${state.toast ? `<div class="toast">${icon('✓','lime')} ${state.toast}</div>` : ''}`;
  bind();
}

function bind() {
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => { state.view = button.dataset.view === 'admin' ? 'admin' : 'workspace'; history.replaceState(null, '', state.view === 'admin' ? '#admin' : '#'); render(); }));
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => { state.filter = button.dataset.filter; render(); }));
  document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => document.querySelector(`#${button.dataset.scroll}`)?.scrollIntoView({ behavior: 'smooth' })));
  document.querySelectorAll('[data-sync]').forEach((button) => button.addEventListener('click', async () => { state.syncing = true; render(); state.dashboard = await api.post('/api/sync'); state.syncing = false; state.toast = 'Fresh performance data is in'; render(); setTimeout(() => { state.toast = ''; render(); }, 2600); }));
  document.querySelectorAll('[data-action="respond"]').forEach((button) => button.addEventListener('click', () => openResponse(button.dataset.id)));
}

function openResponse(id) {
  const item = state.dashboard.deliverables.find((deliverable) => deliverable.id === id);
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" aria-label="Close">×</button><p class="eyebrow">CLIENT RESPONSE</p><h2 id="modal-title">${item.title}</h2><p>${item.subtitle}</p><label for="comment">Leave a note <span>optional</span></label><textarea id="comment" placeholder="Tell the studio what to explore next…"></textarea><div class="modal-actions"><button class="button secondary" data-response="revision">Request revision</button><button class="button primary" data-response="approved">Approve deliverable</button></div></div>`;
  document.body.append(modal); modal.querySelector('textarea').focus();
  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', async (event) => { const button = event.target.closest('[data-response]'); if (!button) return; const comment = modal.querySelector('textarea').value; state.dashboard = await api.post(`/api/deliverables/${id}/respond`, { status: button.dataset.response, comment }); modal.remove(); state.toast = button.dataset.response === 'approved' ? 'Deliverable approved' : 'Revision request sent'; render(); setTimeout(() => { state.toast = ''; render(); }, 2600); });
}

api.get('/api/dashboard').then((dashboard) => { state.dashboard = dashboard; render(); }).catch(() => { app.innerHTML = '<div class="loading">Could not reach the workspace API. Start the Node server and refresh.</div>'; });
