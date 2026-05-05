# /test-all — Run Full Test Suite

## Usage
```
/test-all                   # Run all tests
/test-all --unit            # Unit tests only
/test-all --integration     # Integration tests only
/test-all --e2e             # End-to-end tests only
/test-all --coverage        # Run with coverage report
/test-all src/auth/         # Test specific folder only
```

## Behaviour

### 1. Detect stack automatically
Check for: package.json, requirements.txt, pyproject.toml, artisan, go.mod, Gemfile

### 2. Run appropriate commands
```bash
# Node.js
npm test
npm run test:unit
npm run test:integration
npm run test:e2e
npx jest --coverage

# Python
pytest
pytest tests/unit/
pytest tests/integration/
pytest --cov=. --cov-report=html

# Laravel
php artisan test
php artisan test --testsuite=Unit
php artisan test --testsuite=Integration

# Go
go test ./...
go test ./... -v -cover

# Ruby
bundle exec rspec
bundle exec rspec spec/models/
```

### 3. Report results clearly

If all pass:
```
✅ All tests passed
  Tests:   42 passed, 0 failed, 3 skipped
  Time:    4.2s
```

If some fail — show ONLY failing tests:
```
❌ 2 tests failed

FAIL: LoginForm > shows error on wrong password
  Expected: "Invalid credentials"
  Received: undefined
  File: src/components/auth/LoginForm.test.jsx:45

FAIL: POST /api/auth/login > returns 401 for wrong password
  Expected status: 401
  Received status: 500
  File: tests/api/auth.test.js:89

──────────────────────────────────
  Tests:   40 passed, 2 failed
  Fix these 2 tests before committing.
```

### 4. Coverage report (--coverage flag)
```
Coverage Report
  src/components/    92% ✅
  src/api/           78% ⚠️
  src/utils/         95% ✅
  src/hooks/         45% ❌ (below 70% threshold)

Overall: 82%
Files below 70%: src/hooks/ — needs more tests
```
