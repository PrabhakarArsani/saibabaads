#!/usr/bin/env python3
"""Inject local SEO meta tags into all site HTML pages."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KEYWORDS = (ROOT / "seo" / "local-keywords.txt").read_text(encoding="utf-8").strip()
META_LINES = (ROOT / "seo" / "keyword-meta-tags.html").read_text(encoding="utf-8").strip()

PAGES = {
    "index.html": {
        "title": "Sai Baba Ads | LED Screens, LED Boards & UV Printing Hyderabad",
        "description": "Sai Baba Ads Meerpet — LED screens, LED boards, UV & flex printing, vehicle branding. Serving Meerpet, B N Reddy, Almasguda, LB Nagar, Vanasthalipuram & Hyderabad.",
        "og_title": "Sai Baba Ads — Best Signage Solutions in Hyderabad",
    },
    "about.html": {
        "title": "About Sai Baba Ads | Signage Experts Meerpet Hyderabad",
        "description": "Since 2013, Sai Baba Ads delivers LED screens, LED boards, UV and flex printing across Meerpet, Badangpet, Karmanghat, Champapet, Balapur and Hyderabad.",
        "og_title": "About Sai Baba Ads — Hyderabad Signage Company",
    },
    "services.html": {
        "title": "Our Services | LED Boards, UV & Flex Printing | Sai Baba Ads",
        "description": "LED screens, LED boards, UV printing, flex printing, vehicle branding, ACP elevation in Meerpet, Nadergul, Adibatla, Nagole, Manneguda and Hyderabad.",
        "og_title": "Signage & Print Services — Sai Baba Ads Hyderabad",
    },
    "signage-solutions.html": {
        "title": "Signage Solutions | LED Screens & Boards | Sai Baba Ads",
        "description": "Complete signage solutions: LED screens, LED boards, UV printing, flex banners. Best signage in Meerpet, B N Reddy, Almasguda, Yamjal, Injapur, Bongulur, Hyderabad.",
        "og_title": "Signage Solutions — LED & UV | Sai Baba Ads",
    },
    "contact.html": {
        "title": "Contact Sai Baba Ads | Meerpet Hyderabad Signage Quote",
        "description": "Contact Sai Baba Ads near Almasguda Kaman, Meerpet for LED screens, LED boards, UV & flex printing. Serving Vanasthalipuram, LB Nagar, Nandi Hills, Hyderabad.",
        "og_title": "Contact Sai Baba Ads — Meerpet Hyderabad",
    },
}

AREAS_META = [
    "Meerpet", "B N Reddy", "Badangpet", "Almasguda", "Balapur", "Nandi Hills",
    "Hyderabad", "L B Nagar", "Champapet", "Karmanghat", "Vanasthalipuram",
    "Yamjal", "Injapur", "Bongulur", "Manneguda", "Adibatla", "Nadergul", "Nagol",
]

JSON_LD = """
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Sai Baba Ads",
        "description": "LED screens, LED boards, UV printing, flex printing and vehicle branding in Hyderabad.",
        "telephone": "+91-970-333-3878",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Plot No:18, Near Almasguda Kaman Main Road, Prashanthi Hills",
          "addressLocality": "Meerpet",
          "addressRegion": "Telangana",
          "postalCode": "500097",
          "addressCountry": "IN"
        },
        "areaServed": ["Meerpet", "B N Reddy", "Badangpet", "Almasguda", "Balapur", "Nandi Hills", "Hyderabad", "L B Nagar", "Champapet", "Karmanghat", "Vanasthalipuram", "Yamjal", "Injapur", "Bongulur", "Manneguda", "Adibatla", "Nadergul", "Nagol"],
        "image": "favicon-512x512.png",
        "logo": "favicon-512x512.png"
      }
    </script>"""

FAVICON_HEAD = """    <link rel="icon" href="favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="48x48" href="favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
    <link rel="manifest" href="site.webmanifest" />
    <meta name="theme-color" content="#0d2847" />"""


def build_seo_block(page_file: str, cfg: dict) -> str:
    areas_lines = "\n".join(
        f'    <meta name="geo.service-area" content="{a}, Telangana, India" />'
        for a in AREAS_META
    )
    block = f"""    <meta name="robots" content="index, follow" />
    <meta name="author" content="Sai Baba Ads" />
    <meta name="keywords" content="{KEYWORDS.replace('"', "&quot;")}" />
    <meta
      name="description"
      content="{cfg["description"]}"
    />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="{cfg["og_title"]}" />
    <meta property="og:description" content="{cfg["description"]}" />
    <meta property="og:site_name" content="Sai Baba Ads" />
    <meta property="og:image" content="favicon-512x512.png" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
    <meta property="og:image:alt" content="Sai Baba Ads logo" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="favicon-512x512.png" />
    <meta name="twitter:title" content="{cfg["og_title"]}" />
    <meta name="twitter:description" content="{cfg["description"]}" />
    <meta name="geo.region" content="IN-TG" />
    <meta name="geo.placename" content="Meerpet, Hyderabad" />
{areas_lines}
{META_LINES}"""
    if page_file == "index.html":
        block += JSON_LD
    block += f"""
    <title>{cfg["title"]}</title>"""
    return block


def inject(path: Path, cfg: dict) -> None:
    html = path.read_text(encoding="utf-8")
    html = re.sub(r'\n    <link rel="icon"[^>]*>', "", html)
    html = re.sub(r'\n    <link rel="apple-touch-icon"[^>]*>', "", html)
    html = re.sub(r'\n    <link rel="manifest"[^>]*>', "", html)
    html = re.sub(r'\n    <meta name="theme-color"[^>]*>', "", html)
    html = re.sub(r'\n    <meta property="og:image[^"]*"[^>]*>', "", html)
    html = re.sub(r'\n    <meta name="twitter:image"[^>]*>', "", html)
    html = re.sub(r'\n    <meta name="local-seo-\d+"[^>]*>', "", html)
    html = re.sub(r'\n    <meta name="geo\.service-area"[^>]*>', "", html)
    html = re.sub(
        r"\n    <meta name=\"robots\"[^>]*>.*?<title>[^<]*</title>",
        "",
        html,
        flags=re.DOTALL,
    )
    html = re.sub(
        r"\n    <meta\s+name=\"description\"[^/]*/>\s*\n    <title>[^<]*</title>",
        "",
        html,
        count=1,
    )
    seo = build_seo_block(path.name, cfg)
    html = html.replace(
        '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n'
        + FAVICON_HEAD
        + "\n"
        + seo,
        1,
    )
    path.write_text(html, encoding="utf-8")


for name, cfg in PAGES.items():
    inject(ROOT / name, cfg)
    print("Updated", name)
