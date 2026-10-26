"""Fixtures for testing scripts/smoke-test.sh without running Soombook.

A stub server stands in for the site and serves canned responses, so each test
can set up a healthy site, a down database, a regression or a flaky endpoint,
then check what the smoke test reports and which exit code it returns.
"""

import json
import os
import shutil
import socket
import subprocess
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import pytest

SMOKE_TEST = Path(__file__).resolve().parents[2] / "scripts" / "smoke-test.sh"


class StubSoombook:
    """Serves canned responses per path and records every request it receives.

    respond(path, *responses) queues responses for a path; each request takes the
    next one and the last one repeats, which makes flaky endpoints easy to fake.
    JSON bodies are encoded without spaces, the way Next.js's res.json() sends them.
    """

    def __init__(self):
        self.routes = {}
        self.requests = []
        self._lock = threading.Lock()
        self._server = ThreadingHTTPServer(("127.0.0.1", 0), self._make_handler())
        self.url = f"http://127.0.0.1:{self._server.server_address[1]}"
        self._thread = threading.Thread(target=self._server.serve_forever, daemon=True)

    def respond(self, path, *responses):
        self.routes[path] = list(responses)

    def healthy(self):
        self.respond("/api/health", (200, {"status": "ok", "checks": {"database": "ok"}}))
        self.respond("/", (200, "<!DOCTYPE html><html><body>Soombook</body></html>"))
        self.respond("/api/getUserOrders", (401, {"error": "Sign in to see your orders."}))

    def hits(self, path):
        return sum(1 for request in self.requests if request["path"] == path)

    def start(self):
        self._thread.start()

    def stop(self):
        self._server.shutdown()
        self._server.server_close()

    def _next_response(self, path):
        with self._lock:
            queue = self.routes.get(path)
            if not queue:
                return 404, {"error": "not found"}
            return queue.pop(0) if len(queue) > 1 else queue[0]

    def _make_handler(self):
        stub = self

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                stub.requests.append(
                    {"path": self.path, "headers": {k.lower(): v for k, v in self.headers.items()}}
                )
                status, body = stub._next_response(self.path)
                if isinstance(body, str):
                    payload, content_type = body.encode(), "text/html; charset=utf-8"
                else:
                    payload = json.dumps(body, separators=(",", ":")).encode()
                    content_type = "application/json; charset=utf-8"
                self.send_response(status)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)

            def log_message(self, *args):
                pass  # keep test output quiet

        return Handler


@pytest.fixture
def stub():
    server = StubSoombook()
    server.start()
    yield server
    server.stop()


@pytest.fixture
def unused_port():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


@pytest.fixture
def run_smoke():
    """Runs the smoke test with fast settings: one attempt per check and a 5-second timeout."""
    if not shutil.which("bash") or not shutil.which("curl"):
        pytest.skip("the smoke test needs bash and curl")

    def run(*args, env=None):
        full_env = {**os.environ, "RETRIES": "1", "TIMEOUT": "5", "SLOW_SECONDS": "3"}
        full_env.pop("SOOMBOOK_URL", None)
        full_env.update(env or {})
        return subprocess.run(
            ["bash", str(SMOKE_TEST), *args],
            env=full_env,
            capture_output=True,
            text=True,
            timeout=60,
        )

    return run
