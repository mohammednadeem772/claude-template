# Skill: Debugging Patterns

## Auto-loads when Claude detects:
- "/fix" command
- "not working"
- "broken"
- "bug"
- "issue"
- "error"
- "not submitting / not loading / not updating"

## The Debugging Mindset

```
1. READ before you FIX
2. TRACE the full flow — don't jump to assumptions
3. Find the EXACT line — not the general area
4. Fix ROOT CAUSE — not the symptom
5. VERIFY with a test
```

## Universal Data Flow to Trace

```
User action
    ↓
Component state update  ← is state changing?
    ↓
useEffect / watch triggered  ← is this running?
    ↓
API call made  ← check Network tab
    ↓
Request reaches server  ← check server logs
    ↓
Input validation  ← is it passing?
    ↓
DB query executed  ← is query correct?
    ↓
Response returned  ← correct status? correct shape?
    ↓
FE receives response  ← is data being set in state?
    ↓
UI re-renders  ← is component reading correct state?
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

## Fix Output Template

Always use:
```
Bug: [name]
Root cause: [one sentence]

Before (broken):
  [exact wrong code]

After (fixed):
  [exact corrected code]

Why this works:
  [one paragraph]

Verify by:
  [manual test steps]

Prevent with:
  [suggested test case]
```
