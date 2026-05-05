# /deploy — Deploy to Staging or Production

## Usage
```
/deploy staging             # Deploy to staging
/deploy production          # Deploy to production (asks confirmation)
/deploy --dry-run           # Show what would happen, don't deploy
/deploy --skip-tests        # Emergency only — skips test gate
```

## Pipeline (runs in this exact order)

### Step 1 — Git status check
```bash
git status --short
```
If uncommitted changes exist: warn user, ask "Continue anyway? (y/n)"

### Step 2 — Run tests (HARD BLOCK)
Auto-detect stack and run tests.
If ANY test fails: STOP. Show failing tests. Do NOT continue.
`--skip-tests` flag bypasses this — warn user clearly.

### Step 3 — Build
Auto-detect and run build command:
```bash
# Node
npm run build

# Python
python manage.py collectstatic --noinput

# Laravel
php artisan config:cache && php artisan route:cache

# Custom — edit below:
# [YOUR BUILD COMMAND HERE]
```
If build fails: STOP. Show error. Do NOT deploy broken build.

### Step 4 — Deploy
```bash
# ── CONFIGURE ONE OF THESE ─────────────────
# Git push to staging branch:
# git push origin main:staging

# Vercel:
# vercel --prod=false

# Railway:
# railway up --environment staging

# Custom SSH:
# ssh user@staging.example.com "cd /app && git pull && pm2 restart all"

# Docker:
# docker build -t myapp:staging . && docker push registry/myapp:staging

# Custom script:
# bash scripts/deploy-staging.sh
# ───────────────────────────────────────────
```

### Step 5 — Health check
```bash
STAGING_URL="https://staging.yourapp.com"   # ← CHANGE THIS
sleep 5
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$STAGING_URL/health" 2>/dev/null \
  || curl -s -o /dev/null -w "%{http_code}" "$STAGING_URL" 2>/dev/null)

if [ "$STATUS" -ge 200 ] && [ "$STATUS" -lt 400 ]; then
  echo "✅ Health check passed ($STATUS)"
else
  echo "❌ Health check failed ($STATUS)"
  # Show rollback option
fi
```

### Step 6 — Log deploy
```bash
mkdir -p .claude
echo "$(date '+%Y-%m-%d %H:%M:%S') | $ENV | $(git rev-parse --short HEAD) | $(git log -1 --pretty=%s)" >> .claude/deploys.log
```

## Production Gate
For `/deploy production`, show this BEFORE running anything:
```
⚠️  PRODUCTION DEPLOY
    Branch:  [current branch]
    Commit:  [last commit message]
    Time:    [current time]

    Type YES to continue:
```
Only proceed if user types exactly `YES`.

## Deploy Summary (always show at end)
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

## Safety Rules (never override)
- Never deploy if tests fail
- Never deploy if build fails
- Always run health check after deploying
- Always log every deploy
- Production always needs YES confirmation
