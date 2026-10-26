// Offline regression checks for Cloudflare Pages middleware.
// Run with: node --test tests/middleware.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../functions/_middleware.js', import.meta.url), 'utf8');
const context = vm.createContext({ URL, Response, decodeURIComponent });
vm.runInContext(source + '\nthis.handleRequest = onRequest;', context);
const handleRequest = context.handleRequest;

function makeContext(path) {
  let nextCalls = 0;
  const ctx = {
    request: new Request('https://example.pages.dev' + path),
    env: { ASSETS: { fetch: async () => new Response('<h1>Not found</h1>', { status: 200 }) } },
    next: async () => { nextCalls++; return new Response('OK', { status: 200 }); },
  };
  return { ctx, calls: () => nextCalls };
}

test('private paths return 404 without reaching next handler', async () => {
  const paths = [
    '/docs', '/docs/', '/docs/計測の見かた.md',
    '/docs/%E8%A8%88%E6%B8%AC%E3%81%AE%E8%A6%8B%E3%81%8B%E3%81%9F.md',
    '/.gitignore', '/service-materials', '/service-materials/',
    '/addHearingSheet_v3.gs', '/計測を見る.sh', '/計測の見かた.md',
  ];
  for (const path of paths) {
    const { ctx, calls } = makeContext(path);
    const response = await handleRequest(ctx);
    assert.equal(response.status, 404, path);
    assert.equal(calls(), 0, path);
  }
});

test('public routes are forwarded unchanged', async () => {
  for (const path of ['/', '/lp', '/game', '/love-game', '/rhythm-game', '/api/ev', '/go/channel']) {
    const { ctx, calls } = makeContext(path);
    const response = await handleRequest(ctx);
    assert.equal(response.status, 200, path);
    assert.equal(calls(), 1, path);
  }
});
