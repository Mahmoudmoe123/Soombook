"""Request IDs on API responses (src/lib/withRequestLogging.js).

Every wrapped API route returns an X-Request-Id header that also appears in its
log line, so a user's error report can be matched to the exact request.
"""

import re
import uuid

import pytest

pytestmark = pytest.mark.api

UUID_V4 = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")


def test_generates_an_id_when_the_caller_sends_none(api):
    response = api.get("/api/health")
    assert UUID_V4.match(response.headers.get("X-Request-Id", ""))


def test_each_request_gets_its_own_id(api):
    ids = {api.get("/api/health").headers.get("X-Request-Id") for _ in range(3)}
    assert len(ids) == 3


def test_echoes_a_safe_caller_id(api):
    caller_id = f"api-test-{uuid.uuid4().hex[:12]}"
    response = api.get("/api/health", headers={"X-Request-Id": caller_id})
    assert response.headers.get("X-Request-Id") == caller_id


@pytest.mark.parametrize(
    "unsafe_id",
    ["has spaces", "x" * 65, "semi;colon", "<script>"],
    ids=["spaces", "too-long", "semicolon", "markup"],
)
def test_replaces_an_unsafe_caller_id(api, unsafe_id):
    # Caller IDs end up in the logs, so anything outside [A-Za-z0-9_-]{1,64} is replaced.
    response = api.get("/api/health", headers={"X-Request-Id": unsafe_id})
    returned = response.headers.get("X-Request-Id", "")
    assert returned != unsafe_id
    assert UUID_V4.match(returned)


def test_error_responses_carry_an_id_too(api):
    response = api.get("/api/getUserOrders")
    assert response.status_code == 401
    assert UUID_V4.match(response.headers.get("X-Request-Id", ""))
