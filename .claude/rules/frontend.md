# Frontend Rules
# Applies to: src/components/** src/pages/** src/views/** resources/views/**

## Components

### Structure
- One component per file
- File name = component name (PascalCase)
- Export: `export default ComponentName` at bottom
- Props: always typed (TypeScript interface or PropTypes)
- No business logic inside components — move to hooks

### Props
```jsx
// Wrong — no types
function UserCard({ user, onClick }) { ... }

// Correct — typed
interface UserCardProps {
  user: { id: number; name: string; email: string }
  onClick: (userId: number) => void
}
function UserCard({ user, onClick }: UserCardProps) { ... }
```

### Required States (every component that fetches data)
1. **Loading state** — show spinner or skeleton
2. **Error state** — show user-friendly message, not "Error"
3. **Empty state** — show helpful message when no data
4. **Success state** — show the actual content

```jsx
if (isLoading) return <Spinner />
if (error) return <ErrorMessage message="Could not load users" />
if (users.length === 0) return <EmptyState message="No users yet" />
return <UserList users={users} />
```

## Styling

### Rules
- [Tailwind / CSS Modules / SCSS] — as defined in CLAUDE.md
- No inline styles except truly dynamic values (e.g. width from JS variable)
- No hardcoded colors — use design tokens or Tailwind classes
- Mobile-first: style mobile first, then add md: lg: breakpoints

### Tailwind specifically
```jsx
// Wrong — too many classes, use component class
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ...">

// Better — extract to component
<PrimaryButton>Login</PrimaryButton>
```

## Accessibility (Non-Negotiable)

Every interactive element must:
- Be keyboard accessible (Tab to reach, Enter/Space to activate)
- Have a visible focus indicator
- Have an ARIA label if icon-only button

Forms:
- Every `<input>` must have a `<label>` with matching `htmlFor`
- Required fields must be marked (aria-required="true")
- Error messages must be linked to input (aria-describedby)

Images:
- Decorative images: `alt=""`
- Content images: `alt="descriptive text"`
- Never omit alt attribute

```jsx
// Wrong
<input type="email" placeholder="Enter email" />

// Correct
<label htmlFor="email">Email address</label>
<input
  id="email"
  type="email"
  placeholder="you@example.com"
  aria-required="true"
  aria-describedby="email-error"
/>
{error && <span id="email-error" role="alert">{error}</span>}
```

## Performance

- Lazy load routes: `const Dashboard = lazy(() => import('./Dashboard'))`
- Lazy load heavy components (charts, editors, maps)
- Images: use next/image or set explicit width/height to prevent layout shift
- Don't premature-optimize — profile first, then fix
- Lists: use `key` prop correctly (not index, use unique ID)
