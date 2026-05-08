# /retry — Recover from Failed Steps and Resume Pipelines

## Usage

```bash
/retry                    — retry the last failed step
/retry last               — retry last command that failed
/retry step <n>           — retry specific step in pipeline
/retry --from <step>      — resume pipeline from specific step
/retry --skip             — skip failed step and continue
/retry --diagnose         — diagnose why step failed before retrying
```

## What It Does

- Detects what failed and why
- Retries only the failed step — not entire pipeline
- Preserves completed work before failure
- Shows recovery plan before executing
- Integrates with /build and /ship pipelines

## OUTPUT FORMAT

```
── Recovery Plan ──────────────────────
Failed step: Step 2 — Backend API
Reason: File exceeded 400 lines

Recovery options:
[1] Retry with fix applied
[2] Skip and continue to Step 3
[3] Restart from Step 2 only

Choose: (1/2/3)
───────────────────────────────────────

── Retrying Step 2 ────────────────────
✅ Split large file into modules
✅ Step 2 complete
Resuming from Step 3...
───────────────────────────────────────
```

## Common Failures

- File size > 400 lines
- Syntax error (missing bracket, import)
- Test failure / linting error / build error
- API error (500/404)
- Permission denied

## Pipeline Integration

Works with `/build`, `/ship`, `/fix`, `/feature`

```
✅ Step 1 — Database schema
✅ Step 2 — Backend API (partial)
❌ Step 3 — Frontend UI (failed)

/retry resumes from Step 3 only.
```

## CRITICAL RULES

1. **Never retry blindly** — always diagnose first
2. **Always show what failed** before retrying
3. **Preserve completed steps** — never restart full pipeline
4. **Max 3 retry attempts** per step
5. **Show recovery plan** before executing
6. **Auto-suggest /retry** when failure detected

## Error Escalation

After 3 failed attempts:

```
── Retry Limit Reached ────────────────
Step 3 failed 3 times.
Manual intervention needed.

[1] Review file manually
[2] Skip this step
[3] Cancel and rollback
```

## Examples

```
/build user profile feature
❌ Step 2: profile-api.js is 450 lines
/retry → Split into 3 files → ✅

/ship payment feature
❌ Step 4: 2 tests failed
/retry --diagnose → Add missing mock → ✅
```
