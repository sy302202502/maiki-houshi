"""Read-only HTTP smoke check for a deployed Cloudflare Pages site.

Usage:
    python scripts/check_public_routes.py
    python scripts/check_public_routes.py https://your-preview.pages.dev

Never prints response bodies or credentials. Uses GET because some edge handlers
do not implement HEAD identically to GET.
"""
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

DEFAULT_BASE = "https://mikey-master.pages.dev"
PUBLIC = ["/", "/lp", "/game", "/love-game", "/rhythm-game"]
PRIVATE = [
    "/docs/計測の見かた.md",
    "/docs/計測を見る.sh",
    "/.gitignore",
    "/service-materials/",
    "/addHearingSheet_v3.gs",
    "/計測を見る.sh",
    "/計測の見かた.md",
]

def status(url):
    req = Request(url, headers={"User-Agent": "MaikiSiteSmokeCheck/1.0"})
    try:
        with urlopen(req, timeout=15) as response:
            return response.status
    except HTTPError as error:
        return error.code

def main():
    base = (sys.argv[1] if len(sys.argv) > 1 else DEFAULT_BASE).rstrip("/")
    if not base.startswith("https://"):
        print("ERROR: HTTPS URL required")
        return 2
    failures = 0
    for path, expected in [(p, 200) for p in PUBLIC] + [(p, 404) for p in PRIVATE]:
        url = base + quote(path, safe="/.")
        try:
            actual = status(url)
            ok = actual == expected
            print(f"{'PASS' if ok else 'FAIL'} {path}: HTTP {actual} (expected {expected})")
            failures += not ok
        except (URLError, TimeoutError, OSError) as exc:
            print(f"ERROR {path}: {type(exc).__name__} (could not verify)")
            failures += 1
    print(f"Checked {len(PUBLIC) + len(PRIVATE)} routes; failures: {failures}")
    return 1 if failures else 0

if __name__ == "__main__":
    raise SystemExit(main())
