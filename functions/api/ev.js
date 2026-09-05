/**
 * イベント計測ビーコン: /api/ev?e=<イベント名>&v=<数値>&d=<補足>
 * navigator.sendBeacon から fire-and-forget で呼ばれる。
 * Analytics Engine のバインディング(EVENTS)が無くても 204 を返す。
 */
export async function onRequest(context) {
  const { request, env } = context;
  try {
    if (env && env.EVENTS) {
      const url = new URL(request.url);
      const cf = request.cf || {};
      env.EVENTS.writeDataPoint({
        indexes: [url.searchParams.get('e') || 'unknown'],
        blobs: [
          url.searchParams.get('d') || '',
          request.headers.get('referer') || '',
          String(cf.country || 'unknown'),
        ],
        doubles: [Number(url.searchParams.get('v') || 1) || 1],
      });
    }
  } catch (_) { /* 計測失敗は無視 */ }

  return new Response(null, { status: 204 });
}
