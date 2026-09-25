#!/usr/bin/env python3
"""Generate static Mandarin audio on macOS. Not needed to build or use the site."""
import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOICE = 'Tingting (Chinese (China mainland))'
RATE = 100
library_path = ROOT / 'data/library.json'
library = json.loads(library_path.read_text())
folder = ROOT / 'assets/audio'
folder.mkdir(parents=True, exist_ok=True)
manifest_path = folder / 'manifest.json'
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
with tempfile.TemporaryDirectory(prefix='chinese-audio-') as temporary:
    for index, item in enumerate(library['items']):
        fingerprint = hashlib.sha256(f"{VOICE}|{RATE}|{item['hanzi']}".encode()).hexdigest()
        destination = folder / f"{item['id']}.m4a"
        if manifest.get(item['id'], {}).get('fingerprint') != fingerprint or not destination.exists():
            aiff = Path(temporary) / 'voice.aiff'
            subprocess.run(['/usr/bin/say', '-v', VOICE, '-r', str(RATE), '-o', str(aiff), item['hanzi']], check=True)
            subprocess.run(['/usr/bin/afconvert', '-f', 'm4af', '-d', 'aac ', str(aiff), str(destination)], check=True)
            if destination.stat().st_size < 4500:
                raise ValueError(f'Empty or suspicious recording: {destination}')
        item['audio'] = f'assets/audio/{destination.name}'
        manifest[item['id']] = {'fingerprint': fingerprint, 'voice': VOICE, 'rate': RATE, 'text': item['hanzi'], 'file': item['audio']}
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
        if (index + 1) % 25 == 0: print(f"Recorded {index + 1}/{len(library['items'])}", flush=True)
library_path.write_text(json.dumps(library, ensure_ascii=False, indent=2)+'\n')
print(f"Recorded {len(library['items'])} items.")
