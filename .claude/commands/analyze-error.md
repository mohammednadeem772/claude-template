# /analyze-error — Diagnose and Explain Errors with Fix Suggestions

## Usage
```
/analyze-error "TypeError: cannot read property of undefined"
/analyze-error --file error.log
/analyze-error --last              — analyze last error in session
/analyze-error --stack             — analyze full stack trace
```

## What It Does

1. Identifies error type and severity
2. Explains root cause in plain language
3. Suggests minimal fix first
4. Provides prevention pattern
5. Shows file and line number if available

## Output Format (MANDATORY)

```
── Error Analysis ─────────────────
Type:    TypeError
Cause:   Accessing property on undefined variable
File:    src/utils/parser.js:42
Severity: High
───────────────────────────────────

Root Cause:
  Variable 'user' is undefined before property access

Fix #1 (Quick):
  if (user && user.name) { console.log(user.name) }

Fix #2 (Better):
  console.log(user?.name)

Fix #3 (Best):
  const userName = user?.name ?? 'Guest'

Prevention:
  • Use TypeScript strict null checks
  • Use optional chaining for nested properties
───────────────────────────────────
```

## Rules

### Never Guess
- Only analyze what is provided
- If information missing, ask for stack trace
- Don't make assumptions about code structure

### Error Severity
- **Critical** — crashes app, data loss, security issue
- **High** — feature broken, user cannot proceed
- **Medium** — degraded UX, workaround exists
- **Low** — cosmetic issue, edge case

### Fix Suggestions
- Maximum 3 fixes per error
- Order: Quick → Better → Best
- Show code examples for each

### Group Related Errors
```
── 3 Similar TypeError Errors ─────
All caused by: Missing null checks

Files affected:
  • src/auth/login.js:23
  • src/profile/update.js:67

Common fix: Add optional chaining
```

## Common Error Patterns

### JavaScript/TypeScript
- `TypeError: Cannot read property 'x' of undefined` → null check needed
- `ReferenceError: x is not defined` → variable not declared
- `SyntaxError: Unexpected token` → missing bracket/comma
- `Promise rejection unhandled` → missing .catch()

### React
- `Maximum update depth exceeded` → setState in render loop
- `Cannot update component while rendering` → setState in wrong place
- `Hooks called conditionally` → hook inside if/loop

### API/Network
- `CORS error` → missing CORS headers on backend
- `401 Unauthorized` → missing auth token
- `500 Internal Server Error` → check server logs
- `Network request failed` → check endpoint URL
## Critical Rules
- Show error type, cause, and fix
- Suggest prevention pattern
- Never guess — only analyze what is given
- Max 3 fix suggestions per error
- Keep explanations concise
