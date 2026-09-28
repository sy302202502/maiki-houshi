/**
 * 公開しないファイルを 404 にする。
 * このリポジトリは直下がそのまま Cloudflare Pages に公開されるため、
 * 運用メモ（docs/）や .gitignore もURLを知っていれば読めてしまう。
 * 対象パスだけがこの関数を通るよう _routes.json で絞っている。
 */
const PRIVATE = [/^\/docs(\/|$)/, /^\/\.gitignore$/];

export async function onRequest(context) {
  const { request, env, next } = context;
  const path = decodeURIComponent(new URL(request.url).pathname);
  if (PRIVATE.some(re => re.test(path))) {
    const page = await env.ASSETS.fetch(new URL('/404.html', request.url));
    return new Response(page.body, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }
  return next();
}
