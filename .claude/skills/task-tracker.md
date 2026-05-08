# Skill: Task Tracker

## Auto-loads when:
- `/task` command used
- Keywords: "add task", "track this", "todo"
- Pipelines: `/build`, `/ship`, `/feature`
- Bug detection: `/fix` finds issue

## Core Behavior

Maintain task list in session memory.
Auto-suggest `/task add` when work item detected.
Show pending tasks at session start/end.

## Task Detection

**Explicit:**
- "add task to fix X"
- "track this bug"
- "todo: refactor Z"

**Implicit:**
- `/fix` identifies bug
- `/review` finds critical issues
- User says "later" or "after this"

## Auto-Suggestion

When work item found:
```
Found: [description]
→ /task add "[description]"  (y/n)
```

## Session Integration

**Start:**
```
── Pending Tasks ──────────────
[2] ⏳ Write tests for auth
[5] ⏳ Update API docs
───────────────────────────────
Continue? (y/n)
```

**During:**
- `/build` → task per step
- `/ship` → task per agent
- `/fix` → task when bug found

**End:**
```
── Pending Tasks ──────────────
[3] ⏳ Fix login bug
───────────────────────────────
Complete before ending? (y/n)
```

## Silent Operation

Runs in background.
Interrupts only for:
1. Explicit `/task` use
2. Auto-suggestion
3. Session start/end with pending tasks

## Rules

- Session-only (no file persistence)
- Never add without user awareness
- Show summary after operations
- Max 60 chars per description
- Auto-number sequentially
- IDs never reuse
