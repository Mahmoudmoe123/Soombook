"""Contract tests for the health check, GET /api/health (src/pages/api/health.js).

Uptime monitors, Docker's HEALTHCHECK and the smoke test all depend on this
endpoint, so its status codes, fields and headers are treated as a contract.
"""

import re

import pytest

pytestmark = pytest.mark.api

ISO_TIMESTAMP = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$")
FIELDS = {"status", "checks", "version", "uptimeSeconds", "responseTimeMs", "timestamp"}


@pytest.fixture(scope="module")
def health(api):
    return api.get("/api/health")


def test_site_is_healthy(health):
    # The monitoring check itself: the app is up and can reach PostgreSQL.
    assert health.status_code == 200, f"health check returned {health.status_code}: {health.text[:200]}"
    body = health.json()
    assert body["status"] == "ok"
    assert body["checks"] == {"database": "ok"}


def test_response_has_the_documented_fields(health):
    # Holds for 200 and 503 alike, so dashboards can always parse the response.
    assert health.status_code in (200, 503)
    assert health.headers["Content-Type"].startswith("application/json")
    body = health.json()
    assert set(body) == FIELDS
    assert body["status"] in ("ok", "degraded")
    assert body["checks"]["database"] in ("ok", "unreachable")
    assert isinstance(body["version"], str) and body["version"]
    assert isinstance(body["uptimeSeconds"], int) and body["uptimeSeconds"] >= 0
    assert isinstance(body["responseTimeMs"], int) and body["responseTimeMs"] >= 0
    assert ISO_TIMESTAMP.match(body["timestamp"]), body["timestamp"]


def test_status_field_matches_http_status(health):
    expected = "ok" if health.status_code == 200 else "degraded"
    assert health.json()["status"] == expected


def test_database_check_finishes_within_its_timeout(health):
    # The database query is capped at 2 seconds, so a hung connection can't stall monitors.
    assert health.json()["responseTimeMs"] < 3000


def test_response_is_never_cached(health):
    assert "no-store" in health.headers.get("Cache-Control", "")


def test_head_request_works_without_a_body(api):
    response = api.head("/api/health")
    assert response.status_code in (200, 503)
    assert response.content == b""


@pytest.mark.parametrize("method", ["POST", "PUT", "DELETE"])
def test_other_methods_are_rejected(api, method):
    response = api.request(method, "/api/health")
    assert response.status_code == 405
    assert response.headers.get("Allow") == "GET, HEAD"
    assert response.json() == {"error": "Method not allowed"}
