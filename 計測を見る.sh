#!/bin/bash
# 計測データを表示する。使い方: ./計測を見る.sh [日数]  (既定 7日)
#
# 認証情報は ~/.config/cloudflare/maiki.env に置く（リポジトリには入れない）:
#   CF_ACCOUNT_ID=xxxxxxxx
#   CF_ANALYTICS_TOKEN=xxxxxxxx
set -euo pipefail

CONF=~/.config/cloudflare/maiki.env
[ -f "$CONF" ] || { echo "設定がない: $CONF を作る（README は 計測の見かた.md）"; exit 1; }
# shellcheck disable=SC1090
source "$CONF"
DAYS="${1:-7}"

q() {  # q <SQL>
  curl -s "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/analytics_engine/sql" \
    -H "Authorization: Bearer $CF_ANALYTICS_TOKEN" --data-binary "$1"
}

show() {  # show <見出し> <SQL>
  echo; echo "── $1（直近 ${DAYS} 日）"
  local out; out=$(q "$2")
  if echo "$out" | grep -q '"errors"'; then echo "$out" | head -c 500; echo; return; fi
  echo "$out" | python3 -c '
import sys,json
d=json.load(sys.stdin).get("data",[])
if not d: print("  データなし"); raise SystemExit
w=max(len(str(r[list(r)[0]])) for r in d)
for r in d:
    k=list(r); print(f"  {str(r[k[0]]):<{w}}  {str(r[k[1]]):<18} {r[k[2]]:>6}")'
}

show "表示・再生" "SELECT index1 AS ev, blob1 AS detail, sum(_sample_interval) AS n
  FROM maiki_events WHERE timestamp > NOW() - INTERVAL '$DAYS' DAY
  GROUP BY ev, detail ORDER BY n DESC LIMIT 30"

show "外部リンククリック" "SELECT index1 AS slug, blob1 AS src, sum(_sample_interval) AS n
  FROM maiki_clicks WHERE timestamp > NOW() - INTERVAL '$DAYS' DAY
  GROUP BY slug, src ORDER BY n DESC LIMIT 30"
echo
