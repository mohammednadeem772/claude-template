# /test — Write Tests for Any File or Feature
#
# WORKS WITH:
#   Jest + React Testing Library (React / Next.js)
#   Pytest (FastAPI / Python)
#   Supertest (Node.js / Express)
#   React Native Testing Library
#   Flutter Test
#
# USAGE EXAMPLES:
#   /test src/hooks/useEmployees.js
#   /test src/components/employees/EmployeeForm.jsx
#   /test src/api/controllers/employeeController.js
#   /test app/routers/employees.py
#   /test screens/EmployeeListScreen.jsx (React Native)
#   /test lib/features/employees/ (Flutter)

## ─────────────────────────────────────────────────────────
## BEFORE WRITING TESTS
## ─────────────────────────────────────────────────────────

1. Read the source file completely
2. List every exported function / component / class
3. Identify the framework by checking package.json / pubspec.yaml
4. Find ONE existing test file and match its exact style
5. List test cases BEFORE writing any code:
   ```
   I will write tests for: useEmployees.js

   Test cases:
     fetchEmployees()
       ✓ sets loading true while fetching
       ✓ sets employees on success
       ✓ sets error on API failure
       ✓ resets error before each fetch
     createEmployee()
       ✓ returns success:true and employee data
       ✓ returns success:false with error message on failure
     deleteEmployee()
       ✓ removes employee from list optimistically
   ```

## ─────────────────────────────────────────────────────────
## JAVASCRIPT / REACT — Jest + React Testing Library
## ─────────────────────────────────────────────────────────

### Custom Hook Tests
```js
// tests/hooks/useEmployees.test.js
import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useEmployees } from '@/hooks/useEmployees'
import api from '@/lib/api'

vi.mock('@/lib/api')

const mockEmployees = [
  { _id: '1', firstName: 'Ahmed', lastName: 'Khan', email: 'ahmed@test.com', department: 'Engineering' },
  { _id: '2', firstName: 'Sara',  lastName: 'Ali',  email: 'sara@test.com',  department: 'HR' },
]

const mockPagination = { page: 1, limit: 20, total: 2, totalPages: 1 }

describe('useEmployees', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('fetchEmployees', () => {
    it('sets isLoading true while fetching', async () => {
      api.get.mockImplementation(() => new Promise(() => {}))  // never resolves
      const { result } = renderHook(() => useEmployees())
      act(() => { result.current.fetchEmployees() })
      expect(result.current.isLoading).toBe(true)
    })

    it('sets employees and pagination on success', async () => {
      api.get.mockResolvedValue({ data: { data: { employees: mockEmployees, pagination: mockPagination } } })
      const { result } = renderHook(() => useEmployees())
      await act(async () => { await result.current.fetchEmployees() })
      expect(result.current.employees).toEqual(mockEmployees)
      expect(result.current.pagination.total).toBe(2)
      expect(result.current.isLoading).toBe(false)
    })

    it('sets error and stops loading on API failure', async () => {
      api.get.mockRejectedValue({ response: { data: { error: 'Server error' } } })
      const { result } = renderHook(() => useEmployees())
      await act(async () => { await result.current.fetchEmployees() })
      expect(result.current.error).toBe('Server error')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.employees).toEqual([])
    })

    it('passes search and page params to API', async () => {
      api.get.mockResolvedValue({ data: { data: { employees: [], pagination: mockPagination } } })
      const { result } = renderHook(() => useEmployees())
      await act(async () => { await result.current.fetchEmployees({ page: 2, search: 'Ahmed' }) })
      expect(api.get).toHaveBeenCalledWith('/employees', { params: { page: 2, search: 'Ahmed' } })
    })
  })

  describe('createEmployee', () => {
    it('returns success:true with created employee', async () => {
      api.post.mockResolvedValue({ data: { data: mockEmployees[0] } })
      const { result } = renderHook(() => useEmployees())
      let response
      await act(async () => { response = await result.current.createEmployee({ firstName: 'Ahmed' }) })
      expect(response.success).toBe(true)
      expect(response.data.firstName).toBe('Ahmed')
    })

    it('returns success:false with error message on failure', async () => {
      api.post.mockRejectedValue({ response: { data: { error: 'Email already in use' } } })
      const { result } = renderHook(() => useEmployees())
      let response
      await act(async () => { response = await result.current.createEmployee({}) })
      expect(response.success).toBe(false)
      expect(response.error).toBe('Email already in use')
    })
  })

  describe('deleteEmployee', () => {
    it('removes employee from list immediately', async () => {
      api.get.mockResolvedValue({ data: { data: { employees: mockEmployees, pagination: mockPagination } } })
      api.delete.mockResolvedValue({})
      const { result } = renderHook(() => useEmployees())
      await act(async () => { await result.current.fetchEmployees() })
      await act(async () => { await result.current.deleteEmployee('1') })
      expect(result.current.employees.find(e => e._id === '1')).toBeUndefined()
    })
  })
})
```

