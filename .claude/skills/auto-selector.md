# Skill: Auto-Selector

## Auto-loads: EVERY prompt (always active)

Silently detects task type and applies correct patterns — no announcement.

## Detection Keywords → Pattern Activation

| Keywords | Activate Pattern |
|----------|------------------|
| `fix`, `bug`, `error`, `broken`, `not working`, `issue`, `crash` | **Fix patterns** — trace flow, find root cause, read before fixing |
| `create`, `build`, `add`, `new`, `screen`, `module` | **Feature patterns** — read similar files first, match conventions |
| `review`, `check`, `audit`, `quality` | **Review patterns** — check rules, find issues, suggest improvements |
| `test`, `tests`, `coverage`, `spec` | **Test patterns** — read target file, find test example, write test |
| `refactor`, `clean`, `improve`, `split`, `simplify`, `too big` | **Refactor patterns** — preserve behavior, improve structure |
| `deploy`, `ship`, `release`, `staging`, `production` | **Deploy patterns** — verify tests, build, deploy safely |
| `docs`, `document`, `readme`, `api docs` | **Document patterns** — generate clear, accurate docs |
| `optimize`, `compress`, `tokens`, `too long` | **Optimize patterns** — compress without losing meaning |
| `context`, `load`, `clear context` | **Context patterns** — load minimal, specific files only |
| `bootstrap`, `scaffold`, `setup`, `generate` | **Bootstrap patterns** — scaffold following project conventions |

## Behavior Rules

### When task is CLEAR (single pattern matches):
- Silently apply the pattern
- No announcement ("Detected X", "Activating Y")
- Just do it

### When task is AMBIGUOUS (multiple patterns match):
- Ask ONE clarifying question only
- Provide 2-3 options
- Example:
  ```
  Did you mean:
    1. Fix existing test (fix pattern)
    2. Write new test (test pattern)
  ```

### When NO pattern matches:
- Treat as general request
- No pattern activation
- Answer normally

## Pattern Applications (apply silently)

**Fix:** Read affected file + imports + test → trace flow → find exact line → fix root cause
**Feature:** Read CLAUDE.md + similar files → match conventions → create + test
**Review:** Read .claude/rules → check security/validation → flag issues with line numbers
**Test:** Read target + example test → cover happy path + edges + errors
**Refactor:** Read target + imports/importers → preserve behavior → improve structure

## Priority When Multiple Keywords Present

1. Most specific wins: `deploy` → deploy, `test` → test
2. Action context: `fix` + `error` → fix
3. Creation context: `create` + `test` → test (write new test)
4. Ambiguous → ask user

## What NOT to Do

❌ Don't announce pattern activation
❌ Don't ask confirmation if task is clear
❌ Don't explain which pattern you're using
❌ Don't load unnecessary context
❌ Don't apply multiple patterns simultaneously

✅ Silently apply correct pattern
✅ Ask only when truly ambiguous
✅ Load minimal context for detected task type
✅ Follow activated pattern's specific rules
