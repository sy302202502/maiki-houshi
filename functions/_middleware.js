/**
 * 公開しないファイルを 404 にする。
 * このリポジトリは直下がそのまま Cloudflare Pages に公開されるため、
 * 運用メモ（docs/）や .gitignore もURLを知っていれば読めてしまう。
 * 対象パスだけがこの関数を通るよう _routes.json で絞っている。
 */
// 2026-09-28 まで公開されていた旧資料も、配信網のキャッシュに残らないよう明示的に 404 にする
const PRIVATE = [
  /^\/docs(\/|$)/,
  /^\/\.gitignore$/,
  /^\/service-materials(\/|$)/,
  /^\/addHearingSheet_v3\.gs$/,
  /^\/計測(を見る\.sh|の見かた\.md)$/,
];

export async function onRequest(context) {
  const { request, env, next } = context;
  const path = decodeURIComponent(new URL(request.url).pathname);
  if (PRIVATE.some(re => re.test(path))) {
    const page = await env.ASSETS.fetch(new URL('/404.html', request.url));
    return new Response(page.body, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }
  return next();
}
