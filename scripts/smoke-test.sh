#!/usr/bin/env bash
# Smoke test for a running Soombook site.
#
#   scripts/smoke-test.sh https://your-soombook-site.example
#   SOOMBOOK_URL=http://localhost:3000 scripts/smoke-test.sh
#
# Checks the health endpoint, the home page and that a protected API route
# rejects signed-out requests. Each check is retried a few times with a short
# backoff, so a single slow response doesn't fail the run. Exits 1 if any check
# fails, which makes it usable from cron, CI or a deploy script.

set -euo pipefail

BASE_URL="${1:-${SOOMBOOK_URL:-}}"
if [[ -z "$BASE_URL" ]]; then
  echo "usage: $0 <base-url>   (or set SOOMBOOK_URL)" >&2
  exit 2
fi
BASE_URL="${BASE_URL%/}"

RETRIES="${RETRIES:-3}"          # attempts per check
TIMEOUT="${TIMEOUT:-10}"         # seconds per request
SLOW_SECONDS="${SLOW_SECONDS:-3}" # warn when a passing check is slower than this

failures=0
body_file="$(mktemp)"
trap 'rm -f "$body_file"' EXIT

# check <name> <path> <expected status> [text the body must contain]
check() {
  local name="$1" path="$2" expected="$3" needle="${4:-}"
  local attempt=1 result status seconds

  while true; do
    # curl prints "000" as the status when it can't connect at all.
    result="$(curl --silent --show-error --output "$body_file" \
      --write-out '%{http_code} %{time_total}' --max-time "$TIMEOUT" \
      --header "X-Request-Id: smoke-test-$(date +%s)-$attempt" \
      "$BASE_URL$path" 2>/dev/null)" || true
    status="${result%% *}"
    seconds="${result##* }"
    [[ -n "$status" ]] || status="000"

    if [[ "$status" == "$expected" ]] && { [[ -z "$needle" ]] || grep -qF -- "$needle" "$body_file"; }; then
      printf 'PASS  %-12s %-22s %s in %ss\n' "$name" "$path" "$status" "$seconds"
      if awk -v s="$seconds" -v max="$SLOW_SECONDS" 'BEGIN { exit !(s > max) }'; then
        printf 'WARN  %-12s slower than %ss\n' "$name" "$SLOW_SECONDS"
      fi
      return 0
    fi

    if (( attempt >= RETRIES )); then
      printf 'FAIL  %-12s %-22s got %s, expected %s%s\n' "$name" "$path" "$status" "$expected" \
        "${needle:+ containing $needle}"
      failures=$((failures + 1))
      return 0
    fi

    sleep $((attempt * 2))
    attempt=$((attempt + 1))
  done
}

echo "Smoke testing $BASE_URL"
check "health" "/api/health" 200 '"status":"ok"'
check "home page" "/" 200
check "orders auth" "/api/getUserOrders" 401

if (( failures > 0 )); then
  echo "$failures check(s) failed"
  exit 1
fi
echo "All checks passed"
