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
            extra = {}
            if isinstance(text, dict):
                extra = {k: v for k, v in text.items() if k != 'hanzi'}
                text = text['hanzi']
            fingerprint = hashlib.sha256(f"{VOICE}|{RATE}|{text}".encode()).hexdigest()
            destination = set_folder / f'{clip}.m4a'
            entry = old.get(clip, {})
            if entry.get('fingerprint') != fingerprint or not destination.exists():
                aiff = Path(temporary) / 'voice.aiff'
                subprocess.run(['/usr/bin/say', '-v', VOICE, '-r', str(RATE), '-o', str(aiff), text], check=True)
                subprocess.run(['/usr/bin/afconvert', '-f', 'm4af', '-d', 'aac ', str(aiff), str(destination)], check=True)
                entry = {}
            clips[clip] = {**extra, 'fingerprint': fingerprint, 'text': text, 'file': f"assets/audio/{name}/{clip}.m4a",
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
        if story_path.stem == 'shared':
            record_set('stories/shared', {key: clip['hanzi'] for key, clip in story['clips'].items()})
            continue
        record_set(f"stories/{story['id']}", {**{key: line['hanzi'] for key, line in story['lines'].items()}, **{'word-' + word['id']: word['hanzi'] for word in story['words']}})
    # The situation games: every word in the catalogue, and every line and sentence each game can say. A template
    # is expanded for every entry of the lists it names (or only the ones it lists), so adding an animal or a food
    # to data/catalog.json records all its sentences.
    catalog = json.loads((ROOT / 'data/catalog.json').read_text())
    record_set('catalog', {f"{name}-{item['id']}": {'hanzi': item['hanzi'], 'pinyin': item['pinyin'], 'english': item['english']}
                           for name, items in catalog.items() if isinstance(items, list) for item in items})
    def fill(text, values, field):
        for slot, item in values.items():
            for key, value in item.items():
                text = text.replace('{' + slot + '.' + key + '}', str(value))
            text = text.replace('{' + slot + '}', item[field])
        return text
    def expand(name, template):
        slots = list(template['slots'].items())
        lists = [[i for i in catalog[list_name] if i['id'] in template.get('only', {}).get(slot, [i['id'] for i in catalog[list_name]])] for slot, list_name in slots]
        for combo in itertools.product(*lists):
            values = {slot: dict(item) for (slot, _), item in zip(slots, combo)}
            if template.get('counting'):
                values = {slot: {**item, **({'hanzi': '二', 'pinyin': 'èr'} if item['id'] == '2' else {})} for slot, item in values.items()}
            pinyin = fill(template['pinyin'], values, 'pinyin')
            yield name + '-' + '-'.join(item['id'] for item in combo), {
                'hanzi': fill(template['hanzi'], values, 'hanzi'), 'pinyin': pinyin[:1].upper() + pinyin[1:],
                'english': fill(template['english'], values, 'english').replace('  ', ' '), 'speaker': template['speaker']}
    for scenario_path in sorted((ROOT / 'data/games').glob('*.json')):
        scenario = json.loads(scenario_path.read_text())
        wanted = {key: {**line} for key, line in scenario['lines'].items()}
        for name, template in scenario['templates'].items():
            wanted.update(dict(expand(name, template)))
        record_set(f"games/{scenario['id']}", wanted)
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
