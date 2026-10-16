# Soombook runbook

What to check, in order, when Soombook seems broken.

## 1. Is it up?

```bash
curl -s https://YOUR-SITE/api/health
```

A healthy app answers `200` with:

```json
{ "status": "ok", "checks": { "database": "ok" }, "version": "a1b2c3d", "uptimeSeconds": 5321, "responseTimeMs": 12, "timestamp": "..." }
```

`503` with `"database": "unreachable"` means the app is running but can't reach PostgreSQL (section 3). No answer at all means the deployment itself is down.

For a fuller check, run the smoke test. It checks the health endpoint, the home page, and that the orders API rejects signed-out requests:

```bash
scripts/smoke-test.sh https://YOUR-SITE
```

The **Uptime check** workflow in GitHub Actions runs the same script every hour once the `SOOMBOOK_URL` repository variable is set. Its run history shows when the site went down, and GitHub emails a notice when a run fails.

## 2. Read the logs

API routes write one JSON line per request (Vercel: project → **Logs**):

```json
{"time":"...","level":"info","msg":"request finished","route":"/api/getUserOrders","method":"GET","status":401,"durationMs":38,"requestId":"..."}
```

- Every response carries an `X-Request-Id` header, and a 500 response includes the `requestId` in its body. Search the logs for that ID to find the exact failing request.
- Errors are logged at level `error`, with the error's name and message (`request failed`, `could not create order`, `could not create trip`).
- Set `LOG_LEVEL` to `debug`, `info` (default), `warn` or `error` to change how much is written.

## 3. Common problems

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| `/api/health` returns 503, `database: unreachable` | Supabase project paused or down, wrong `DATABASE_URL`, or a password changed without updating the app | Check the Supabase dashboard and status page. Confirm `DATABASE_URL` and `DIRECT_URL` in Vercel match the current password, then redeploy. |
| Sign-in fails or loops back to the login page | `NEXTAUTH_SECRET` or `NEXTAUTH_URL` missing or wrong, or the Google OAuth redirect URI doesn't match the site | Check the env vars in Vercel and the authorized redirect URIs in Google Cloud Console. |
| Travelers accept orders but shoppers get no push notification | `FIREBASE_SERVICE_ACCOUNT_KEY` invalid or rotated | Create a new key for the service account and update the env var. |
| No "order accepted" emails | `SENDGRID_API_KEY` missing or the sender isn't verified | Check the key and sender verification in SendGrid. |
| Photo uploads fail | Supabase Storage keys or bucket policy | Check `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and the bucket's policies. |
| Vercel build fails before deploying | Unsupported Node.js version in the project settings, or a dependency problem | Set Node.js to 20.x or newer in Vercel → Settings, then read the build log. |

## 4. Roll back

If a deploy broke the site, roll back first and investigate after:

- **Vercel:** Deployments → the last good deployment → **Instant Rollback** (or **Promote to Production**).
- **Git:** `git revert <bad commit>` and push to `main`; Vercel redeploys automatically.

## 5. After an incident

Write a short post-incident review from [`docs/postmortems/TEMPLATE.md`](postmortems/TEMPLATE.md): what happened, the timeline, the root cause, and follow-up actions with owners. Link the pull request that fixed it. See [the orders API review](postmortems/2026-10-14-orders-api-500.md) for an example.
