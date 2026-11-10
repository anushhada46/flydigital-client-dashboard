import test from 'node:test';
import assert from 'node:assert/strict';
import { createRepository } from './repository.js';

test('returns seven services and a stored performance snapshot', () => {
    const dashboard = createRepository().getDashboard();
    assert.equal(dashboard.services.length, 7);
    assert.deepEqual(dashboard.services.map((service) => service.name), [
      'Branding', 'Website Development', 'PPC & SEO', 'Social Media Marketing',
      'Digital Campaign', 'Creative Production', 'Influencer Marketing',
    ]);
    assert.ok(dashboard.performance.lastSyncedAt);
    assert.equal(dashboard.performance.source, 'stored snapshot');
});

test('updates the stored snapshot timestamp on sync', () => {
    const repository = createRepository();
    const before = repository.getDashboard().performance.lastSyncedAt;
    const after = repository.syncPerformance();

    assert.notEqual(after.performance.lastSyncedAt, before);
    assert.match(after.activity[0].title, /Performance data synced/);
});

test('records a client approval response on a deliverable', () => {
    const repository = createRepository();
    const updated = repository.respondToDeliverable('brand-kit', {
      status: 'revision',
      comment: 'Please explore a warmer secondary mark.',
    });

    assert.equal(updated.deliverables[0].status, 'revision requested');
    assert.match(updated.deliverables[0].clientComment, /warmer secondary/);
    assert.match(updated.activity[0].title, /revision requested/);
});
