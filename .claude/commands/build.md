# /build — Incremental Feature Development
#
# USAGE:
#   /build employee listing screen with form
#   /build dashboard with charts and KPIs
#   /build --step 2 | --skip tests | --auto

## OVERVIEW
Breaks features into 5 steps with approval gates.
Steps: PLAN → BACKEND → FRONTEND → TESTS → REVIEW

## CRITICAL RULES
- NEVER skip step 1 (plan always first)
- After each step: show summary + ask "Continue to Step X?"
- User says no → STOP immediately, ask what to change
- Max 3 files per step, max 2000 tokens
- Follow CLAUDE.md and .claude/rules/
- If step fails → STOP entire pipeline, report error, ask how to proceed
- NEVER skip steps without explicit user permission
- User must confirm BEFORE each step starts

## STEP 1 — DETECT & PLAN

**Architecture Detection:**
- Read CLAUDE.md — detect project type (fullstack/API-only/frontend-only/mobile)
- Check what layers exist (frontend? backend? tests?)
- Use actual folder structure and naming conventions from project

**Adaptive Planning:**
- If API-only → plan backend steps only, skip frontend
- If frontend-only → plan UI steps only, skip backend
- If no tests → skip test step but WARN user
- If mobile → adapt component patterns for platform

MANDATORY: Show EXACT files before proceeding.

Output:
```
── Step 1 of 5: PLAN ──
Feature: [Name]
Backend:  [ ] models/X.js [ ] routes/x.js [ ] validators/xValidator.js
Frontend: [ ] hooks/useX.js [ ] components/XList.jsx [ ] XForm.jsx
Tests:    [ ] tests/api/x.test.js [ ] tests/XList.test.jsx
Estimated: [X] files to be created

⚠️  Files listed above will be created in Step 2-4
── Complete ── Approve to continue to Step 2? (y/n)
```

## STEP 2 — BACKEND (if project has backend)
Create model + validation + API routes. Follow .claude/rules/api.md.
If project is frontend-only → skip to Step 3.
If step fails → STOP, report error, ask how to proceed.

## STEP 3 — FRONTEND (if project has frontend)
Create hook + components. Follow .claude/rules/frontend.md.
If project is API-only → skip to Step 4.
If step fails → STOP, report error, ask how to proceed.

## STEP 4 — TESTS (if project has test framework)
Backend: API tests (200/400/401/404/409)
Frontend: Component tests (render/events/states)
If no test framework detected → WARN user and skip.
If step fails → STOP, report error, ask how to proceed.

## STEP 5 — REVIEW
Security: validation, auth, authorization, SQL injection, secrets
Performance: indexes, pagination, field selection
Accessibility: labels, ARIA, keyboard

Output:
```
── Step 5 of 5: REVIEW ──
Security: ✓ validation ✓ auth ✓ no secrets
Performance: ✓ indexes ✓ pagination
Accessibility: ✓ labels ✓ ARIA ✓ keyboard
── Complete ── Total: 10 files | Ready to commit
```

## FLAGS
--step N      Continue from step N
--skip tests  Skip test step
--auto        Auto-approve all
