# /context — Smart Context Loading

## Usage

```
/context load [task]    # Load context for specific task
/context show           # Show current context
/context clear          # Clear unnecessary files
/context smart          # Auto-detect from last prompt
```

## CRITICAL RULE: Read CLAUDE.md First

Before loading ANY files:
1. **Always read CLAUDE.md first** — understand project structure
2. Use actual folder paths from CLAUDE.md (never assume)
3. Use naming conventions from CLAUDE.md
4. Detect what exists: frontend? backend? tests?
5. Adapt loading strategy to actual project architecture

Max 5 files per task — no exceptions

**Bug Fix** → affected file + imports + test (500-1,500 tokens)

```
Fix pagination in EmployeeList.jsx
  ✅ src/components/EmployeeList.jsx
  ✅ src/hooks/useEmployees.js (if imported)
  ✅ src/api/employees.js (if API call exists)
  ✅ __tests__/EmployeeList.test.jsx
  ❌ SKIP: dependency folders, unrelated components
```

**New Feature** → CLAUDE.md + 1 similar component + shared components (1,000-2,500 tokens)
  - Read CLAUDE.md to understand project architecture
  - Find similar feature in actual project structure
  - Max 1 reference component (not 3-4)
  - Use paths from CLAUDE.md, never hardcode

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

## Rules (Project-Aware)

- **Always start with CLAUDE.md** — understand architecture first
- Load depth-1 imports only (skip depth-2+)
- Use actual folder structure from project (never assume paths)
- Max 1 reference component for new features
- Start minimal, load more only if needed
- If path doesn't exist → check CLAUDE.md for correct structure
- Clear between unrelated tasks