### React Component Tests
```jsx
// tests/components/EmployeeForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import EmployeeForm from '@/components/employees/EmployeeForm'
import { useEmployees } from '@/hooks/useEmployees'

vi.mock('@/hooks/useEmployees')

const mockCreate = vi.fn()
const mockUpdate = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  useEmployees.mockReturnValue({
    createEmployee: mockCreate,
    updateEmployee: mockUpdate,
    isLoading: false,
    error: null,
  })
})

describe('EmployeeForm', () => {
  describe('Create mode (no employee prop)', () => {
    it('renders all required fields', () => {
      render(<EmployeeForm onClose={vi.fn()} />)
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/department/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/position/i)).toBeInTheDocument()
    })

    it('shows "Add Employee" in submit button', () => {
      render(<EmployeeForm onClose={vi.fn()} />)
      expect(screen.getByRole('button', { name: /add employee/i })).toBeInTheDocument()
    })

    it('shows validation errors when submitted empty', async () => {
      render(<EmployeeForm onClose={vi.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: /add employee/i }))
      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      })
      expect(mockCreate).not.toHaveBeenCalled()
    })

    it('shows email format error for invalid email', async () => {
      render(<EmployeeForm onClose={vi.fn()} />)
      await userEvent.type(screen.getByLabelText(/email/i), 'notanemail')
      fireEvent.click(screen.getByRole('button', { name: /add employee/i }))
      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
      })
    })

    it('calls createEmployee with form data on valid submit', async () => {
      mockCreate.mockResolvedValue({ success: true })
      const onClose = vi.fn()
      render(<EmployeeForm onClose={onClose} />)

      await userEvent.type(screen.getByLabelText(/first name/i), 'Ahmed')
      await userEvent.type(screen.getByLabelText(/last name/i),  'Khan')
      await userEvent.type(screen.getByLabelText(/email/i),      'ahmed@test.com')
      await userEvent.selectOptions(screen.getByLabelText(/department/i), 'Engineering')
      await userEvent.type(screen.getByLabelText(/position/i),   'Developer')
      fireEvent.click(screen.getByRole('button', { name: /add employee/i }))

      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith({
          firstName: 'Ahmed', lastName: 'Khan', email: 'ahmed@test.com',
          department: 'Engineering', position: 'Developer', phone: '',
        })
        expect(onClose).toHaveBeenCalled()
      })
    })

    it('shows server error when createEmployee returns failure', async () => {
      mockCreate.mockResolvedValue({ success: false, error: 'Email already in use' })
      render(<EmployeeForm onClose={vi.fn()} />)
      // fill and submit form...
      await waitFor(() => {
        expect(screen.getByText(/email already in use/i)).toBeInTheDocument()
      })
    })
  })

  describe('Edit mode (employee prop provided)', () => {
    const existingEmployee = {
      _id: '1', firstName: 'Sara', lastName: 'Ali',
      email: 'sara@test.com', department: 'HR', position: 'Manager', phone: '',
    }

    it('pre-fills form with employee data', () => {
      render(<EmployeeForm employee={existingEmployee} onClose={vi.fn()} />)
      expect(screen.getByLabelText(/first name/i)).toHaveValue('Sara')
      expect(screen.getByLabelText(/email/i)).toHaveValue('sara@test.com')
    })

    it('shows "Save Changes" in submit button', () => {
      render(<EmployeeForm employee={existingEmployee} onClose={vi.fn()} />)
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
    })

    it('calls updateEmployee (not createEmployee) on submit', async () => {
      mockUpdate.mockResolvedValue({ success: true })
      render(<EmployeeForm employee={existingEmployee} onClose={vi.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith('1', expect.any(Object))
        expect(mockCreate).not.toHaveBeenCalled()
      })
    })
  })

  it('calls onClose when Cancel clicked', () => {
    const onClose = vi.fn()
    render(<EmployeeForm onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('disables submit button while loading', () => {
    useEmployees.mockReturnValue({ createEmployee: mockCreate, updateEmployee: mockUpdate, isLoading: true })
    render(<EmployeeForm onClose={vi.fn()} />)
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })
})
```

