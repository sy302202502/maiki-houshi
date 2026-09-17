/**
 * 中継リンク: /go/<slug>?src=<経路>
 *   例) /go/coastline-radio?src=game
 *
 * 目的は「自分側でクリックを確実に数えること」に限定する。
 * ⚠️302リダイレクトではRefererは書き換わらないため、
 *   YouTube側の流入元が mikey-master.pages.dev になるわけではない。
 *   （YouTube側の帰属も取りたい場合は中間HTMLページ方式が必要）
 */
const DESTINATIONS = {
  'neon-tide':       'https://www.youtube.com/watch?v=PnDQp43p5jg',
  'august-fade':     'https://www.youtube.com/watch?v=i1CnU-3uneM',
  'coastline-radio': 'https://www.youtube.com/watch?v=qkdBPhUHyPw',
  'charles':         'https://www.youtube.com/watch?v=rMBv-4_VAtc',
  'yoidore':         'https://www.youtube.com/watch?v=gUv6OLai54A',
  'channel':         'https://www.youtube.com/@mikey-master',
  'subscribe':       'https://www.youtube.com/@mikey-master?sub_confirmation=1',
};

export async function onRequestGet(context) {
  const { request, env, params } = context;
  const slug = String(params.slug || '');
  const destination = DESTINATIONS[slug];

  if (!destination) {
    return new Response('Not found', { status: 404 });
  }

  // 計測は失敗してもリダイレクトを止めない
  try {
    if (env && env.CLICKS) {
      const url = new URL(request.url);
      const cf = request.cf || {};
      env.CLICKS.writeDataPoint({
        indexes: [slug],
        blobs: [
          url.searchParams.get('src') || 'unknown',
          url.searchParams.get('campaign') || '',
          request.headers.get('referer') || '',
          String(cf.country || 'unknown'),
        ],
        doubles: [1],
      });
    }
  } catch (_) { /* 計測失敗は無視 */ }

  return Response.redirect(destination, 302);
}
