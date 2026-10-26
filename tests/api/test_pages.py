"""The site serves its home page and returns real 404s for unknown addresses."""

import pytest

pytestmark = pytest.mark.api


def test_home_page_loads(api):
    response = api.get("/")
    assert response.status_code == 200
    assert response.headers["Content-Type"].startswith("text/html")
    assert "<html" in response.text.lower()


@pytest.mark.parametrize("path", ["/this-page-does-not-exist", "/api/this-route-does-not-exist"])
def test_unknown_addresses_return_404(api, path):
    assert api.get(path).status_code == 404
