"""Local development server that never lets the browser cache files and supports byte ranges.

Python's plain http.server sends no Cache-Control header, so browsers heuristically reuse old modules.
After an edit that mixes a cached old module with a new one the app fails to start.
It also ignores Range requests, and Safari refuses to play audio from a server that cannot answer them
(GitHub Pages can, so this only matters locally).
"""
import os
import re
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class DevHandler(SimpleHTTPRequestHandler):
    # macOS maps .m4a to audio/mp4a-latm, which Safari rejects; GitHub Pages sends audio/mp4.
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.m4a': 'audio/mp4'}

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Accept-Ranges', 'bytes')
        if self.path.split('?')[0] in ('/', '/index.html'):
            # Evicts modules a browser cached before this server was used; otherwise they are never refetched.
            self.send_header('Clear-Site-Data', '"cache"')
        super().end_headers()

    def send_head(self):
        match = re.fullmatch(r'bytes=(\d*)-(\d*)', self.headers.get('Range', '').strip())
        path = self.translate_path(self.path)
        if not match or not os.path.isfile(path):
            return super().send_head()
        size = os.path.getsize(path)
        start, end = match.groups()
        if start:
            first, last = int(start), min(int(end) if end else size - 1, size - 1)
        else:
            first, last = max(size - int(end or 0), 0), size - 1
        if first > last or first >= size:
            self.send_response(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
            self.send_header('Content-Range', f'bytes */{size}')
            self.end_headers()
            return None
        file = open(path, 'rb')
        file.seek(first)
        self.range_left = last - first + 1
        self.send_response(HTTPStatus.PARTIAL_CONTENT)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Range', f'bytes {first}-{last}/{size}')
        self.send_header('Content-Length', str(self.range_left))
        self.end_headers()
        return file

    def copyfile(self, source, outputfile):
        left = getattr(self, 'range_left', None)
        if left is None:
            return super().copyfile(source, outputfile)
        outputfile.write(source.read(left))
        self.range_left = None


class DevServer(ThreadingHTTPServer):
    # The default backlog of 5 drops connections when a browser fetches a dozen modules at once,
    # and one missing module leaves the page stuck on "Getting ready".
    request_queue_size = 128
    daemon_threads = True


if __name__ == '__main__':
    root = Path(__file__).resolve().parent.parent
    server = DevServer(('127.0.0.1', 4173), partial(DevHandler, directory=root))
    print('Serving http://127.0.0.1:4173 (no caching, byte ranges)')
    server.serve_forever()
