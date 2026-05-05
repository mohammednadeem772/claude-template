# /refactor — Clean Up and Improve Existing Code
#
# WORKS WITH: React, Next.js, Node.js, FastAPI, React Native, Flutter
#
# USAGE EXAMPLES:
#   /refactor employee list component is too big, split it
#   /refactor useEmployees hook — too many responsibilities
#   /refactor api/orders.js — duplicate code everywhere
#   /refactor dashboard page — re-renders too much
#   /refactor Flutter employee screen — logic mixed with UI
#   /refactor React Native form — repeated validation code

## ─────────────────────────────────────────────────────────
## GOLDEN RULES
## ─────────────────────────────────────────────────────────

1. BEHAVIOR MUST NOT CHANGE — tests must still pass after refactor
2. One refactor type at a time — don't mix "split component" with "add types"
3. Read the WHOLE file before refactoring — understand what it does
4. If tests exist, run them before AND after
5. Explain every structural change — don't just silently move code

## ─────────────────────────────────────────────────────────
## REFACTOR TYPES — detect from description
## ─────────────────────────────────────────────────────────

### TYPE 1 — Split a Large Component / File
Trigger: "too big", "too long", "split", "500+ lines"

Rules:
- Component > 200 lines → split into sub-components
- Hook doing > 2 things → split into focused hooks
- File doing > 1 concern → split by responsibility

```
Before: EmployeeList.jsx (400 lines — list + form + filters + pagination)

After:
  EmployeeListPage.jsx     ← orchestrator only (< 80 lines)
  EmployeeTable.jsx        ← table + rows
  EmployeeFilters.jsx      ← search + department filter
  EmployeePagination.jsx   ← page controls
  EmployeeForm.jsx         ← create/edit modal
  useEmployees.js          ← all API calls and state
```

### TYPE 2 — Extract Repeated Code (DRY)
Trigger: "duplicate", "repeated", "same code everywhere"

```js
// Before: same validation in 3 files
if (!email) return 'Email required'
if (!/\S+@\S+/.test(email)) return 'Invalid email'

// After: one shared validator
// src/utils/validators.js
export const validateEmail = (email) => {
  if (!email) return 'Email required'
  if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format'
  return null
}
```

### TYPE 3 — Improve Readability
Trigger: "confusing", "hard to understand", "cleanup"

```js
// Before: cryptic
const r = d.filter(x => x.s === 1 && x.d === dp).map(x => ({...x, n: x.fn + ' ' + x.ln}))

// After: readable
const activeEmployeesInDepartment = employees
  .filter(emp => emp.isActive === true && emp.department === selectedDepartment)
  .map(emp => ({ ...emp, fullName: `${emp.firstName} ${emp.lastName}` }))
```

### TYPE 4 — Fix Re-render Performance (React)
Trigger: "slow", "re-renders", "laggy", "performance"

```jsx
// Before: new function on every render
<EmployeeRow onDelete={() => handleDelete(emp.id)} />

// After: stable reference
const handleDelete = useCallback((id) => {
  deleteEmployee(id)
}, [deleteEmployee])

<EmployeeRow onDelete={handleDelete} />

// Before: expensive calculation on every render
const stats = employees.map(e => calculateStats(e))

// After: only recalculate when employees change
const stats = useMemo(() => employees.map(e => calculateStats(e)), [employees])
```

### TYPE 5 — Separate Concerns (Logic from UI)
Trigger: "logic in component", "business logic in view", "mixed concerns"

```jsx
// Before: API calls + state + business logic all inside component
function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const fetchData = async () => {
    const res = await fetch('/api/employees')
    const data = await res.json()
    setEmployees(data)
  }
  const handleDelete = async (id) => {
    await fetch(`/api/employees/${id}`, { method: 'DELETE' })
    setEmployees(prev => prev.filter(e => e.id !== id))
  }
  // ... 150 more lines
}

// After: hook holds logic, component holds UI only
// useEmployees.js — all logic here
export const useEmployees = () => { ... }

// EmployeeList.jsx — UI only
function EmployeeList() {
  const { employees, isLoading, error, deleteEmployee } = useEmployees()
  // just JSX here
}
```

### TYPE 6 — Add TypeScript Types
Trigger: "add types", "TypeScript", "type safety"

```ts
// Before: no types (JS)
function EmployeeCard({ employee, onEdit, onDelete }) { ... }

// After: typed (TS)
interface Employee {
  _id:        string
  firstName:  string
  lastName:   string
  email:      string
  department: string
  position:   string
  phone?:     string
  isActive:   boolean
  createdAt:  string
}

interface EmployeeCardProps {
  employee: Employee
  onEdit:   (employee: Employee) => void
  onDelete: (id: string) => void
}

function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) { ... }
```

### TYPE 7 — Flutter: Separate Widget from Logic
Trigger: "Flutter logic in widget", "StatefulWidget too big"

```dart
// Before: API calls inside Widget build method (wrong)
class EmployeeScreen extends StatefulWidget {
  // ... 300 lines mixing build UI and business logic
}

// After: Provider/Bloc holds logic, Widget is pure UI
// employee_provider.dart — all state and API calls
class EmployeeProvider extends ChangeNotifier { ... }

// employee_screen.dart — pure UI, reads from provider
class EmployeeScreen extends StatelessWidget {
  Widget build(BuildContext context) {
    return Consumer<EmployeeProvider>(
      builder: (_, provider, __) => EmployeeListView(
        employees: provider.employees,
        isLoading: provider.isLoading,
      ),
    );
  }
}
```

### TYPE 8 — React Native: Extract StyleSheet
Trigger: "inline styles", "styles inside component"

```jsx
// Before: styles mixed with JSX
<View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111' }}>

// After: clean JSX + separate styles
<View style={s.container}>
  <Text style={s.title}>

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title:     { fontSize: 16, fontWeight: '600', color: '#111' },
})
```

## ─────────────────────────────────────────────────────────
## OUTPUT FORMAT
## ─────────────────────────────────────────────────────────

```
Refactor: [what was done]
Type: [Split / DRY / Readability / Performance / Separation / Types]

Changes:
  📝 Modified: src/components/EmployeeList.jsx
  ✅ Created:  src/components/employees/EmployeeTable.jsx
  ✅ Created:  src/components/employees/EmployeeFilters.jsx
  ✅ Created:  src/hooks/useEmployees.js

What changed and why:
  1. Extracted API logic into useEmployees hook
     → Component was 380 lines, now 90. Hook is testable independently.
  2. Split table into EmployeeTable
     → Reusable, can be used on other pages.
  3. Split filters into EmployeeFilters
     → Single responsibility, easier to test.

Behavior: unchanged — all existing functionality preserved.
Tests: run [test command] to verify nothing broke.
```
