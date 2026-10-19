#!/usr/bin/env python3
"""Makes the stories' background sounds and little effects as local audio files (assets/audio/sounds/), so the
site plays them like any other recording: no downloads at play time, no browser permission. Plain Python, no
extra packages; afconvert (macOS) turns them into small .m4a files. Only needed when a sound is added or changed."""
import array
import math
import random
import subprocess
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/audio/sounds'
RATE = 22050
random.seed(7)


def blank(seconds):
    return [0.0] * int(RATE * seconds)


def add_tone(buf, start, length, freq, volume, decay=6.0, freq_end=None, shape='sine'):
    """Adds one note (or a sweep, when freq_end is given) with a soft attack and an exponential fade."""
    first = int(start * RATE)
    n = int(length * RATE)
    phase = 0.0
    for i in range(n):
        if first + i >= len(buf):
            break
        t = i / RATE
        f = freq if freq_end is None else freq + (freq_end - freq) * (i / n)
        phase += 2 * math.pi * f / RATE
        wave_value = math.sin(phase) if shape == 'sine' else (1 if math.sin(phase) > 0 else -1) * .5
        envelope = min(1.0, t / .01) * math.exp(-decay * t)
        buf[first + i] += wave_value * envelope * volume


def add_noise(buf, start, length, volume, decay=20.0, smooth=0.0):
    first = int(start * RATE)
    last = 0.0
    for i in range(int(length * RATE)):
        if first + i >= len(buf):
            break
        value = random.uniform(-1, 1)
        last = last * smooth + value * (1 - smooth)
        buf[first + i] += last * math.exp(-decay * i / RATE) * volume


def save(name, buf, loop_fade=0.0):
    """Writes the samples, softly limited, and fades the ends of a loop so it repeats without a click."""
    if loop_fade:
        n = int(loop_fade * RATE)
        for i in range(n):
            k = i / n
            buf[i] *= k
            buf[-1 - i] *= k
    peak = max(1e-9, max(abs(v) for v in buf))
    scale = min(1.0, .9 / peak)
    samples = array.array('h', (int(max(-1, min(1, v * scale)) * 32767) for v in buf))
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as temporary:
        wav = Path(temporary) / f'{name}.wav'
        with wave.open(str(wav), 'wb') as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(RATE)
            w.writeframes(samples.tobytes())
        subprocess.run(['/usr/bin/afconvert', '-f', 'm4af', '-d', 'aac ', '-b', '64000', str(wav), str(OUT / f'{name}.m4a')], check=True)
    print(f'assets/audio/sounds/{name}.m4a')


# Birdsong for the meadow: little chirps and trills scattered over 16 seconds.
birds = blank(16)
for _ in range(26):
    start = random.uniform(0, 15.2)
    base = random.uniform(2200, 3600)
    for k in range(random.choice([1, 2, 3, 4])):
        add_tone(birds, start + k * .09, .08, base, .18, decay=30, freq_end=base * random.uniform(1.1, 1.4))
save('birds', birds, loop_fade=.4)

# A gentle music-box tune on the pentatonic scale, loops every 12.8 seconds.
music = blank(12.8)
scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]
tune = [0, 2, 4, 2, 3, 1, 0, None, 2, 4, 5, 4, 3, 2, 1, None, 0, 1, 2, 4, 3, 1, 2, None, 4, 3, 2, 1, 0, 2, 0, None]
for i, note in enumerate(tune):
    if note is None:
        continue
    add_tone(music, i * .4, 1.2, scale[note], .22, decay=3.5)
    add_tone(music, i * .4, 1.2, scale[note] * 2, .05, decay=5)
for bar in range(4):
    add_tone(music, bar * 3.2, 3.0, scale[0] / 2 if bar % 2 == 0 else scale[3] / 2, .12, decay=1.2)
save('music', music, loop_fade=.3)

# A fire crackling: soft rumble with pops.
fire = blank(8)
add_noise(fire, 0, 8, .06, decay=0, smooth=.97)
for _ in range(60):
    add_noise(fire, random.uniform(0, 7.9), .03, random.uniform(.2, .5), decay=120)
save('fire', fire, loop_fade=.3)

# Effects for things she taps.
pop = blank(.25); add_tone(pop, 0, .2, 600, .8, decay=22, freq_end=1400); save('pop', pop)
boing = blank(.6); add_tone(boing, 0, .55, 220, .8, decay=6, freq_end=520); add_tone(boing, .05, .5, 330, .3, decay=7, freq_end=700); save('boing', boing)
twinkle = blank(.8)
for k, f in enumerate([1568, 2093, 2637, 3136]):
    add_tone(twinkle, k * .08, .5, f, .3, decay=9)
save('twinkle', twinkle)
tweet = blank(.6)
for k in range(3):
    add_tone(tweet, k * .14, .1, 2800, .5, decay=25, freq_end=3800)
save('tweet', tweet)
whoosh = blank(.7); add_noise(whoosh, 0, .7, .5, decay=4, smooth=.8); save('swish', whoosh)
