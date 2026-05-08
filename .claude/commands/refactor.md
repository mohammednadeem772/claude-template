# /refactor — Clean Up and Improve Existing Code

## Usage

```bash
/refactor employee list component is too big, split it
/refactor useEmployees hook — too many responsibilities
/refactor api/orders.js — duplicate code everywhere
```

## GOLDEN RULES

1. **BEHAVIOR MUST NOT CHANGE** — tests must still pass after refactor
2. One refactor type at a time — don't mix types
3. Read WHOLE file before refactoring
4. If tests exist, run them before AND after
5. Explain every structural change

## REFACTOR TYPES

**TYPE 1 — Split Large File**

Trigger: "too big", "split", "500+ lines"

Rules:
- Component > 200 lines → split into sub-components
- Hook doing > 2 things → split into focused hooks
- File doing > 1 concern → split by responsibility

**TYPE 2 — Extract Repeated Code (DRY)**

Trigger: "duplicate", "repeated", "same code everywhere"

Extract to shared utility/validator/helper

**TYPE 3 — Improve Readability**

Trigger: "confusing", "hard to understand", "cleanup"

Use descriptive names, split complex expressions

**TYPE 4 — Fix Re-render Performance**

Trigger: "slow", "re-renders", "laggy"

Use `useCallback`, `useMemo` for stable references

**TYPE 5 — Separate Concerns**

Trigger: "logic in component", "mixed concerns"

Move API calls + business logic to hooks, keep UI in components

**TYPE 6 — Add TypeScript Types**

Trigger: "add types", "TypeScript", "type safety"

Add interfaces for props, functions, API responses

## OUTPUT FORMAT

```
Refactor: [what was done]
Type: [Split/DRY/Readability/Performance/Separation/Types]

Changes:
  📝 Modified: src/components/EmployeeList.jsx
  ✅ Created: src/components/EmployeeTable.jsx
  ✅ Created: src/hooks/useEmployees.js

What changed and why:
  1. Extracted API logic into useEmployees hook
     → Component was 380 lines, now 90
  2. Split table into EmployeeTable
     → Reusable on other pages
  3. Split filters into EmployeeFilters
     → Single responsibility

Behavior: unchanged — all functionality preserved
Tests: run [test command] to verify
```

## STRICT RULES

- Never change behavior
- Never modify code unrelated to refactor
- Show clear before/after if renaming
- Run tests before declaring complete
