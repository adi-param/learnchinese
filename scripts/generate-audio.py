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
# Phrases and sentences are spoken a little slower, with a breath-length silence only where the text has
# punctuation. Pausing after every word sounded robotic; the app's word-by-word button covers that need.
PHRASE_RATE = 90
PUNCTUATION_PAUSE_MS = 500
library_path = ROOT / 'data/library.json'
library = json.loads(library_path.read_text())
folder = ROOT / 'assets/audio'
folder.mkdir(parents=True, exist_ok=True)
manifest_path = folder / 'manifest.json'
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
by_id = {item['id']: item for item in library['items']}


def spoken(item):
    """Returns the text for `say` and its rate, with silences where the item has punctuation."""
    if item['kind'] == 'word':
        return item['hanzi'], RATE
    text, position, parts = item['hanzi'], 0, []
    for word in (by_id[word_id]['hanzi'] for word_id in item['wordIds']):
        punctuated = False
        while not text.startswith(word, position):
            if position >= len(text):
                raise ValueError(f"{item['id']}: words do not spell {text}")
            position += 1  # Anything between words is punctuation.
            punctuated = True
        if parts and punctuated:
            parts.append(f'[[slnc {PUNCTUATION_PAUSE_MS}]]')
        parts.append(word)
        position += len(word)
    return ''.join(parts), PHRASE_RATE

with tempfile.TemporaryDirectory(prefix='chinese-audio-') as temporary:
    for index, item in enumerate(library['items']):
        text, rate = spoken(item)
        fingerprint = hashlib.sha256(f"{VOICE}|{rate}|{text}".encode()).hexdigest()
        destination = folder / f"{item['id']}.m4a"
        if manifest.get(item['id'], {}).get('fingerprint') != fingerprint or not destination.exists():
            aiff = Path(temporary) / 'voice.aiff'
            subprocess.run(['/usr/bin/say', '-v', VOICE, '-r', str(rate), '-o', str(aiff), text], check=True)
            subprocess.run(['/usr/bin/afconvert', '-f', 'm4af', '-d', 'aac ', str(aiff), str(destination)], check=True)
            if destination.stat().st_size < 4500:
                raise ValueError(f'Empty or suspicious recording: {destination}')
        item['audio'] = f'assets/audio/{destination.name}'
        manifest[item['id']] = {'fingerprint': fingerprint, 'voice': VOICE, 'rate': rate, 'text': text, 'file': item['audio']}
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
        if (index + 1) % 25 == 0: print(f"Recorded {index + 1}/{len(library['items'])}", flush=True)
library_path.write_text(json.dumps(library, ensure_ascii=False, indent=2)+'\n')
print(f"Recorded {len(library['items'])} items.")
