# Skill: Full-Stack Feature Patterns

## Auto-loads when Claude detects:
- "/feature" command
- "create a screen"
- "build a module"
- "add listing with form"
- "new page with API"
- "CRUD screen"

## Core Pattern (same across all stacks)

Every feature follows this exact shape:

```
DATA LAYER      → Model / Schema / Migration
VALIDATION      → Input validator (Zod / Pydantic / Joi)
API LAYER       → 5 REST endpoints (list, get, create, update, delete)
STATE LAYER     → Custom hook or Provider (API calls + state)
UI LAYER        → List screen + Form screen
NAVIGATION      → Route/screen registered
TESTS           → Backend tests + Frontend tests
```

## Decision Tree — Which Template to Use

```
Stack?
├── React + Node.js/Express
│   ├── Model: Mongoose schema OR Prisma model
│   ├── API:   Express router + controller
│   ├── FE:    React component + useXxx hook
│   └── Test:  Jest + Supertest + RTL
│
├── Next.js (App Router)
│   ├── Model: Prisma model
│   ├── API:   app/api/[resource]/route.ts
│   ├── FE:    app/[resource]/page.tsx
│   └── Test:  Vitest + RTL
│
├── React + FastAPI
│   ├── Model: SQLAlchemy model + Alembic migration
│   ├── API:   FastAPI router + Pydantic schemas
│   ├── FE:    React component + useXxx hook
│   └── Test:  Pytest + Jest + RTL
│
├── React Native
│   ├── API:   Same as above (Node or FastAPI)
│   ├── FE:    Screen with View/FlatList/TouchableOpacity
│   └── Test:  Jest + RNTL
│
└── Flutter
    ├── API:   Same as above
    ├── FE:    Widget + Provider/Bloc
    └── Test:  flutter_test + mockito
```

## Response Format: pagination standard

ALL list endpoints and screens MUST return and handle:
```js
// API response
{
  data: {
    items: [...],
    pagination: { page: 1, limit: 20, total: 100, totalPages: 5 }
  },
  error: null
}

// FE state
const [page, setPage] = useState(1)
useEffect(() => { fetchData({ page }) }, [page])

// Offset formula (ALWAYS this)
offset = (page - 1) * limit
```

## Response Format: form validation pattern

ALL forms MUST have:
```js
// validate() returns errors object
const validate = () => {
  const errs = {}
  if (!form.field) errs.field = 'Field is required'
  return errs
}

// handleSubmit blocks if errors
const handleSubmit = async (e) => {
  e.preventDefault()
  const errs = validate()
  if (Object.keys(errs).length) { setErrors(errs); return }
  // proceed with API call
}
```

## Required states (EVERY data-fetching component)

```
isLoading=true  → show <Spinner /> or skeleton
error!=null     → show <ErrorMessage /> with retry button
data.length==0  → show <EmptyState /> with create CTA
data.length>0   → show the actual content
```