### API Endpoint Tests (Node.js + Supertest)
```js
// tests/api/employees.test.js
import request from 'supertest'
import app from '../../src/app.js'
import { connectDB, disconnectDB, clearDB } from '../helpers/db.js'
import { createTestUser, generateToken } from '../helpers/auth.js'

let authToken
let testUserId

beforeAll(async () => { await connectDB() })
afterAll(async () => { await disconnectDB() })
beforeEach(async () => {
  await clearDB()
  const user  = await createTestUser()
  testUserId  = user._id
  authToken   = generateToken(user._id)
})

describe('GET /api/employees', () => {
  it('returns paginated employee list', async () => {
    await Employee.create([
      { firstName: 'Ahmed', lastName: 'Khan', email: 'a@test.com', department: 'Engineering', position: 'Dev' },
      { firstName: 'Sara',  lastName: 'Ali',  email: 's@test.com', department: 'HR',          position: 'Manager' },
    ])
    const res = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${authToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data.employees).toHaveLength(2)
    expect(res.body.data.pagination.total).toBe(2)
  })

  it('filters by search term', async () => {
    await Employee.create([
      { firstName: 'Ahmed', email: 'a@test.com', department: 'Engineering', position: 'Dev', lastName: 'K' },
      { firstName: 'Sara',  email: 's@test.com', department: 'HR',          position: 'Mgr', lastName: 'A' },
    ])
    const res = await request(app)
      .get('/api/employees?search=ahmed')
      .set('Authorization', `Bearer ${authToken}`)
    expect(res.body.data.employees).toHaveLength(1)
    expect(res.body.data.employees[0].firstName).toBe('Ahmed')
  })

  it('returns 401 without auth token', async () => {
    const res = await request(app).get('/api/employees')
    expect(res.status).toBe(401)
  })
})

describe('POST /api/employees', () => {
  const validPayload = {
    firstName: 'New', lastName: 'Employee', email: 'new@test.com',
    department: 'Engineering', position: 'Junior Dev',
  }

  it('creates employee and returns 201', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validPayload)
    expect(res.status).toBe(201)
    expect(res.body.data.email).toBe('new@test.com')
    expect(res.body.data.password).toBeUndefined()  // never expose password
  })

  it('returns 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ firstName: 'Incomplete' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })

  it('returns 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ ...validPayload, email: 'notanemail' })
    expect(res.status).toBe(400)
  })

  it('returns 409 for duplicate email', async () => {
    await Employee.create(validPayload)
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validPayload)
    expect(res.status).toBe(409)
    expect(res.body.error).toMatch(/already in use/i)
  })
})

describe('PUT /api/employees/:id', () => {
  it('updates employee and returns 200', async () => {
    const emp = await Employee.create({ firstName: 'Old', lastName: 'Name', email: 'e@t.com', department: 'Eng', position: 'Dev' })
    const res = await request(app)
      .put(`/api/employees/${emp._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ firstName: 'New' })
    expect(res.status).toBe(200)
    expect(res.body.data.firstName).toBe('New')
  })

  it('returns 404 for non-existent ID', async () => {
    const res = await request(app)
      .put('/api/employees/000000000000000000000000')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ firstName: 'X' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/employees/:id', () => {
  it('soft-deletes employee (sets isActive false)', async () => {
    const emp = await Employee.create({ firstName: 'Del', lastName: 'Me', email: 'd@t.com', department: 'Eng', position: 'Dev' })
    await request(app)
      .delete(`/api/employees/${emp._id}`)
      .set('Authorization', `Bearer ${authToken}`)
    const updated = await Employee.findById(emp._id)
    expect(updated.isActive).toBe(false)
  })
})
```

## ─────────────────────────────────────────────────────────
## PYTHON — Pytest + HTTPX (FastAPI)
## ─────────────────────────────────────────────────────────

```python
# tests/test_employees.py
import pytest
from httpx import AsyncClient
from app.main import app
from app.database import get_test_db

@pytest.fixture
def auth_headers(test_user, test_token):
    return {"Authorization": f"Bearer {test_token}"}

