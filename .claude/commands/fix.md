# /fix — Find Root Cause and Fix Any Bug
#
# WORKS WITH:
#   React + Node.js/Express
#   Next.js (App Router)
#   React + Python/FastAPI
#   React Native
#   Flutter
#
# USAGE EXAMPLES:
#   /fix pagination not working on appointment screen
#   /fix login form not submitting
#   /fix API returning 500 on /api/orders
#   /fix search filter not updating results
#   /fix modal not closing after save
#   /fix data not refreshing after delete
#   /fix TypeScript errors in src/components/UserCard.tsx
#   /fix slow loading on dashboard — optimize queries
#   /fix broken layout on mobile (React Native)
#   /fix Flutter ListView not scrolling

## ─────────────────────────────────────────────────────────
## RULE #1 — NEVER GUESS. ALWAYS READ THE CODE FIRST.
## ─────────────────────────────────────────────────────────

Before changing anything:
1. Read every file mentioned in the bug description
2. Trace the full data flow (user action → state → API → DB → response → UI)
3. Find the EXACT line that is wrong — not just the area
4. Understand WHY it's wrong, not just what to change
5. Fix the root cause — not the symptom

## ─────────────────────────────────────────────────────────
## DIAGNOSIS PLAYBOOK — by bug type
## ─────────────────────────────────────────────────────────

### PAGINATION BUG
```
Symptoms: page 2 shows same data, total count wrong,
          clicking next does nothing, first page skipped

Trace this path:
  1. FE: Does pagination state exist? (page, limit, total, totalPages)
  2. FE: Does page state change when user clicks Next/Prev?
  3. FE: Is useEffect / watch re-running when page changes?
         → check dependency array: useEffect(() => fetch(), [page])
  4. FE: Is page being sent in API request? ?page=2&limit=20
  5. BE: Is page param being read? const page = req.query.page
  6. BE: Is offset calculated correctly?
         WRONG:  offset = page * limit       ← page 1 skips first 20
         RIGHT:  offset = (page - 1) * limit ← page 1 starts at 0
  7. BE: Is total count returned in response?
  8. FE: Is totalPages calculated from total / limit?

Common fixes:
  // Fix 1: wrong offset
  const offset = (page - 1) * limit

  // Fix 2: useEffect missing page dependency
  useEffect(() => { fetchData({ page }) }, [page])  // ← add page here

  // Fix 3: page not sent in request
  api.get('/appointments', { params: { page, limit, ...filters } })

  // Fix 4: total pages not calculated
  const totalPages = Math.ceil(total / limit)
```

### FORM NOT SUBMITTING
```
Symptoms: button click does nothing, no API call made,
          no error shown, form seems stuck

Trace this path:
  1. Is onSubmit on the <form> element? NOT on the button
         <form onSubmit={handleSubmit}>   ← correct
         <button onClick={handleSubmit}>  ← wrong (no preventDefault)
  2. Is e.preventDefault() called first thing?
  3. Is validation blocking submit silently?
         → add console.log to see if validation errors are being set
  4. Is the API call inside try/catch? Is it actually being reached?
  5. Is loading state stuck true from a previous error?
  6. Check Network tab — is the request being sent at all?
  7. Is auth token missing from request headers?

Common fixes:
  const handleSubmit = async (e) => {
    e.preventDefault()             // ← must be first
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return                       // ← stops here if invalid
    }
    setIsLoading(true)
    try {
      await api.post('/endpoint', formData)
      onSuccess()
    } catch (err) {
      setErrors({ form: err.response?.data?.error || 'Failed' })
    } finally {
      setIsLoading(false)          // ← always reset loading
    }
  }
```

### API 500 ERROR
```
Symptoms: network tab shows 500, error in console,
          "Internal Server Error" message

Trace this path:
  1. Read the ACTUAL server error log (not just the 500 response)
  2. Find the stack trace — which file + line threw?
  3. Common causes:
     a. Null/undefined access: Cannot read property 'x' of undefined
        → check if DB returned null before accessing fields
     b. Missing await:  const user = User.findById(id)  ← missing await
        → user is a Promise, not a user object
     c. Wrong env variable: process.env.DB_URL is undefined
        → check .env file and dotenv config
     d. DB connection failed
        → check DB is running, connection string is correct
     e. Validation schema mismatch: required field not sent
        → add better error handling to catch ZodError/ValidationError

Common fixes:
  // Fix 1: null check before access
  const user = await User.findById(id)
  if (!user) return res.status(404).json({ error: 'Not found' })
  const name = user.profile.name  // safe now

  // Fix 2: missing await
  const user = await User.findById(id)  // ← add await

  // Fix 3: catch specific errors
  } catch (err) {
    if (err.name === 'ZodError')
      return res.status(400).json({ error: err.errors[0].message })
    if (err.name === 'CastError')
      return res.status(400).json({ error: 'Invalid ID format' })
    console.error('Unexpected error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
```

### FILTER / SEARCH NOT WORKING
```
Symptoms: typing in search does nothing, filter select has no effect,
          same data shown regardless of filter value

Trace this path:
  1. FE: Does filter state update when user types/selects?
         → add console.log in onChange handler
  2. FE: Does useEffect/watch run when filter state changes?
         → check dependency array includes filter variables
  3. FE: Is filter value sent in API request params?
         → check Network tab → request URL → query params
  4. BE: Is the filter param being read from query?
         const { search, department } = req.query
  5. BE: Is WHERE/filter clause applied only when value exists?

Common fixes:
  // FE Fix: add filter to useEffect dependency
  useEffect(() => {
    fetchData({ page: 1, search, department })  // reset to page 1
  }, [search, department])  // ← filters here

  // FE Fix: reset page when filter changes
  const handleSearchChange = (value) => {
    setSearch(value)
    setPage(1)  // ← always reset to page 1 when filtering
  }

  // BE Fix: apply filter only if value exists
  const filter = {}
  if (search)     filter.$or = [{ name: { $regex: search, $options: 'i' } }]
  if (department) filter.department = department
  // empty filter = no WHERE clause = return all
```

