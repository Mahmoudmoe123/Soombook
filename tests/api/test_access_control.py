"""Signed-out requests and wrong HTTP methods are refused cleanly.

Every request here is either anonymous or uses a method the route rejects, so
nothing is created or changed when these tests run against production.
"""

import pytest

pytestmark = pytest.mark.api


@pytest.mark.parametrize("path", ["/api/getUserOrders", "/api/getUserProfileInfo"])
def test_signed_out_requests_get_401(api, path):
    # /api/getUserOrders used to crash with a 500 here; see
    # docs/postmortems/2026-10-14-orders-api-500.md.
    response = api.get(path)
    assert response.status_code == 401, f"{path} returned {response.status_code}: {response.text[:200]}"
    assert "error" in response.json()


def test_orders_api_explains_what_to_do(api):
    assert api.get("/api/getUserOrders").json() == {"error": "Sign in to see your orders."}


@pytest.mark.parametrize("path", ["/api/ordersapi", "/api/tripsapi", "/api/usersapi"])
def test_post_only_routes_reject_get(api, path):
    response = api.get(path)
    assert response.status_code == 405, f"{path} returned {response.status_code}"
    assert response.headers["Content-Type"].startswith("application/json")


def test_users_api_advertises_the_allowed_method(api):
    assert api.get("/api/usersapi").headers.get("Allow") == "POST"
