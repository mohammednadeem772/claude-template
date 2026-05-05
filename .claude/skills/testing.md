# Skill: Writing Tests

## Auto-loads when Claude detects:
- "tests likho / write tests"
- "test karo / test this"
- "coverage badhao / improve coverage"
- ".test. or .spec. file"

## Step 1: Understand the source
- Read the full source file
- List every exported function/class/component
- Note the inputs, outputs, and side effects of each

## Step 2: Plan test cases
For each function/component:
1. Happy path (normal valid use)
2. Edge cases (empty, null, zero, max)
3. Error cases (invalid input, failures)
4. Security (if auth/validation involved)

## Step 3: Check existing test style
- Open any existing .test.js file
- Match: describe structure, assertion style, mock patterns

## Step 4: Write tests

### JavaScript (Jest/Vitest)
```js
import { describe, it, expect, beforeEach, vi } from 'vitest' // or jest

describe('moduleName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('functionName', () => {
    it('should return correct value for valid input', () => {
      expect(functionName('valid')).toBe('expected')
    })

    it('should throw error for null input', () => {
      expect(() => functionName(null)).toThrow('Input required')
    })

    it('should return default for empty string', () => {
      expect(functionName('')).toBe('default')
    })
  })
})
```

### React Component (Testing Library)
```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('shows error when email is empty on submit', async () => {
    render(<LoginForm onSuccess={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })

  it('calls onSuccess after successful login', async () => {
    const onSuccess = vi.fn()
    mockApi.post.mockResolvedValue({ data: { token: 'abc' } })
    render(<LoginForm onSuccess={onSuccess} />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith({ token: 'abc' }))
  })
})
```

### Python (Pytest)
```python
import pytest
from unittest.mock import patch, MagicMock

class TestFunctionName:
    def test_happy_path(self):
        assert function_name('valid') == 'expected'

    def test_empty_input_returns_default(self):
        assert function_name('') == 'default'

    def test_none_input_raises_value_error(self):
        with pytest.raises(ValueError, match='Input required'):
            function_name(None)

    @patch('module.external_dependency')
    def test_with_mocked_dependency(self, mock_dep):
        mock_dep.return_value = {'id': 1}
        result = function_name('input')
        assert result['id'] == 1
```
