# /test — Write Tests for Any File or Feature

## Usage

```bash
/test src/hooks/useEmployees.js
/test src/components/EmployeeForm.jsx
/test src/api/controllers/employeeController.js
```

## BEFORE WRITING TESTS

1. Read source file completely
2. List every exported function/component/class
3. Check existing test files for project's style
4. Identify framework (Jest/Pytest/etc.) from package.json
5. List test cases BEFORE writing code

## WHAT TO TEST

**For every exported function:**
- Happy path (normal expected input)
- Edge cases (empty, null, 0, undefined, very large)
- Error cases (invalid input, expected errors)
- Boundary values (min, max, exactly at limit)

**For API endpoints:**
- 200/201 success with valid data
- 400 validation errors (missing fields, wrong types)
- 401 unauthorized (no token)
- 403 forbidden (wrong user)
- 404 not found
- 409 conflict

**For components:**
- Renders without crashing
- Displays correct data from props
- Handles user interactions (click, type, submit)
- Shows loading state
- Shows error state
- Shows empty state
- Accessibility (keyboard nav, labels)

## FRAMEWORK TEMPLATES

**Jest (JavaScript)**
```js
describe('functionName', () => {
  it('should return X when given Y', () => {
    expect(functionName(input)).toBe(expected)
  })
  
  it('should handle null', () => {
    expect(() => functionName(null)).toThrow('Expected error')
  })
})
```

**Pytest (Python)**
```python
class TestFunctionName:
    def test_happy_path(self):
        assert function_name(valid_input) == expected
    
    def test_invalid_raises(self):
        with pytest.raises(ValueError):
            function_name(None)
```

## RULES

- Test file next to source or in tests/ folder
- Mock all external dependencies (DB, APIs, time)
- Reset mocks between tests
- Use descriptive names: "should show error when email is empty"
- Target: 80%+ coverage

## OUTPUT

```
Tests written for: [file name]
Framework: [Jest/Pytest/etc]

Files created:
  ✅ tests/hooks/useEmployees.test.js (12 tests)
  ✅ tests/EmployeeForm.test.jsx (9 tests)

Coverage:
  useEmployees — 100% functions covered
  EmployeeForm — all states covered

Run: [test command from CLAUDE.md]
```
