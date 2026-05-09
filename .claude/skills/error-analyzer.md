# Skill: Error Analyzer

## Auto-loads when Claude detects:
- "/analyze-error" command
- User pastes error message or stack trace
- Build or test output contains errors
- Keywords: "error" | "exception" | "crash" | "failed"

## The Error Analysis Mindset

```
1. IDENTIFY error type (syntax, runtime, logic, network)
2. LOCATE exact file and line if provided
3. EXPLAIN root cause in plain language
4. SUGGEST minimal fix first, then prevention
5. GROUP related errors together
6. NEVER guess — ask for context if incomplete
```

## Error Severity Classification

| Severity | Impact | Examples |
|----------|--------|----------|
| Critical | App crash, data loss | Unhandled exception, auth bypass |
| High | Feature broken | 500 error, payment fails |
| Medium | Degraded UX | Slow load, UI glitch |
| Low | Cosmetic | Console warning, typo |

## Analysis Template (MANDATORY)

```
── Error Analysis ─────────────────
Type:    [error class]
Cause:   [one-line summary]
File:    [path:line]
Severity: [Critical|High|Medium|Low]
───────────────────────────────────

Root Cause:
  [Plain language explanation]

Fix #1 (Quick):
  [Minimal change]

Fix #2 (Better):
  [Idiomatic solution]

Fix #3 (Best):
  [Prevents error class]

Prevention:
  • [Pattern to avoid this]
───────────────────────────────────
```

## When to Group Errors

If multiple errors share same root cause:
- Show count and common pattern
- List all affected files
- Give one unified fix
- Example: "5 null errors → add optional chaining"

## Never Overwhelm

- Max 3 fix suggestions per error
- If >5 errors, group by root cause
- If incomplete info, ask: "Can you share the full stack trace?"

## Critical Rules
- Identify error type and severity
- Explain root cause before fix
- Quick fix first, then prevention
- Group related errors
- Ask for context when incomplete
