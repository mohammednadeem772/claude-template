# Skill: Debugging Patterns

## Auto-loads when Claude detects:
- "/fix" command | "not working" | "broken" | "bug" | "issue" | "error"

## The Debugging Mindset

```
1. READ COMPLETE file before fixing — not just snippets
2. TRACE full flow — don't jump to assumptions
3. Find EXACT line — not general area
4. Fix ROOT CAUSE — never fix symptoms only
5. Show BEFORE/AFTER diff for every fix
6. Add PREVENTION note (test suggestion) after every fix
```

## Universal Data Flow to Trace

```
User action → State update → useEffect triggered → API call → Server receives →
Validation → DB query → Response → FE receives → State set → UI re-render
```

## Quick Lookup — Common Errors

| Symptom | Most Likely Cause |
|---------|-------------------|
| Pagination shows same data on page 2 | offset = page * limit instead of (page-1) * limit |
| Filter change has no effect | useEffect missing filter in dependency array |
| Form submit does nothing | onSubmit on button not form, or e.preventDefault() missing |
| API returns 500 | missing await, null access, missing env var |
| Data doesn't refresh after save | fetchData() not called in onClose/onSuccess |
| React Native list not scrolling | FlatList inside ScrollView |
| Flutter state not updating | missing notifyListeners() |
| TypeScript "possibly null" | missing null check before property access |
| 401 on protected route | auth token not sent in request headers |
| 403 on own resource | ownership check using wrong field (userId vs _id) |

## Fix Output Template (MANDATORY format)

Always show complete before/after diff:

```
Bug: [name]
Root cause: [one sentence — WHY it was broken]

Files changed:
  📝 file.js line 34

─── BEFORE (broken) ────────────────────
[exact wrong code — show complete function/block]

─── AFTER (fixed) ──────────────────────
[exact corrected code — show complete function/block]

─── WHY ────────────────────────────────
[one paragraph explaining root cause and why fix works]

─── TEST ───────────────────────────────
[manual verification steps + test code if needed]

─── PREVENTION (MANDATORY) ─────────────
[how to prevent this bug class in future]
```

## Critical Rules
- Always find root cause before fixing
- Never fix symptoms — fix the source
- Read affected file COMPLETELY before editing
- Show before/after diff for EVERY fix
- Add prevention note after EVERY fix
