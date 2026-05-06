# Skill: Context Loader

## Auto-loads when Claude detects:
- "fix", "bug", "broken", "error", "issue"
- "create", "add", "build", "new", "implement"
- "review", "check", "audit", "analyze"
- "refactor", "clean", "improve", "extract"
- "test", "tests", "testing", "coverage"

## Core Principle

**Load minimal context. Read only what's needed for THIS task.**

Never read entire folders — read specific files only.

## Smart Loading Rules

| Type | Max Files | Load | Budget |
|------|-----------|------|--------|
| **Bug Fix** | 3 | Affected file + imports (depth 1) + test | 500-1,500 |
| **Feature** | 6 | 1 similar feature + shared components + API/test examples | 1,000-2,500 |
| **Review** | 5 | Requested files + relevant .claude/rules | 500-1,800 |
| **Refactor** | 4 | Target file + importers + direct imports | 800-2,000 |
| **Testing** | 3 | File to test + 1 example test | 400-1,200 |

**Rules:**
- Load depth-1 imports only (skip depth-2+)
- Never load full directories
- Skip all unrelated components/screens/tests
- Start minimal, load more only if needed

## Never Load (automatic exclusions)

```
❌ node_modules/
❌ .next/ .nuxt/ .expo/ .output/
❌ build/ dist/ out/
❌ coverage/
❌ vendor/ venv/ __pycache__/
❌ *.lock (package-lock, yarn.lock, pnpm-lock)
❌ *.min.js *.bundle.js
❌ .env .env.*
```

Also skip unless explicitly requested:
- Unrelated screens/pages
- Unrelated components
- All tests (load only for target file)
- All API routes (load only affected)
- Full directories (load specific files)
