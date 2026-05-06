# /auto — Smart Task Detection & Routing
#
# Detects task type from plain language and routes to correct command.
#
# USAGE:
#   /auto fix pagination not working
#   /auto build employee listing screen
#   /auto check code quality
#   /auto write tests for UserCard
#   /auto clean up the api folder

## ─────────────────────────────────────────────────────────
## DETECTION RULES — keyword → command mapping
## ─────────────────────────────────────────────────────────

/fix       — `fix`, `bug`, `error`, `broken`, `not working`, `issue`, `crash`
/feature   — `create`, `build`, `add`, `new`, `banao`, `screen`, `module`
/review    — `review`, `check`, `audit`, `dekho`, `quality`
/test      — `test`, `tests`, `coverage`, `spec`
/refactor  — `refactor`, `clean`, `improve`, `split`, `simplify`, `too big`
/deploy    — `deploy`, `ship`, `release`, `staging`, `production`
/document  — `docs`, `document`, `readme`, `api docs`
/optimize  — `optimize`, `tokens`, `compress`, `too long`
/context   — `context`, `load`, `clear context`
/bootstrap — `bootstrap`, `scaffold`, `setup`, `initialize`, `generate`

## ─────────────────────────────────────────────────────────
## EXECUTION LOGIC
## ─────────────────────────────────────────────────────────

1. Read user input, convert to lowercase
2. Match keywords in priority order (exact → action → context)
3. Extract target: remove keyword, pass remainder to command
4. Display detection and execute:

```
Detected: /[command]
Reason: "[keyword]" found
Running: /[command] [target]
```

## ─────────────────────────────────────────────────────────
## PRIORITY RULES
## ─────────────────────────────────────────────────────────

Multiple keywords → prioritize by:
1. Most specific: "deploy" → /deploy, "test" → /test
2. "fix" + "error" → /fix
3. "create" + "test" → /test (test wins)
4. "build" alone → /feature

No match → ask user to clarify:
```
Unclear task. Did you mean:
  1. /feature — build something new
  2. /fix — fix an issue

Use keywords: create, fix, test, review, deploy
```
