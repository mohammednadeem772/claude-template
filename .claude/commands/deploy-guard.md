# /guard — Pre-Deploy Safety Gate

## Usage
```
/guard          # Run all checks
/guard --strict # Fail on warnings
/guard --quick  # Skip full build
```

## Checks (run in parallel)

**1. Tests** — `npm test || pytest || php artisan test || go test ./...`
- Pass: All tests pass
- Fail: Any test fails → ❌ BLOCKED

**2. TypeScript** — `npx tsc --noEmit` (skip if not TS project)
- Pass: No type errors
- Fail: Type errors → ❌ BLOCKED

**3. Security** — `npm audit --audit-level=high || pip-audit || safety check`
- Pass: No high/critical vulnerabilities
- Fail: Critical vulnerabilities → ❌ BLOCKED
- Warn: Moderate → ⚠️ PASS (fail on --strict)

**4. Environment** — Parse `.env.example`, check all vars exist in `.env`
- Pass: All required vars present
- Fail: Missing vars → ❌ BLOCKED

**5. Build** — `npm run build` (or `--dry-run` with --quick)
- Pass: Build succeeds
- Fail: Build fails → ❌ BLOCKED

**6. Linting** — `npm run lint || eslint . || ruff check . || rubocop`
- Pass: No errors (warnings OK)
- Warn: Errors → ⚠️ PASS (fail on --strict)

## Output

All pass:
```
✅ Deploy Guard: PASS
  ✅ Tests          42 passed
  ✅ TypeScript     No errors
  ✅ Security       No vulnerabilities
  ✅ Environment    12/12 vars
  ✅ Build          Success
  ✅ Linting        No errors
  Safe to deploy.
```

Blocked:
```
❌ Deploy Guard: BLOCKED
  ✅ Tests          42 passed
  ❌ TypeScript     3 errors (users.ts:45, login.ts:12)
  ❌ Environment    Missing: JWT_SECRET, STRIPE_KEY
  ✅ Security       No vulnerabilities
  ✅ Build          Success
  Fix 2 critical issues before deploying.
```

Warnings (pass unless --strict):
```
⚠️  Deploy Guard: PASS (warnings)
  ✅ Tests          42 passed
  ⚠️  Security      2 moderate vulnerabilities
  ⚠️  Linting       4 warnings
  Safe to deploy. Run --strict to block.
```

## Rules
- Tests fail → always block
- Build fail → always block
- TypeScript errors → always block
- Missing env vars → always block
- Security/linting warnings → block only with --strict