### DATA NOT REFRESHING AFTER CREATE/UPDATE/DELETE
```
Symptoms: add new item → list doesn't show it,
          delete item → item still visible,
          edit item → old data still showing

Trace this path:
  1. After mutation, is fetchData() being called again?
  2. Is the component's state being updated optimistically?
  3. Is the form's onClose / onSuccess calling a refresh?

Common fixes:
  // Fix 1: re-fetch after mutation
  const handleFormClose = () => {
    setShowForm(false)
    fetchEmployees({ page, search })  // ← refresh list
  }

  // Fix 2: optimistic update (faster UX)
  const handleDelete = async (id) => {
    setItems(prev => prev.filter(i => i.id !== id))  // remove immediately
    const result = await deleteItem(id)
    if (!result.success) {
      fetchItems()  // rollback on error
      alert(result.error)
    }
  }

  // Fix 3: React Query / SWR invalidation
  queryClient.invalidateQueries(['employees'])
```

### MODAL NOT CLOSING / STUCK
```
Common fixes:
  // Fix 1: loading state not reset on error
  } finally { setIsLoading(false) }  // ← in finally, not just try

  // Fix 2: onClose not called after success
  if (result.success) {
    onClose()          // ← call this
    showToast('Saved!')
  }

  // Fix 3: React Native Modal
  <Modal visible={isVisible} onRequestClose={onClose}>
    // Android back button needs onRequestClose
```

### TYPESCRIPT ERRORS
```
Trace this path:
  1. Read the exact TS error message and line number
  2. Common causes:
     a. Property doesn't exist on type
        → add it to the interface/type
     b. Type 'X | undefined' not assignable to type 'X'
        → add null check: if (!value) return
     c. Argument of type 'string' not assignable to 'number'
        → parse: Number(value) or parseInt(value)
     d. Object is possibly null
        → use optional chaining: user?.profile?.name

  // Fix: update interface
  interface Employee {
    _id:        string
    firstName:  string
    lastName:   string
    email:      string
    department: string
    position:   string
    phone?:     string      // optional with ?
    isActive:   boolean
    createdAt:  string
  }
```

### PERFORMANCE / SLOW LOADING
```
Trace this path:
  1. BE: Check DB queries — are indexes missing?
         db.collection.createIndex({ department: 1 })
  2. BE: N+1 query? (looping and querying inside loop)
         → use populate() or JOIN or batch query
  3. BE: Returning too much data?
         → add pagination, use .select() to limit fields
  4. FE: Too many re-renders?
         → wrap in useMemo/useCallback where it matters
  5. FE: Heavy component loading on mount?
         → lazy load: const Chart = lazy(() => import('./Chart'))
  6. FE: Large images?
         → use next/image or explicit width/height

Common fixes:
  // BE: Add index
  employeeSchema.index({ department: 1, isActive: 1 })

  // BE: Select only needed fields
  await Employee.find(filter).select('firstName lastName email department')

  // FE: Lazy load heavy component
  const HeavyChart = lazy(() => import('./HeavyChart'))
```

### REACT NATIVE SPECIFIC
```
Layout broken:
  → Check flex direction: default is 'column' in RN (not 'row' like web)
  → Missing flex:1 on parent View causes 0 height
  → ScrollView needs flex:1 on parent

List not scrolling:
  → FlatList inside ScrollView → remove outer ScrollView
  → Set flex:1 on FlatList container

Keyboard covering input:
  → Wrap screen in KeyboardAvoidingView
  → behavior='padding' on iOS, 'height' on Android

Navigation not working:
  → Screen not registered in navigator
  → Missing navigation prop (use useNavigation() hook)
```

### FLUTTER SPECIFIC
```
Widget overflow:
  → Wrap in SingleChildScrollView or Expanded
  → Use Flexible instead of fixed size in Row/Column

State not updating:
  → Missing notifyListeners() in ChangeNotifier
  → Using setState in wrong widget (StatelessWidget)
  → Provider not wrapped around widget tree

API data not showing:
  → Missing await in Future
  → FutureBuilder not handling ConnectionState.waiting
  → initState calling async without addPostFrameCallback
```

## ─────────────────────────────────────────────────────────
## OUTPUT FORMAT (always use this structure)
## ─────────────────────────────────────────────────────────

```
Bug: [name of the bug]
Root cause: [one sentence — WHY it was broken]

Files changed:
  📝 src/hooks/useEmployees.js    line 34
  📝 src/components/EmployeeList.jsx  line 67

─── BEFORE (broken) ────────────────────
[exact code that was wrong]

─── AFTER (fixed) ──────────────────────
[exact corrected code]

─── WHY ────────────────────────────────
[one paragraph explaining root cause and why fix works]

─── TEST ───────────────────────────────
[how to verify the fix manually]
[if a test should be added — show it]
```

## ─────────────────────────────────────────────────────────
## PREVENTION NOTE (always add at end)
## ─────────────────────────────────────────────────────────

After every fix, suggest how to prevent this class of bug:
- "Add pagination integration test to prevent offset regressions"
- "Add form submission test to catch this pattern early"
- "Add loading state reset to finally block pattern in all hooks"
