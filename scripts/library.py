#!/usr/bin/env python3
"""Validate curriculum data and render the human-readable review document (stdlib only)."""
import argparse
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def chinese(text):
    return ''.join(re.findall(r'[\u3400-\u9fff]', text))

def load_and_validate():
    library = json.loads((ROOT / 'data/library.json').read_text())
    ledger = json.loads((ROOT / 'data/source-ledger.json').read_text())
    items = library['items']
    by_id = {item['id']: item for item in items}
    assert len(by_id) == len(items), 'Duplicate item IDs'
    assert len({(i['kind'], i['hanzi'], i['pinyin']) for i in items}) == len(items), 'Duplicate learning items'
    lessons = {lesson['id']: lesson for lesson in library['lessons']}
    sources = {s['id']: s for s in library['sources']}
    for item in items:
        assert item['kind'] in ('word', 'phrase', 'sentence')
        for field in ('hanzi', 'pinyin', 'english', 'category'):
            assert isinstance(item[field], str) and item[field].strip(), (item['id'], field)
        assert not re.search(r'[0-9\u3400-\u9fff]', item['pinyin']), item['pinyin']
        assert item['reviewStatus'] in ('draft', 'approved'), item['id']
        assert item['occurrences'], item['id']
        for occurrence in item['occurrences']:
            assert occurrence['lessonId'] in lessons
            assert item['id'] in lessons[occurrence['lessonId']]['itemIds']
            assert occurrence['sourceId'] in sources
            assert 1 <= occurrence['pdfPage'] <= sources[occurrence['sourceId']]['pdfPages']
            assert occurrence['scope'] in ('core', 'instruction', 'illustration')
        if item['kind'] != 'word':
            words = [by_id[w] for w in item['wordIds']]
            assert all(w['kind'] == 'word' for w in words)
            assert ''.join(w['hanzi'] for w in words) == chinese(item['hanzi']), item['hanzi']
    for lesson in lessons.values():
        assert lesson['learningStatus'] in ('not-confirmed', 'learning', 'covered')
        assert len(set(lesson['itemIds'])) == len(lesson['itemIds'])
        assert set(lesson['itemIds']) <= set(by_id)
        if lesson['coverageStatus'] == 'missing':
            assert not lesson['itemIds']
    words = {i['hanzi'] for i in items if i['kind'] == 'word'}
    for row in ledger:
        assert row['origin'] in ('printed-passage', 'printed-vocabulary', 'illustration-label', 'extracted-chunk')
        if row['origin'] == 'extracted-chunk':
            assert any(row['hanzi'] in passage['hanzi'] and row['lesson'] == passage['lesson'] and passage['origin'] == 'printed-passage' for passage in ledger), row['hanzi']
        assert ''.join(row['tokens']) == chinese(row['hanzi']), row['hanzi']
        assert set(row['tokens']) <= words, row['hanzi']
        item = next(i for i in items if (i['kind'], i['hanzi'], i['pinyin']) == (row['kind'], row['hanzi'], row['pinyin']))
        for source in row['sources']:
            assert any(o['lessonId'] == f"lesson-{row['lesson']}" and o['scope'] == row['scope'] and all(o[k] == v for k,v in source.items()) for o in item['occurrences'])
    # Audit that every non-target lexical item is supported by a transcribed passage or chunk.
    for word in (i for i in items if i['kind'] == 'word'):
        assert any(word['hanzi'] in r['tokens'] for r in ledger), word['hanzi']
    return library

def render(library):
    out = ['# Chinese learning library', '',
           'Draft extracted from the 48 supplied PDF pages. Chinese was visually checked; Pinyin and English are editorial and await parent/native-speaker review. These entries do not assert that Ira has learned or mastered them.', '',
           'PDF page numbers below are **1-based file pages**, each usually containing a photographed two-page spread. English lesson titles are descriptive labels, not textbook titles.', '',
           'Words are lexical units: e.g. 葡萄 (pú tao, grapes) remains one word. Useful compound components are included where supported; individual characters are not automatically treated as words. Pinyin is syllable-spaced with dictionary tones and unmarked neutral tones. 不会 is written bù huì; the 不 is normally pronounced bú before huì in connected speech.', '',
           '## Coverage', '', '| Lesson | Topic | Coverage |', '| --- | --- | --- |']
    for lesson in library['lessons']:
        out.append(f"| {lesson['number']} | {lesson['title']} | {lesson['coverageStatus']} |")
    for lesson in library['lessons']:
        out += ['', f"## Lesson {lesson['number']}: {lesson['title']}", '']
        out += [note for note in lesson['notes']]
        for kind, heading in [('word','Words'),('phrase','Phrases'),('sentence','Sentences')]:
            selected=[i for i in library['items'] if i['kind']==kind and i['id'] in lesson['itemIds']]
            if not selected: continue
            out += ['', f'### {heading}', '', '| Chinese | Pinyin | English | Scope | Source |', '| --- | --- | --- | --- | --- |']
            for item in selected:
                occ=[o for o in item['occurrences'] if o['lessonId']==lesson['id']]
                scope=', '.join(sorted({o['scope'] for o in occ}))
                source=', '.join(f"{b}, PDF p. {p}" for b,p in sorted({(o['sourceId'],o['pdfPage']) for o in occ}))
                out.append(f"| {item['hanzi']} | {item['pinyin']} | {item['english']} | {scope} | {source} |")
    return '\n'.join(out)+'\n'

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--write-docs',action='store_true')
    args=parser.parse_args()
    library=load_and_validate()
    expected=render(library)
    output=ROOT/'docs/library.md'
    if args.write_docs: output.write_text(expected)
    else: assert output.read_text() == expected, 'Run python3 scripts/library.py --write-docs to update the review document'
    print('Validated:',dict(Counter(i['kind'] for i in library['items'])))
