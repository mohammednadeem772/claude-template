# /feature — Build a Complete Full-Stack Feature

## Usage
```
/feature create employee listing screen with form
/feature add appointment booking module with calendar
/feature build product inventory with search and filters
```

## STEP 0 — PLAN FIRST (MANDATORY)

Before creating a single file:

1. Read CLAUDE.md — understand stack, folder structure, naming conventions, test framework
2. Scan 2-3 existing similar files to match patterns
3. Detect platform from CLAUDE.md (web/mobile)
4. Print plan and WAIT for approval:

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

## STEP 1 — BACKEND
Model/Schema + Validation + API routes (list/get/create/update/delete) + Controller + Tests

## STEP 2 — FRONTEND
Custom hook (API + state) + List component (search/filter/pagination) + Form (create/edit + validation) + Required states (loading/error/empty/success)

## STEP 3 — TESTS
Backend: 200/201/400/401/404/409 cases
Frontend: render/loading/error/empty/interaction tests

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
