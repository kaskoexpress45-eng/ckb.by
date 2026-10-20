#!/usr/bin/env python3
"""Export public WordPress content; never a replacement for a hosting backup."""
import argparse
import concurrent.futures
import datetime
import hashlib
import json
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--origin', default='https://ckb.by')
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
origin = args.origin.rstrip('/')
if urlsplit(origin).scheme != 'https':
    parser.error('An HTTPS origin is required')
if args.output.exists():
    parser.error('Output already exists; choose a new directory to preserve previous exports')
args.output.mkdir(parents=True)

def request(resource, page):
    url = f'{origin}/wp-json/wp/v2/{resource}?per_page=100&page={page}'
    with urlopen(Request(url, headers={'User-Agent': 'CKB-content-migration/1.0'}), timeout=60) as response:
        return json.load(response), int(response.headers['X-WP-Total']), int(response.headers['X-WP-TotalPages'])

manifest = {'origin': origin, 'exported_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'scope': 'Public REST content only. No database, private records, themes, plugins or media binaries.',
            'resources': {}}
for resource in ('posts', 'pages', 'categories', 'tags', 'media'):
    first, total, pages = request(resource, 1)
    rows = first
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for batch, observed_total, _ in pool.map(lambda page: request(resource, page), range(2, pages + 1)):
            if observed_total != total:
                raise RuntimeError(f'{resource} changed during export; rerun into a fresh directory')
            rows.extend(batch)
    if len(rows) != total or len({row['id'] for row in rows}) != total:
        raise RuntimeError(f'{resource}: incomplete or duplicate results')
    encoded = (json.dumps(rows, ensure_ascii=False, indent=2) + '\n').encode()
    (args.output / f'{resource}.json').write_bytes(encoded)
    manifest['resources'][resource] = {'count': total, 'bytes': len(encoded), 'sha256': hashlib.sha256(encoded).hexdigest()}
    print(resource, total, flush=True)
    (args.output / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(f'Export verified: {args.output}', flush=True)
