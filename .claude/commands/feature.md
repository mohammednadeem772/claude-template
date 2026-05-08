# /feature — Build a Complete Full-Stack Feature

## Usage
```
/feature create employee listing screen with form
/feature add appointment booking module with calendar
/feature build product inventory with search and filters
```

## STEP 0 — DETECT ARCHITECTURE & PLAN (MANDATORY)

Before creating a single file:

1. **Read CLAUDE.md** — detect project architecture:
   - Has frontend? (React/Vue/mobile) → plan UI components
   - Has backend? (API/server) → plan endpoints
   - Has both? → plan full-stack
   - API-only? → skip frontend steps
   - Frontend-only? → skip backend steps
   - Test framework? → plan tests accordingly

2. **Scan existing files** — match patterns from similar features in THIS project

3. **Adapt plan** based on what exists — use actual folder structure and naming from CLAUDE.md

4. **Print adaptive plan** and WAIT for approval:

```
Feature Plan: [Feature Name]
─────────────────────────────
Backend files:
  [ ] models/Employee.js
  [ ] routes/employees.js
  [ ] validators/employeeValidator.js
  [ ] tests/api/employees.test.js

Frontend files:
  [ ] pages/employees/index.jsx
  [ ] components/EmployeeList.jsx
  [ ] components/EmployeeForm.jsx
  [ ] hooks/useEmployees.js
  [ ] tests/components/EmployeeList.test.jsx

Config updates:
  [ ] routes/index.js (add employee route)
─────────────────────────────

⚠️  APPROVAL REQUIRED — Proceed? (y/n)
```

## MANDATORY RULES
- Plan first — show EXACT file list before coding
- Wait for user approval — NO exceptions
- Max 400 lines per file — split if larger
- Loading + Error + Empty states — mandatory in ALL data components
- Test file required — for EVERY new file created

## ADAPTIVE EXECUTION

**If project has BACKEND:**
- Model/Schema + Validation + API routes + Controller + Tests

**If project has FRONTEND:**
- Custom hook (API + state) + List component + Form + Required states (loading/error/empty/success)

**If project has TESTS:**
- Backend: 200/201/400/401/404/409 cases
- Frontend: render/loading/error/empty/interaction tests

**If step fails:**
- STOP immediately
- Report exact error
- Ask user how to proceed
- Never assume next step will work

## COMPLETION SUMMARY

Always show:
```
✅ Feature complete: [Feature Name]

Backend:
  ✅ Model/Schema
  ✅ Validation
  ✅ CRUD API endpoints (5 routes)
  ✅ Auth + authorization
  ✅ Backend tests

Frontend:
  ✅ Custom hook (API + state)
  ✅ List screen with search, filter, pagination
  ✅ Create/Edit form with validation
  ✅ Loading/Error/Empty states
  ✅ Frontend tests

Run now:
  [dev server command]
  [test command]
```
