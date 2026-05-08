# /task — Task Tracking System
#
# Track work during Claude Code sessions.
#
# USAGE:
#   /task add "description"      — add new task
#   /task list                   — show all tasks
#   /task done <id>              — mark complete
#   /task pending                — show pending only
#   /task clear                  — clear completed
#   /task note <id> "note"       — add note

## ─────────────────────────────────────────────────────────
## TASK STRUCTURE
## ─────────────────────────────────────────────────────────

Each task: id, status (⏳ pending / ✅ done), description, notes, timestamp
Storage: In-memory (session only)

## ─────────────────────────────────────────────────────────
## COMMANDS
## ─────────────────────────────────────────────────────────

### /task add "description"
```
Added: [3] ⏳ Fix login bug

── Tasks ──────────────────────
[1] ✅ Add pagination
[2] ⏳ Write tests for auth
[3] ⏳ Fix login bug
───────────────────────────────
Pending: 2  |  Done: 1
```

### /task list
Show all tasks (pending + done) with summary.

### /task done <id>
```
Done: [2] ✅ Write tests for auth

── Tasks ──────────────────────
[1] ✅ Add pagination
[2] ✅ Write tests for auth
[3] ⏳ Fix login bug
───────────────────────────────
Pending: 1  |  Done: 2
```

### /task pending
```
── Pending Tasks ──────────────
[2] ⏳ Write tests for auth
[3] ⏳ Fix login bug
───────────────────────────────
Pending: 2
```

### /task clear
Remove all completed tasks, show remaining.

### /task note <id> "note"
```
Added note to [3] Fix login bug

[3] ⏳ Fix login bug
    Note: Session timeout — check Redis config
```

## ─────────────────────────────────────────────────────────
## EMPTY STATE
## ─────────────────────────────────────────────────────────

When no tasks:
```
── Tasks ──────────────────────
No tasks yet.
Use: /task add "description"
───────────────────────────────
```

## ─────────────────────────────────────────────────────────
## INTEGRATION
## ─────────────────────────────────────────────────────────

/build  — auto-adds task per step
/ship   — tracks agent pipeline
/fix    — adds task when bug found

Always show summary after operations.
Auto-number tasks (1, 2, 3...).
IDs never reuse after clear.
