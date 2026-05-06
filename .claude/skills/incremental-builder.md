# Skill: Incremental Builder

## Auto-loads when:
- Large feature requests (3+ components: "list + form + API")
- Keywords: "full screen", "complete module", "entire feature", "full stack"
- Multiple parts: "with form", "with list", "with API", "with tests"
- User types `/build` command

## Core Behavior

Break large features into 5 steps with approval gates:
1. **PLAN** — list all files to create
2. **BACKEND** — model + API + validation
3. **FRONTEND** — components + hooks
4. **TESTS** — backend + frontend tests
5. **REVIEW** — security + performance

## STRICT Rules

- **NEVER skip step 1** — always show plan first, NEVER write code without approval
- After each step: pause and wait for user approval
- Max 3 files per step — batch if more needed
- Token budget: max 2000 tokens per step
- If step fails: stop, report error, ask how to proceed
- Follow CLAUDE.md and .claude/rules/ for all code

## Steps (always in order)

**Step 1: PLAN** — Read CLAUDE.md + scan similar files → list ALL files
```
── Step 1/5: PLAN ── Feature: [Name]
Backend:  [ ] models/X.js [ ] routes/x.js [ ] validators/xValidator.js
Frontend: [ ] hooks/useX.js [ ] XList.jsx [ ] XForm.jsx
Tests:    [ ] tests/api/x.test.js [ ] tests/XList.test.jsx
Total: [X] files | ── Done ── Next: Step 2 — Continue? (y/n)
```

**Step 2: BACKEND** — Model + validation + API (CRUD). Follow .claude/rules/api.md
```
── Step 2/5: BACKEND ──
Created: ✓ models/X.js ✓ validators/xValidator.js ✓ routes/x.js
API: GET/POST/PUT/DELETE /api/x | ── Done ── Next: Step 3 — Continue? (y/n)
```

**Step 3: FRONTEND** — Hook + components. Follow .claude/rules/frontend.md
Include: loading/error/empty states, typed props, validation
```
── Step 3/5: FRONTEND ──
Created: ✓ hooks/useX.js ✓ XList.jsx ✓ XForm.jsx
Features: list + search + pagination + form | ── Done ── Next: Step 4 — Continue? (y/n)
```

**Step 4: TESTS** — Backend: API tests (200/400/401/404/409) | Frontend: render/events/states
```
── Step 4/5: TESTS ──
Created: ✓ tests/api/x.test.js (12) ✓ tests/XList.test.jsx (8)
── Done ── Next: Step 5 — Continue? (y/n)
```

**Step 5: REVIEW** — Check: validation, auth, SQL injection, secrets, pagination, accessibility
```
── Step 5/5: REVIEW ──
Security: ✓ validation ✓ auth | Performance: ✓ indexes ✓ pagination
── Done ── Feature complete: [X] files
```
