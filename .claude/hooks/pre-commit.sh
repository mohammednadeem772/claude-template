#!/bin/bash
# .claude/hooks/pre-commit.sh
# Runs before every git commit
# Auto-detects project type and runs appropriate tests
# BLOCKS commit if tests fail

echo ""
echo "── Pre-commit checks ───────────────────"

FAILED=0

# ── Node.js / JavaScript / TypeScript ──
if [ -f "package.json" ]; then
  echo "  Running JS/TS tests..."
  npm test -- --passWithNoTests --silent 2>/dev/null
  if [ $? -ne 0 ]; then
    echo "  ❌ JS tests failed"
    FAILED=1
  else
    echo "  ✅ JS tests passed"
  fi

  # ESLint check
  if command -v eslint &>/dev/null; then
    npx eslint . --max-warnings=0 2>/dev/null
    if [ $? -ne 0 ]; then
      echo "  ❌ ESLint errors found"
      FAILED=1
    else
      echo "  ✅ ESLint clean"
    fi
  fi
fi

# ── Python ──
if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
  echo "  Running Python tests..."
  python -m pytest -q --tb=short 2>/dev/null
  if [ $? -ne 0 ]; then
    echo "  ❌ Python tests failed"
    FAILED=1
  else
    echo "  ✅ Python tests passed"
  fi
fi

# ── PHP / Laravel ──
if [ -f "artisan" ]; then
  echo "  Running PHP tests..."
  php artisan test --quiet 2>/dev/null
  if [ $? -ne 0 ]; then
    echo "  ❌ PHP tests failed"
    FAILED=1
  else
    echo "  ✅ PHP tests passed"
  fi
fi

# ── Go ──
if [ -f "go.mod" ]; then
  echo "  Running Go tests..."
  go test ./... -q 2>/dev/null
  if [ $? -ne 0 ]; then
    echo "  ❌ Go tests failed"
    FAILED=1
  else
    echo "  ✅ Go tests passed"
  fi
fi

# ── Ruby ──
if [ -f "Gemfile" ]; then
  echo "  Running Ruby tests..."
  bundle exec rspec --format progress 2>/dev/null || \
  bundle exec rails test 2>/dev/null
  if [ $? -ne 0 ]; then
    echo "  ❌ Ruby tests failed"
    FAILED=1
  else
    echo "  ✅ Ruby tests passed"
  fi
fi

# ── Result ──
echo "────────────────────────────────────────"
if [ $FAILED -eq 1 ]; then
  echo "  ❌ Commit blocked — fix errors above"
  echo ""
  exit 1
fi

echo "  ✅ All checks passed — committing..."
echo ""
