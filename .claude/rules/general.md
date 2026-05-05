# General Rules
# Applies to: ALL files in the project

## Code Quality

### Functions
- One function = one job. If it does two things, split it.
- Maximum 40 lines per function
- Use descriptive names: `getUserById` not `getUser` or `g`
- No magic numbers: `const MAX_RETRIES = 3` not just `3`
- No commented-out code in committed files
- All public/exported functions must have a docstring or JSDoc

### Variables
- Descriptive names: `userEmail` not `e`, `isLoading` not `flag`
- `const` by default, `let` only when value changes, never `var`
- No abbreviations unless universal (id, url, db, api, auth)

### Imports
- Group: 1) external libs, 2) internal modules, 3) styles
- No unused imports
- Use absolute imports when project is configured for it

## Error Handling

- NEVER: `catch(e) {}` — empty catch blocks are forbidden
- ALWAYS log errors with context (what operation failed, with what input)
- User-facing error messages must be human-readable
- Never expose stack traces, internal paths, or DB errors to users
- Use custom error classes for different error types

```js
// Wrong
try { ... } catch(e) {}

// Correct
try { ... } catch(error) {
  logger.error('Failed to fetch user', { userId, error: error.message })
  throw new AppError('Could not load user profile', 404)
}
```

## Security

- Secrets ONLY in .env — never in code, comments, or logs
- Always validate AND sanitize user input before use
- Use parameterized queries — never string-concatenate SQL
- Check authentication before every protected operation
- Check authorization (ownership) before returning user data
- Sanitize file uploads: check type, size, and content

## Git Commit Messages

Format: `type(scope): short description`

Types:
- `feat`     — new feature
- `fix`      — bug fix
- `docs`     — documentation only
- `style`    — formatting, no logic change
- `refactor` — code restructure, no feature/fix
- `test`     — adding or fixing tests
- `chore`    — build process, dependencies

Examples:
```
feat(auth): add remember-me checkbox to login form
fix(api): handle null response from payment gateway
docs(readme): add deployment instructions
test(pricing): add edge case tests for discount calculation
```

## Testing

- New feature → write test before or immediately after
- Bug fix → write regression test that proves the fix
- Test file location: next to source file OR in tests/ folder
- Tests must be independent — no shared state between tests

## Pull Requests

- One logical change per PR
- PR title follows commit message format
- Describe: what changed, why, how to test it
- All tests must pass before merging
- No PR merges without code review
