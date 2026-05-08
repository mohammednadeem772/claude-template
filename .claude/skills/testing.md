# Skill: Writing Tests

## Auto-loads when

Keywords: "tests", "test", "coverage", ".test.", ".spec."

## Steps

1. Read full source file
2. List every exported function/class/component
3. Check existing test files for project style
4. Plan test cases BEFORE writing code

## Test Cases

For each: happy path, edge cases (empty/null/zero/max), error cases, security (if auth/validation)

## Framework Templates

**Jest (JavaScript):**
```js
describe('functionName', () => {
  it('should return X when given Y', () => {
    expect(functionName(input)).toBe(expected)
  })
  
  it('should throw error for null', () => {
    expect(() => functionName(null)).toThrow('Expected error')
  })
})
```

**Pytest (Python):**
```python
class TestFunctionName:
    def test_happy_path(self):
        assert function_name(valid_input) == expected
    
    def test_invalid_raises(self):
        with pytest.raises(ValueError):
            function_name(None)
```

**React Component:**
```jsx
describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })
  
  it('shows error when email is empty', async () => {
    render(<LoginForm onSuccess={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })
})
```

## Rules

- Test file next to source or in tests/ folder
- Mock all external dependencies (DB, APIs, time)
- Reset mocks between tests
- Descriptive names: "should show error when email is empty"
- Target: 80%+ coverage
- Tests must actually run (no pseudocode)

## Output

```
Tests written for: [file]
Framework: [Jest/Pytest/etc]
Files: ✅ tests/file.test.js (12 tests)
Coverage: [function/component] — X% covered
Run: [test command]
```
