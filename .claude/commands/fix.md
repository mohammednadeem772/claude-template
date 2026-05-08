# /fix — Find Root Cause and Fix Any Bug

## Usage
```
/fix pagination not working on appointment screen
/fix login form not submitting
/fix API returning 500 on /api/orders
/fix search filter not updating results
```

## RULE #1 — NEVER GUESS. ALWAYS READ CODE FIRST

Before changing anything:
1. Read COMPLETE affected file — not just snippets
2. Trace full data flow (user action → state → API → DB → response → UI)
3. Find EXACT line that is wrong
4. Understand WHY it's wrong
5. Fix ROOT CAUSE — never fix symptoms only

## DEBUGGING PLAYBOOK

### Pagination Bug
Check:
1. FE: Page state changes when user clicks Next/Prev?
2. FE: useEffect re-runs when page changes? Check dependency array: `useEffect(() => {}, [page])`
3. FE: Page sent in API request? `?page=2&limit=20`
4. BE: Offset calculated correctly? `offset = (page - 1) * limit` NOT `page * limit`
5. BE: Total count returned?
6. FE: TotalPages calculated? `Math.ceil(total / limit)`

### Form Not Submitting
Check:
1. onSubmit on `<form>` element? NOT on button
2. `e.preventDefault()` called first?
3. Validation blocking silently?
4. Loading state stuck from previous error?
5. Auth token in request headers?

### API 500 Error
Check server logs for:
1. Null/undefined access: `user.profile.name` when user is null
2. Missing await: `const user = User.findById(id)` without await
3. Missing env variable
4. DB connection failed

### Filter/Search Not Working
Check:
1. FE: Filter state updates in onChange?
2. FE: useEffect includes filter in deps? `useEffect(() => {}, [search, department])`
3. FE: Filter sent in API params?
4. BE: Filter applied only when value exists?

### Data Not Refreshing After Save/Delete
Fix: Call `fetchData()` in form's onClose/onSuccess

## OUTPUT FORMAT (MANDATORY)

```
Bug: [name]
Root cause: [one sentence — WHY it was broken]

Files changed:
  📝 file.js line 34

─── BEFORE (broken) ────────────────────
[exact wrong code]

─── AFTER (fixed) ──────────────────────
[exact corrected code]

─── WHY ────────────────────────────────
[explanation of root cause]

─── TEST ───────────────────────────────
[verification steps]

─── PREVENTION (MANDATORY) ─────────────
[how to prevent this bug class]
```

## CRITICAL RULES
- Always find root cause before fixing
- Never fix symptoms — fix the source
- Read affected file COMPLETELY
- Show before/after diff for EVERY fix
- Add prevention note after EVERY fix
