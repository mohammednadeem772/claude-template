# /review — Smart Code Review

## Usage
```
/review                       # Review last modified files
/review src/auth/login.js     # Review specific file
/review src/api/              # Review entire folder
/review --security            # Security-focused review only
/review --performance         # Performance-focused review only
```

## What to Check
Go through every file provided and look for:

### 1. Bugs & Logic Errors
- Off-by-one errors
- Wrong conditionals (= vs ==, & vs &&)
- Null/undefined not handled
- Async errors not caught
- Race conditions

### 2. Security Issues
- SQL injection (string concat in queries)
- XSS (unsanitized user input in HTML)
- Hardcoded secrets or API keys
- Missing authentication checks
- Missing authorization (user can see other users' data)
- Insecure direct object references
- CORS misconfiguration

### 3. Performance Issues
- N+1 database queries
- Missing indexes on queried fields
- Unnecessary re-renders (React)
- Large bundle imports (import entire library vs one function)
- Missing pagination on list endpoints

### 4. Code Quality
- Functions doing more than one thing
- Functions longer than 40 lines
- Magic numbers (use named constants)
- Duplicated code (DRY violations)
- Poor variable names (x, data, temp, stuff)

### 5. Missing Error Handling
- API calls without try/catch
- Empty catch blocks
- No loading/error state in UI
- No validation of user input

### 6. Convention Violations
- Check against rules in CLAUDE.md
- Naming conventions
- File structure conventions

## Output Format

For each issue found:
```
📍 File: src/auth/login.js  Line: 42
🔴 CRITICAL | 🟡 WARNING | 🔵 SUGGESTION

Problem: [One sentence — what is wrong]

Current code:
[show the problematic code]

Fixed code:
[show the corrected code]
```

Group by severity. Critical first.

## Final Summary
```
Review complete
  Files reviewed: X
  🔴 Critical:    X
  🟡 Warnings:    X
  🔵 Suggestions: X
```

If nothing found: "✅ No issues found in reviewed files."
