# Skill: Frontend Development

## Auto-loads when

Keywords: "component", "page", "screen", "form", "UI", "button", "modal", "navbar", "sidebar", "card"

## Before Writing UI Code

1. Check CLAUDE.md: framework, CSS solution, folder structure
2. Check existing components for patterns
3. Plan files: component + test + sub-components

## Component Checklist (MUST have)

- Typed props (TypeScript/PropTypes)
- Loading/Error/Empty states (if fetches data or shows list)
- Responsive design (mobile-first)
- Accessible (labels, keyboard nav)
- Test file

## State Decisions

- UI-only state → `useState` locally
- Data fetching → custom hook
- App-wide state → global store

## Quick Patterns

**Form with validation:**
```js
const [errors, setErrors] = useState({})
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async (e) => {
  e.preventDefault()
  const errs = validate(formData)
  if (Object.keys(errs).length) { setErrors(errs); return }
  
  setIsLoading(true)
  try {
    await submitForm(formData)
  } catch (err) {
    setErrors({ form: 'Something went wrong' })
  } finally {
    setIsLoading(false)
  }
}
```

**API call in hook:**
```js
const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (email, password) => {
    setIsLoading(true); setError(null)
    try {
      const res = await api.post('/auth/login', { email, password })
      return res.data
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally { setIsLoading(false) }
  }
  return { login, isLoading, error }
}
```