@pytest.mark.asyncio
async def test_list_employees_paginated(client, auth_headers, db):
    db.add_all([
        Employee(first_name="Ahmed", last_name="Khan", email="a@t.com", department="Eng", position="Dev"),
        Employee(first_name="Sara",  last_name="Ali",  email="s@t.com", department="HR",  position="Mgr"),
    ])
    db.commit()
    response = await client.get("/api/employees", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 2
    assert data["total"] == 2

@pytest.mark.asyncio
async def test_create_employee_success(client, auth_headers):
    payload = {"first_name": "New", "last_name": "Emp", "email": "new@t.com", "department": "Eng", "position": "Dev"}
    response = await client.post("/api/employees", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["email"] == "new@t.com"

@pytest.mark.asyncio
async def test_create_employee_duplicate_email(client, auth_headers, db):
    employee = Employee(first_name="X", last_name="Y", email="dup@t.com", department="Eng", position="Dev")
    db.add(employee); db.commit()
    response = await client.post("/api/employees",
        json={"first_name":"A","last_name":"B","email":"dup@t.com","department":"Eng","position":"Dev"},
        headers=auth_headers)
    assert response.status_code == 409

@pytest.mark.asyncio
async def test_list_requires_auth(client):
    response = await client.get("/api/employees")
    assert response.status_code == 401
```

## ─────────────────────────────────────────────────────────
## REACT NATIVE — @testing-library/react-native
## ─────────────────────────────────────────────────────────

```jsx
// __tests__/screens/EmployeeListScreen.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import EmployeeListScreen from '@/screens/EmployeeListScreen'
import { useEmployees } from '@/hooks/useEmployees'

jest.mock('@/hooks/useEmployees')

const Wrapper = ({ children }) => <NavigationContainer>{children}</NavigationContainer>

describe('EmployeeListScreen', () => {
  it('shows loading indicator while fetching', () => {
    useEmployees.mockReturnValue({ employees: [], isLoading: true, error: null,
      fetchEmployees: jest.fn(), deleteEmployee: jest.fn(), pagination: {} })
    render(<EmployeeListScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('loading-indicator')).toBeTruthy()
  })

  it('renders employee names from hook data', async () => {
    useEmployees.mockReturnValue({
      employees: [{ _id: '1', firstName: 'Ahmed', lastName: 'Khan', position: 'Dev', department: 'Eng', email: 'a@t.com' }],
      isLoading: false, error: null, fetchEmployees: jest.fn(),
      deleteEmployee: jest.fn(), pagination: { totalPages: 1 },
    })
    render(<EmployeeListScreen />, { wrapper: Wrapper })
    expect(screen.getByText('Ahmed Khan')).toBeTruthy()
  })

  it('shows empty text when no employees', () => {
    useEmployees.mockReturnValue({ employees: [], isLoading: false, error: null,
      fetchEmployees: jest.fn(), deleteEmployee: jest.fn(), pagination: {} })
    render(<EmployeeListScreen />, { wrapper: Wrapper })
    expect(screen.getByText(/no employees found/i)).toBeTruthy()
  })
})
```

## ─────────────────────────────────────────────────────────
## FLUTTER — flutter_test
## ─────────────────────────────────────────────────────────

```dart
// test/features/employees/employee_provider_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:myapp/features/employees/providers/employee_provider.dart';
import 'package:myapp/features/employees/services/employee_service.dart';

class MockEmployeeService extends Mock implements EmployeeService {}

void main() {
  late EmployeeProvider provider;
  late MockEmployeeService mockService;

  setUp(() {
    mockService = MockEmployeeService();
    provider = EmployeeProvider(service: mockService);
  });

  group('fetchEmployees', () {
    test('sets isLoading true then false', () async {
      when(mockService.getEmployees()).thenAnswer((_) async =>
          PaginatedResult(employees: [], total: 0, totalPages: 0));
      final loadingStates = <bool>[];
      provider.addListener(() => loadingStates.add(provider.isLoading));
      await provider.fetchEmployees();
      expect(loadingStates, containsAllInOrder([true, false]));
    });

    test('populates employees on success', () async {
      final mockData = [Employee(id: '1', firstName: 'Ahmed', email: 'a@t.com')];
      when(mockService.getEmployees()).thenAnswer((_) async =>
          PaginatedResult(employees: mockData, total: 1, totalPages: 1));
      await provider.fetchEmployees();
      expect(provider.employees, equals(mockData));
      expect(provider.error, isNull);
    });

    test('sets error message on failure', () async {
      when(mockService.getEmployees()).thenThrow(Exception('Network error'));
      await provider.fetchEmployees();
      expect(provider.error, isNotNull);
      expect(provider.employees, isEmpty);
    });
  });
}
```

## ─────────────────────────────────────────────────────────
## OUTPUT FORMAT
## ─────────────────────────────────────────────────────────

```
Tests written for: [file/feature name]
Framework: [Jest/Pytest/Flutter Test/RNTL]

Files created:
  ✅ tests/hooks/useEmployees.test.js     (12 tests)
  ✅ tests/components/EmployeeForm.test.jsx  (9 tests)
  ✅ tests/api/employees.test.js          (8 tests)

Coverage:
  useEmployees.js      — 100% of exported functions covered
  EmployeeForm.jsx     — all states (loading, error, create, edit) covered
  employeeController   — all 5 endpoints covered

Run tests:
  [test command from CLAUDE.md]
```
