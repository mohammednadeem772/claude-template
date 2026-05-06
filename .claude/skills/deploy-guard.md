# Skill: Deploy Guard

## Auto-loads when:

- `/deploy`, `/ship`, `/release` commands invoked
- Keywords: "deploy", "ship", "release", "production", "staging", "publish", "go live"
- Before any deploy action (git push to deploy branch, vercel, railway, etc.)

## Core Behavior

Auto-run safety checks BEFORE every deploy. Block if any check fails.
Never allow broken code to production.

## Checks (run in parallel)

1. **Tests** — project test suite, fail if ANY test fails
2. **TypeScript** — `tsc --noEmit`, fail if type errors (skip if not TS)
3. **Security** — `npm audit --audit-level=high`, fail if critical/high vulns
4. **Environment** — parse `.env.example`, fail if vars missing from `.env`
5. **Build** — run build command, fail if build errors

## Block Rules

- Test failure → ❌ BLOCK
- TypeScript errors → ❌ BLOCK
- Build failure → ❌ BLOCK
- Missing env vars → ❌ BLOCK
- High/critical security → ❌ BLOCK
- `--skip-guard` flag → ⚠️ warn but allow (emergency only)

## Output

Pass:
```
── Pre-Deploy Checks ──
✅ Tests       ✅ TypeScript  ✅ Security
✅ Environment ✅ Build
─────────────────────
Proceeding with deploy...
```

Block:
```
── Pre-Deploy Checks ──
✅ Tests       ❌ TypeScript  ✅ Security
❌ Environment ✅ Build
─────────────────────
❌ DEPLOY BLOCKED
Fix 2 issues: TypeScript errors, missing JWT_SECRET
```

Override (--skip-guard):
```
⚠️  WARNING: Skipping deploy guard
   May deploy broken code. Emergency only.
   Type YES to confirm:
```

## Behavior Rules

❌ Don't announce skill activation (silent)
❌ Don't ask if user wants checks (always run)
❌ Don't allow deploy if checks fail (unless --skip-guard)
❌ Don't run checks after deploy (always before)

✅ Auto-run before every deploy
✅ Block immediately on failures
✅ Show clear pass/fail
✅ Emergency override with big warning
