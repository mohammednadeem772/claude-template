# /deploy — Deploy to Staging or Production

## Usage

```bash
/deploy staging             # Deploy to staging
/deploy production          # Deploy to production (requires YES confirmation)
/deploy --dry-run           # Show what would happen
/deploy --skip-tests        # Emergency only — skips test gate
```

## PIPELINE (runs in order)

### Step 1 — Git status check

Check for uncommitted changes. If found, warn and ask "Continue? (y/n)"

### Step 2 — Run tests (HARD BLOCK)

Auto-detect stack and run tests. If ANY test fails → STOP immediately.
`--skip-tests` bypasses (warn clearly: emergency only)

### Step 3 — Build

Auto-detect and run build command:
- Node: `npm run build`
- Python: `python manage.py collectstatic --noinput`
- Laravel: `php artisan config:cache && php artisan route:cache`

If build fails → STOP. Do NOT deploy broken build.

### Step 4 — Deploy

Configure ONE of these in CLAUDE.md:
- Git push: `git push origin main:staging`
- Vercel: `vercel --prod=false`
- Railway: `railway up --environment staging`
- Custom script: `bash scripts/deploy-staging.sh`

### Step 5 — Health check

```bash
STAGING_URL="https://staging.yourapp.com"
sleep 5
curl -s -o /dev/null -w "%{http_code}" "$STAGING_URL/health"
```

If status >= 200 and < 400 → ✅ pass, else → ❌ fail (offer rollback)

### Step 6 — Log deploy

```bash
mkdir -p .claude
echo "$(date) | $ENV | $(git rev-parse --short HEAD) | $(git log -1 --pretty=%s)" >> .claude/deploys.log
```

## PRODUCTION GATE

For `/deploy production`, show BEFORE running anything:

```
⚠️  PRODUCTION DEPLOY
    Branch:  [current branch]
    Commit:  [last commit message]
    Time:    [current time]

    Type YES to continue:
```

Only proceed if user types exactly `YES`.

## DEPLOY SUMMARY

Always show at end:

```
──────────────────────────────────
Deploy complete
  Environment:  staging
  Commit:       abc1234 — "fix: login validation"
  Tests:        42 passed
  Build:        18s
  Health:       ✅ 200 OK
  Log:          .claude/deploys.log updated
──────────────────────────────────
```

## SAFETY RULES (never override)

- Never deploy if tests fail
- Never deploy if build fails
- Always run health check after deploy
- Always log every deploy
- Production always needs YES confirmation
