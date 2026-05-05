# Skill: Frontend Development

## Auto-loads when Claude detects these tasks:
- "component banao / create component"
- "page banao / create page"
- "screen banao / create screen"
- "form banao / create form"
- "UI banao / create UI"
- "button / modal / navbar / sidebar / card"

## Before Writing Any UI Code

1. Check CLAUDE.md for:
   - Which framework (React / Vue / Next.js)
   - Which CSS solution (Tailwind / CSS Modules / SCSS)
   - Folder structure

2. Check existing components for patterns to follow

3. Plan the files needed:
   - Component file
   - Test file
   - Any sub-components

## Component Checklist

Every component MUST have:
- [ ] Typed props (TypeScript or PropTypes)
- [ ] Loading state (if it fetches data)
- [ ] Error state (if it can fail)
- [ ] Empty state (if it shows a list)
- [ ] Responsive design (mobile-first)
- [ ] Accessible markup (labels, keyboard nav)
- [ ] Test file

## State Decisions
- UI-only state (open/closed, hover): `useState` locally
- Data fetching: custom hook (useUsers, useOrders)
- App-wide state (current user, theme, cart): global store

## File Output
When creating a component called `LoginForm`:
```
src/components/auth/LoginForm.jsx      ← component
src/components/auth/LoginForm.test.jsx ← tests
```

Or if barrel files exist:
```
src/components/auth/LoginForm/
  index.jsx       ← component
  index.test.jsx  ← tests
```

## Quick Patterns

### Form with validation
```jsx
const [errors, setErrors] = useState({})
const [isLoading, setIsLoading] = useState(false)

const validate = (data) => {
  const errs = {}
  if (!data.email) errs.email = 'Email is required'
  if (!data.password) errs.password = 'Password is required'
  return errs
}

const handleSubmit = async (e) => {
  e.preventDefault()
  const errs = validate(formData)
  if (Object.keys(errs).length) { setErrors(errs); return }
  setIsLoading(true)
  try {
    await submitForm(formData)
  } catch (err) {
    setErrors({ form: 'Something went wrong. Please try again.' })
  } finally {
    setIsLoading(false)
  }
}
```

### API call in hook
```js
const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
```
