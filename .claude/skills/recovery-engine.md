# Skill: Recovery Engine

## Auto-loads when

- Pipeline step fails
- Error detected in output
- `/build` or `/ship` step fails
- Keywords: "failed", "error", "blocked"
- Test suite exits with non-zero code

## Core Behavior

Capture pipeline state before failure.
Suggest `/retry` automatically.
Never lose completed work.
Track retry attempts per step (max 3).
Escalate if retry limit reached.

## Failure Detection

**Error Patterns:** Exit code non-zero, keywords "Error:", "Failed:", "FAIL", stack traces

**Capture:** Which step failed, error message, stack trace, last successful step

## State Preservation

```
✅ Step 1: Database schema
✅ Step 2: Backend API
❌ Step 3: Frontend UI (FAILED)
⏸  Step 4: Tests (PENDING)
```

Recovery preserves Steps 1-2, retries Step 3 only.

## Auto-Suggestion

```
❌ Step 3 failed: File size exceeded

→ /retry (fix and retry)
→ /retry --skip (skip to Step 4)
→ /retry --diagnose (analyze first)
```

## Silent Operation

Runs in background during pipelines.

Interrupts only for:

1. Failure detection
2. Auto-suggestion display
3. Retry limit reached (3 attempts)
4. Manual intervention required

## Retry Tracking

Per-step counter: Step 3: 3 retries ← MAX REACHED

After 3 retries → escalate to user.

## Recovery Options

1. **Retry with fix** — diagnose and retry
2. **Skip step** — continue to next
3. **Manual fix** — user handles it

## Rules

- Session-only (no file persistence)
- Capture state immediately on failure
- Never retry without diagnosis
- Max 3 attempts per step
- Preserve all completed work
- Auto-suggest /retry — never auto-execute
- Clear retry count on pipeline restart
