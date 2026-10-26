"""Static regression checks for the Cloudflare Pages site (no external dependencies)."""
from pathlib import Path
import json
import re
import unittest
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "/": "index.html",
    "/lp": "lp.html",
    "/game": "game.html",
    "/love-game": "love-game.html",
    "/rhythm-game": "rhythm-game.html",
}
SITE = "https://mikey-master.pages.dev"

class SiteIntegrityTests(unittest.TestCase):
    def test_sitemap_matches_public_pages(self):
        root = ET.parse(ROOT / "sitemap.xml").getroot()
        urls = [el.text for el in root.findall(".//{*}loc")]
        self.assertEqual(len(urls), len(set(urls)), "Duplicate sitemap URLs")
        self.assertEqual(set(urls), {SITE + path for path in PAGES})

    def test_canonical_urls_match_sitemap(self):
        for path, filename in PAGES.items():
            with self.subTest(page=filename):
                html = (ROOT / filename).read_text(encoding="utf-8")
                canonical = re.search(
                    r'<link\s+rel="canonical"\s+href="([^"]+)"', html
                )
                self.assertIsNotNone(canonical, "Missing canonical URL")
                self.assertEqual(canonical.group(1), SITE + path)
                self.assertRegex(html, r'<html\s+lang="ja"')
                self.assertRegex(html, r'<meta\s+name="description"')

    def test_internal_root_links_have_targets(self):
        for filename in PAGES.values():
            html = (ROOT / filename).read_text(encoding="utf-8")
            for href in re.findall(r'\bhref="([^"]+)"', html):
                if not href.startswith("/") or href.startswith("//"):
                    continue
                parsed = urlparse(href)
                path = parsed.path
                if path.startswith(("/go/", "/api/")):
                    continue  # Handled by Cloudflare Functions.
                if path in PAGES:
                    continue  # Pretty URLs are routed by Cloudflare Pages.
                with self.subTest(page=filename, href=href):
                    self.assertTrue((ROOT / path.lstrip("/")).is_file(),
                                    f"Missing local target: {href}")

    def test_private_paths_are_routed_through_middleware(self):
        routes = json.loads((ROOT / "_routes.json").read_text(encoding="utf-8"))
        includes = set(routes["include"])
        for route in ("/docs", "/docs/*", "/.gitignore",
                      "/service-materials", "/service-materials/*"):
            with self.subTest(route=route):
                self.assertIn(route, includes)
        middleware = (ROOT / "functions/_middleware.js").read_text(encoding="utf-8")
        for token in ("docs", "service-materials", "gitignore"):
            self.assertIn(token, middleware)

    def test_redirect_slugs_used_by_homepage_are_defined(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        redirects = (ROOT / "functions/go/[slug].js").read_text(encoding="utf-8")
        slugs = set(re.findall(r'(?:href|data-url)="/go/([a-z0-9-]+)', html))
        self.assertTrue(slugs, "No redirect links found; review this test")
        for slug in slugs:
            with self.subTest(slug=slug):
                self.assertIn(f"'{slug}':", redirects)

if __name__ == "__main__":
    unittest.main()
