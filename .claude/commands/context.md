# /context — Smart Context Loading

## Usage

```
/context load [task]    # Load context for specific task
/context show           # Show current context
/context clear          # Clear unnecessary files
/context smart          # Auto-detect from last prompt
```

## Smart Loading Rules

CRITICAL: Max 5 files per task — no exceptions

**Bug Fix** → affected file + imports + test (500-1,500 tokens)

```
Fix pagination in EmployeeList.jsx
  ✅ src/components/EmployeeList.jsx
  ✅ src/hooks/useEmployees.js (if imported)
  ✅ src/api/employees.js (if API call exists)
  ✅ __tests__/EmployeeList.test.jsx
  ❌ SKIP: dependency folders, unrelated components
```

**New Feature** → 1 similar component + shared components + API/test examples (1,000-2,500 tokens)
  - Max 1 reference component (not 3-4)
  - NEVER load dependency folders
  - ALWAYS read CLAUDE.md before loading any file

**Review** → requested files + relevant .claude/rules (500-1,800 tokens)
  - Skip files not directly related to review scope

**Refactor** → target file + direct imports + importers (800-2,000 tokens)
  - Skip depth-2+ dependencies

**Testing** → file to test + 1 example test (400-1,200 tokens)
  - Load ONLY target file + one example test

## Never Load
```
node_modules, .next, build, dist, out, coverage, .git
vendor, venv, __pycache__, *.min.js, package-lock.json
.env, .env.*
All unrelated components/screens/tests/API routes
```

## Task Detection Keywords

- **Fix**: fix, bug, broken, error, issue, not working
- **Feature**: create, add, build, new, implement
- **Review**: review, check, audit, analyze, look at
- **Refactor**: refactor, clean, improve, extract
- **Test**: test, tests, testing, coverage

## Output Format

**Load**: `🔍 Type | 📂 Loading... ✅ files | ✨ Loaded: X files | ~X,XXX tokens | Saved: XX%`

**Show**: `📊 Files: X | Size: ~X,XXX | Total: ~XX,XXX | Available: ~XXX,XXX (XX% free) | 💡 Health`

**Clear**: `🧹 Current: X files | Keeping: X | Clearing: X | ✨ Cleared | Saved: XX%`

## Token Budget
```
Bug fix:     500-1,500    (1-4 files)
Feature:     1,000-2,500  (2-6 files + reference)
Review:      500-1,800    (1-5 files)
Refactor:    800-2,000    (1-4 files)
Testing:     400-1,200    (1-3 files)
```

## Rules

- Load depth-1 imports only (skip depth-2+)
- Max 1 reference component for new features
- Start minimal, load more only if needed
- Clear between unrelated tasks
