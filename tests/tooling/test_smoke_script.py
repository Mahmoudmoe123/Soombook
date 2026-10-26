"""Tests for scripts/smoke-test.sh, the script the hourly uptime check runs.

Each test points the script at a stub server set up to look healthy, broken or
flaky, then checks the script's report and exit code: 0 when every check passes,
1 when any check fails, and 2 when no site address is given.
"""

import re

DEGRADED = (503, {"status": "degraded", "checks": {"database": "unreachable"}})
OK = (200, {"status": "ok", "checks": {"database": "ok"}})


def test_passes_against_a_healthy_site(stub, run_smoke):
    stub.healthy()
    result = run_smoke(stub.url)
    assert result.returncode == 0, result.stdout + result.stderr
    assert result.stdout.count("PASS") == 3
    assert "All checks passed" in result.stdout


def test_fails_when_the_database_is_down(stub, run_smoke):
    stub.healthy()
    stub.respond("/api/health", DEGRADED)
    result = run_smoke(stub.url)
    assert result.returncode == 1
    assert "FAIL  health" in result.stdout
    assert "1 check(s) failed" in result.stdout


def test_fails_when_health_returns_200_with_the_wrong_body(stub, run_smoke):
    stub.healthy()
    stub.respond("/api/health", (200, {"status": "degraded"}))
    result = run_smoke(stub.url)
    assert result.returncode == 1
    assert 'containing "status":"ok"' in result.stdout


def test_catches_the_orders_api_500_regression(stub, run_smoke):
    # The bug in docs/postmortems/2026-10-14-orders-api-500.md: signed-out requests got a 500.
    stub.healthy()
    stub.respond("/api/getUserOrders", (500, {"error": "Something went wrong. Please try again."}))
    result = run_smoke(stub.url)
    assert result.returncode == 1
    assert "FAIL  orders auth" in result.stdout
    assert "got 500, expected 401" in result.stdout


def test_reports_every_failing_check(stub, run_smoke):
    stub.healthy()
    stub.respond("/api/health", DEGRADED)
    stub.respond("/", (502, "<html>Bad gateway</html>"))
    result = run_smoke(stub.url)
    assert result.returncode == 1
    assert "2 check(s) failed" in result.stdout


def test_retries_a_failing_check_before_giving_up(stub, run_smoke):
    stub.healthy()
    stub.respond("/api/health", DEGRADED)
    result = run_smoke(stub.url, env={"RETRIES": "2"})
    assert result.returncode == 1
    assert stub.hits("/api/health") == 2


def test_passes_when_a_retry_succeeds(stub, run_smoke):
    stub.healthy()
    stub.respond("/api/health", DEGRADED, OK)  # fails once, then recovers
    result = run_smoke(stub.url, env={"RETRIES": "2"})
    assert result.returncode == 0, result.stdout
    assert stub.hits("/api/health") == 2


def test_tags_each_request_with_a_request_id(stub, run_smoke):
    stub.healthy()
    run_smoke(stub.url)
    ids = [request["headers"].get("x-request-id", "") for request in stub.requests]
    assert len(ids) == 3
    assert all(re.fullmatch(r"smoke-test-\d+-1", request_id) for request_id in ids)


def test_accepts_a_trailing_slash_in_the_address(stub, run_smoke):
    stub.healthy()
    assert run_smoke(stub.url + "/").returncode == 0
    assert {request["path"] for request in stub.requests} == {"/api/health", "/", "/api/getUserOrders"}


def test_reads_the_address_from_soombook_url(stub, run_smoke):
    stub.healthy()
    assert run_smoke(env={"SOOMBOOK_URL": stub.url}).returncode == 0


def test_exits_2_with_usage_when_no_address_is_given(run_smoke):
    result = run_smoke()
    assert result.returncode == 2
    assert "usage:" in result.stderr


def test_fails_when_the_site_is_unreachable(run_smoke, unused_port):
    result = run_smoke(f"http://127.0.0.1:{unused_port}")
    assert result.returncode == 1
    assert "got 000" in result.stdout
