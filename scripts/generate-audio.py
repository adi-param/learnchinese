#!/usr/bin/env python3
"""Generate static Mandarin audio on macOS. Not needed to build or use the site."""
import array
import hashlib
import itertools
import json
import subprocess
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOICE = 'Tingting (Chinese (China mainland))'
RATE = 100
# Phrases and sentences are spoken a little slower, with a breath-length silence only where the text has
# punctuation. Pausing after every word sounded robotic; the app's word-by-word button covers that need.
PHRASE_RATE = 90
PUNCTUATION_PAUSE_MS = 500
# Spoken by the match game: after a correct pair, after a miss, and when a round is finished.
PRAISE = {
    'praise-right-1': '对了！',
    'praise-right-2': '真棒！',
    'praise-right-3': '好厉害！',
    'praise-again': '再试试！',
    'praise-done': '太棒了！',
}
library_path = ROOT / 'data/library.json'
library = json.loads(library_path.read_text())
folder = ROOT / 'assets/audio'
folder.mkdir(parents=True, exist_ok=True)
manifest_path = folder / 'manifest.json'
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
by_id = {item['id']: item for item in library['items']}


def speech_bounds(recording, wav):
    """Seconds where the voice starts and stops, ignoring quiet lead-in and tail."""
    subprocess.run(['/usr/bin/afconvert', '-f', 'WAVE', '-d', 'LEI16@16000', '-c', '1', str(recording), str(wav)], check=True)
    with wave.open(str(wav)) as audio:
        rate = audio.getframerate()
        samples = array.array('h', audio.readframes(audio.getnframes()))
    window = rate // 100  # 10 ms
    levels = [max(abs(v) for v in samples[i:i + window]) for i in range(0, len(samples) - window, window)]
    threshold = max(levels) * 0.08
    loud = [i for i, level in enumerate(levels) if level > threshold]
    return [round(loud[0] * window / rate, 3), round((loud[-1] + 1) * window / rate, 3)]


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
    # Praise the match game speaks, in the same voice as the lessons.
    for key, text in PRAISE.items():
        fingerprint = hashlib.sha256(f"{VOICE}|{RATE}|{text}".encode()).hexdigest()
        destination = folder / f'{key}.m4a'
        if manifest.get(key, {}).get('fingerprint') != fingerprint or not destination.exists():
            aiff = Path(temporary) / 'voice.aiff'
            subprocess.run(['/usr/bin/say', '-v', VOICE, '-r', str(RATE), '-o', str(aiff), text], check=True)
            subprocess.run(['/usr/bin/afconvert', '-f', 'm4af', '-d', 'aac ', str(aiff), str(destination)], check=True)
        manifest[key] = {'fingerprint': fingerprint, 'voice': VOICE, 'rate': RATE, 'text': text, 'file': f'assets/audio/{destination.name}'}
    def record_set(name, wanted):
        """Records one story's or topic's clips into assets/audio/<name>/ and lists them, with their timing, in
        clips.json there, which the site reads only when that story or topic is opened. Nothing about them goes
        in the main manifest, so installing the app never downloads them."""
        set_folder = folder / name
        set_folder.mkdir(parents=True, exist_ok=True)
        list_path = set_folder / 'clips.json'
        old = json.loads(list_path.read_text()) if list_path.exists() else {}
        clips = {}
        for clip, text in wanted.items():
            fingerprint = hashlib.sha256(f"{VOICE}|{RATE}|{text}".encode()).hexdigest()
            destination = set_folder / f'{clip}.m4a'
            entry = old.get(clip, {})
            if entry.get('fingerprint') != fingerprint or not destination.exists():
                aiff = Path(temporary) / 'voice.aiff'
                subprocess.run(['/usr/bin/say', '-v', VOICE, '-r', str(RATE), '-o', str(aiff), text], check=True)
                subprocess.run(['/usr/bin/afconvert', '-f', 'm4af', '-d', 'aac ', str(aiff), str(destination)], check=True)
                entry = {}
            clips[clip] = {'fingerprint': fingerprint, 'text': text, 'file': f"assets/audio/{name}/{clip}.m4a",
                           'speech': entry.get('speech') if entry.get('speech_fingerprint') == fingerprint else speech_bounds(destination, Path(temporary) / 'measure.wav'),
                           'speech_fingerprint': fingerprint}
        for stale in set_folder.glob('*.m4a'):
            if stale.stem not in wanted:
                stale.unlink()
        list_path.write_text(json.dumps(clips, ensure_ascii=False, indent=1) + '\n')
    # Stories: every line and recap word in the narrator's voice (the site plays characters lower or higher, so one
    # voice acts every part).
    for story_path in sorted((ROOT / 'data/stories').glob('*.json')):
        story = json.loads(story_path.read_text())
        record_set(f"stories/{story['id']}", {**{key: line['hanzi'] for key, line in story['lines'].items()}, **{'word-' + word['id']: word['hanzi'] for word in story['words']}})
    # Game topics: every word and every sentence the games say about it.
    for topic_path in sorted((ROOT / 'data/topics').glob('*.json')):
        topic = json.loads(topic_path.read_text())
        record_set(f"topics/{topic['id']}", {key: clip['hanzi'] for key, clip in topic['clips'].items()})
    # Where speech starts and ends in each file, so the site can highlight each character as it is spoken.
    for entry in manifest.values():
        if entry.get('speech_fingerprint') != entry['fingerprint']:
            entry['speech'] = speech_bounds(ROOT / entry['file'], Path(temporary) / 'measure.wav')
            entry['speech_fingerprint'] = entry['fingerprint']
    # The old game sentences (patterns and chunks) are gone; drop any left in the list.
    for key in [k for k in manifest if k.startswith(('pattern-', 'chunk-'))]:
        manifest.pop(key)
    # Stories keep their recordings in their own clips.json now.
    for key in [k for k in manifest if k.startswith('story-')]:
        manifest.pop(key)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
library_path.write_text(json.dumps(library, ensure_ascii=False, indent=2)+'\n')
print(f"Recorded {len(library['items'])} items.")
