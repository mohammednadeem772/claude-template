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

## STEP 1 — PLAN
Read CLAUDE.md, scan existing files, list ALL files to create/modify.

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

## STEP 2 — BACKEND
Create model + validation + API routes. Follow .claude/rules/api.md.

Output:
```
── Step 2 of 5: BACKEND ──
Created: ✓ models/Employee.js ✓ validators/employeeValidator.js ✓ routes/employees.js
API: GET/POST/PUT/DELETE /api/employees
── Complete ── Files: 3 | Next: Step 3 — FRONTEND | Continue? (y/n)
```

## STEP 3 — FRONTEND
Create hook + components. Follow .claude/rules/frontend.md.
Handle: loading/error/empty states, typed props, validation.

Output:
```
── Step 3 of 5: FRONTEND ──
Created: ✓ hooks/useEmployees.js ✓ EmployeeList.jsx ✓ EmployeeForm.jsx
Features: list + search + filters + pagination + form + validation
── Complete ── Files: 3 | Next: Step 4 — TESTS | Continue? (y/n)
```

## STEP 4 — TESTS
Backend: API tests (200/400/401/404/409)
Frontend: Component tests (render/events/states)
Follow .claude/rules/testing.md.

Output:
```
── Step 4 of 5: TESTS ──
Created: ✓ tests/api/employees.test.js (12) ✓ tests/EmployeeList.test.jsx (8)
Coverage: Backend 15 tests, Frontend 8 tests | Run: npm test
── Complete ── Files: 2 | Next: Step 5 — REVIEW | Continue? (y/n)
```

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
