import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRepository } from './repository.js';

const root = fileURLToPath(new URL('../public', import.meta.url));
const repository = createRepository();
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };

const send = (res, status, body, type = 'application/json') => { res.writeHead(status, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' }); res.end(type === 'application/json' ? JSON.stringify(body) : body); };
const readBody = async (req) => { let body = ''; for await (const chunk of req) body += chunk; return body ? JSON.parse(body) : {}; };

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (req.method === 'OPTIONS') return send(res, 204, '');
    if (url.pathname === '/api/dashboard' && req.method === 'GET') return send(res, 200, repository.getDashboard());
    if (url.pathname === '/api/sync' && req.method === 'POST') return send(res, 200, repository.syncPerformance());
    if (url.pathname === '/api/admin/overview' && req.method === 'GET') return send(res, 200, repository.getAdminOverview());
    const match = url.pathname.match(/^\/api\/deliverables\/([^/]+)\/respond$/);
    if (match && req.method === 'POST') return send(res, 200, repository.respondToDeliverable(match[1], await readBody(req)));
    if (url.pathname.startsWith('/api/')) return send(res, 404, { error: 'Not found' });
    const requested = url.pathname === '/' ? 'index.html' : normalize(url.pathname).replace(/^\//, '');
    if (requested.includes('..')) return send(res, 403, { error: 'Forbidden' });
    const file = await readFile(join(root, requested));
    return send(res, 200, file, mime[extname(file)] || 'application/octet-stream');
  } catch (error) {
    return send(res, error.message === 'Deliverable not found' ? 404 : 500, { error: error.message });
  }
});

const port = Number(process.env.PORT || 4173);
server.listen(port, '127.0.0.1', () => console.log(`Fly client portal running at http://localhost:${port}`));
