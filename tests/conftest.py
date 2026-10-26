"""Shared fixtures for Soombook's Python test suite.

Two groups of tests live under tests/:

- tests/api: contract tests for a running Soombook, local or deployed. They read the
  site's address from --base-url or the SOOMBOOK_URL environment variable and are
  skipped when neither is set. They only send safe requests (GET, HEAD and requests
  the API rejects), so they can run against production.
- tests/tooling: tests for scripts/smoke-test.sh, run against a local stub server.
  They need bash and curl, but no running app, database or API keys.
"""

import os

import pytest
import requests

REQUEST_TIMEOUT_SECONDS = 15


def pytest_addoption(parser):
    parser.addoption(
        "--base-url",
        default=None,
        help="Soombook site for the API tests, such as http://localhost:3000 (defaults to $SOOMBOOK_URL)",
    )


class Api:
    """A small HTTP client that prefixes the site's base URL and always sets a timeout.

    Redirects are not followed, so a route that starts redirecting fails loudly
    instead of being tested through the page it redirects to.
    """

    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers["User-Agent"] = "soombook-api-tests"

    def request(self, method, path, **kwargs):
        kwargs.setdefault("timeout", REQUEST_TIMEOUT_SECONDS)
        kwargs.setdefault("allow_redirects", False)
        return self.session.request(method, self.base_url + path, **kwargs)

    def get(self, path, **kwargs):
        return self.request("GET", path, **kwargs)

    def head(self, path, **kwargs):
        return self.request("HEAD", path, **kwargs)

    def close(self):
        self.session.close()


@pytest.fixture(scope="session")
def base_url(request):
    url = request.config.getoption("--base-url") or os.environ.get("SOOMBOOK_URL", "")
    if not url:
        pytest.skip("API tests need a running site: pass --base-url or set SOOMBOOK_URL")
    return url.rstrip("/")


@pytest.fixture(scope="session")
def api(base_url):
    client = Api(base_url)
    yield client
    client.close()
