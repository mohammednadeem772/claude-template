# /feature — Build a Complete Full-Stack Feature
#
# WORKS WITH:
#   React + Node.js/Express
#   Next.js (App Router + API Routes)
#   React + Python/FastAPI
#   React Native (mobile screens)
#   Flutter (mobile screens)
#
# USAGE EXAMPLES:
#   /feature create employee listing screen with form
#   /feature add appointment booking module with calendar
#   /feature build product inventory with search and filters
#   /feature create user role management screen
#   /feature add dashboard with charts and KPIs
#   /feature build push notification system (React Native)
#   /feature create onboarding flow (Flutter)

## ─────────────────────────────────────────────────────────
## STEP 0 — PLAN FIRST (MANDATORY — NO EXCEPTIONS)
## ─────────────────────────────────────────────────────────

Before creating a single file:

1. Read CLAUDE.md fully
   - What framework / stack is being used?
   - What is the folder structure?
   - What naming conventions apply?
   - What test framework is used?

2. Scan 2-3 existing similar files to match patterns
   - Find an existing list screen → match its structure
   - Find an existing form → match its validation style
   - Find an existing API route → match its response format
   - Find an existing model → match its field conventions

3. Detect the platform from CLAUDE.md or existing files:
   - Web (React / Next.js) → use HTML/JSX patterns
   - Mobile (React Native) → use View/Text/TouchableOpacity
   - Mobile (Flutter) → use Widget/Scaffold/Column

4. Print the plan and WAIT for approval:
   ```
   Feature Plan: [Feature Name]
   ─────────────────────────────
   Backend files:
     [ ] src/models/Employee.js
     [ ] src/routes/employees.js
     [ ] src/controllers/employeeController.js
     [ ] src/validators/employeeValidator.js
     [ ] tests/api/employees.test.js

   Frontend files:
     [ ] src/pages/employees/index.jsx
     [ ] src/components/employees/EmployeeList.jsx
     [ ] src/components/employees/EmployeeForm.jsx
     [ ] src/components/employees/EmployeeCard.jsx
     [ ] src/hooks/useEmployees.js
     [ ] tests/components/EmployeeList.test.jsx

   Config updates:
     [ ] src/routes/index.js  (add employee route)
     [ ] src/navigation/AppNavigator.js  (add screen)
   ─────────────────────────────
   
   ⚠️  APPROVAL REQUIRED — Proceed? (y/n)
   ```

## MANDATORY FEATURE RULES
- Plan first — show EXACT file list before coding
- Wait for user approval — NO exceptions
- Max 400 lines per file — hard limit (split if larger)
- Loading + Error + Empty states — mandatory in ALL data components
- Test file required — for EVERY new file created
- Never proceed without explicit approval

## ─────────────────────────────────────────────────────────
## STEP 1 — BACKEND (Node.js / Express / FastAPI / Next.js API)
## ─────────────────────────────────────────────────────────

### 1A — Model / Schema

#### Node.js + Mongoose
```js
// src/models/[Resource].js
import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema({
  firstName:    { type: String, required: true, trim: true },
  lastName:     { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  department:   { type: String, required: true },
  position:     { type: String, required: true },
  phone:        { type: String },
  joiningDate:  { type: Date, default: Date.now },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true })

employeeSchema.index({ department: 1 })
employeeSchema.index({ email: 1 })

export default mongoose.model('Employee', employeeSchema)
```

#### Node.js + Prisma
```prisma
// prisma/schema.prisma — add this model
model Employee {
  id          String   @id @default(cuid())
  firstName   String
  lastName    String
  email       String   @unique
  department  String
  position    String
  phone       String?
  joiningDate DateTime @default(now())
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
Then run: `npx prisma migrate dev --name add_employees`

#### Python + FastAPI + SQLAlchemy
```python
# app/models/employee.py
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Employee(Base):
    __tablename__ = "employees"

    id         = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String, nullable=False)
    last_name  = Column(String, nullable=False)
    email      = Column(String, unique=True, nullable=False, index=True)
    department = Column(String, nullable=False)
    position   = Column(String, nullable=False)
    phone      = Column(String, nullable=True)
    is_active  = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

#### Next.js + Prisma (same prisma schema as above)
API routes live in `app/api/[resource]/route.ts`

---

### 1B — Validation Schema

#### Node.js (Zod)
```js
// src/validators/employeeValidator.js
import { z } from 'zod'

export const createEmployeeSchema = z.object({
  firstName:   z.string().min(2, 'First name min 2 chars').max(50),
  lastName:    z.string().min(2, 'Last name min 2 chars').max(50),
  email:       z.string().email('Valid email required'),
  department:  z.string().min(1, 'Department is required'),
  position:    z.string().min(1, 'Position is required'),
  phone:       z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone').optional(),
  joiningDate: z.string().datetime().optional(),
})

export const updateEmployeeSchema = createEmployeeSchema.partial()

export const listEmployeeSchema = z.object({
  page:       z.coerce.number().min(1).default(1),
  limit:      z.coerce.number().min(1).max(100).default(20),
  search:     z.string().optional(),
  department: z.string().optional(),
  isActive:   z.coerce.boolean().optional(),
  sortBy:     z.enum(['firstName', 'createdAt', 'department']).default('createdAt'),
  sortOrder:  z.enum(['asc', 'desc']).default('desc'),
})
```

#### Python (Pydantic)
```python
# app/schemas/employee.py
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

class EmployeeCreate(BaseModel):
    first_name: str
    last_name:  str
    email:      EmailStr
    department: str
    position:   str
    phone:      Optional[str] = None

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name:  Optional[str] = None
    email:      Optional[EmailStr] = None
    department: Optional[str] = None
    position:   Optional[str] = None
    phone:      Optional[str] = None

class EmployeeResponse(EmployeeCreate):
    id:         str
    is_active:  bool
    created_at: datetime

    class Config:
        from_attributes = True

class PaginatedEmployees(BaseModel):
    data:       list[EmployeeResponse]
    total:      int
    page:       int
    limit:      int
    totalPages: int
```

---

### 1C — API Routes / Controller

#### Node.js + Express
```js
// src/controllers/employeeController.js
import Employee from '../models/Employee.js'
import { createEmployeeSchema, updateEmployeeSchema, listEmployeeSchema } from '../validators/employeeValidator.js'

// GET /api/employees
export const getEmployees = async (req, res) => {
  try {
    const query = listEmployeeSchema.parse(req.query)
    const { page, limit, search, department, isActive, sortBy, sortOrder } = query

    const filter = {}
    if (search)     filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName:  { $regex: search, $options: 'i' } },
      { email:     { $regex: search, $options: 'i' } },
    ]
    if (department) filter.department = department
    if (isActive !== undefined) filter.isActive = isActive

    const total     = await Employee.countDocuments(filter)
    const employees = await Employee.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v')

    res.json({
      data: { employees, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
      error: null,
    })
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ data: null, error: err.errors[0].message })
    console.error('getEmployees error:', err)
    res.status(500).json({ data: null, error: 'Failed to fetch employees' })
  }
}

// GET /api/employees/:id
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-__v')
    if (!employee) return res.status(404).json({ data: null, error: 'Employee not found' })
    res.json({ data: employee, error: null })
  } catch (err) {
    console.error('getEmployee error:', err)
    res.status(500).json({ data: null, error: 'Failed to fetch employee' })
  }
}

// POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const body = createEmployeeSchema.parse(req.body)
    const exists = await Employee.findOne({ email: body.email })
    if (exists) return res.status(409).json({ data: null, error: 'Email already in use' })
    const employee = await Employee.create(body)
    res.status(201).json({ data: employee, error: null })
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ data: null, error: err.errors[0].message })
    console.error('createEmployee error:', err)
    res.status(500).json({ data: null, error: 'Failed to create employee' })
  }
}

// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  try {
    const body = updateEmployeeSchema.parse(req.body)
    if (body.email) {
      const exists = await Employee.findOne({ email: body.email, _id: { $ne: req.params.id } })
      if (exists) return res.status(409).json({ data: null, error: 'Email already in use' })
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
    if (!employee) return res.status(404).json({ data: null, error: 'Employee not found' })
    res.json({ data: employee, error: null })
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ data: null, error: err.errors[0].message })
    console.error('updateEmployee error:', err)
    res.status(500).json({ data: null, error: 'Failed to update employee' })
  }
}

// DELETE /api/employees/:id  (soft delete)
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!employee) return res.status(404).json({ data: null, error: 'Employee not found' })
    res.json({ data: { message: 'Employee deactivated' }, error: null })
  } catch (err) {
    console.error('deleteEmployee error:', err)
    res.status(500).json({ data: null, error: 'Failed to delete employee' })
  }
}
```

```js
// src/routes/employees.js
import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import * as ctrl from '../controllers/employeeController.js'

const router = Router()
router.use(requireAuth)           // all routes protected

router.get('/',     ctrl.getEmployees)
router.get('/:id',  ctrl.getEmployee)
router.post('/',    ctrl.createEmployee)
router.put('/:id',  ctrl.updateEmployee)
router.delete('/:id', ctrl.deleteEmployee)

export default router
```

#### Python + FastAPI
```python
# app/routers/employees.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse, PaginatedEmployees
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/employees", tags=["employees"])

@router.get("/", response_model=PaginatedEmployees)
def list_employees(
    page:       int     = Query(1, ge=1),
    limit:      int     = Query(20, ge=1, le=100),
    search:     str     = Query(None),
    department: str     = Query(None),
    db:         Session = Depends(get_db),
    _user                = Depends(get_current_user),
):
    query = db.query(Employee).filter(Employee.is_active == True)
    if search:
        query = query.filter(
            Employee.first_name.ilike(f"%{search}%") |
            Employee.last_name.ilike(f"%{search}%")  |
            Employee.email.ilike(f"%{search}%")
        )
    if department:
        query = query.filter(Employee.department == department)

    total      = query.count()
    employees  = query.offset((page - 1) * limit).limit(limit).all()
    total_pages = (total + limit - 1) // limit

    return { "data": employees, "total": total, "page": page,
             "limit": limit, "totalPages": total_pages }

@router.post("/", response_model=EmployeeResponse, status_code=201)
def create_employee(
    body: EmployeeCreate,
    db:   Session = Depends(get_db),
    _user          = Depends(get_current_user),
):
    if db.query(Employee).filter(Employee.email == body.email).first():
        raise HTTPException(409, "Email already in use")
    employee = Employee(**body.dict())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee
```

#### Next.js App Router
```ts
// app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createEmployeeSchema, listEmployeeSchema } from '@/validators/employeeValidator'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const params  = Object.fromEntries(req.nextUrl.searchParams)
  const query   = listEmployeeSchema.parse(params)
  const { page, limit, search, department } = query

  const where: any = { isActive: true }
  if (search)     where.OR = [{ firstName: { contains: search, mode: 'insensitive' } }, { email: { contains: search } }]
  if (department) where.department = department

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.employee.count({ where }),
  ])

  return NextResponse.json({ data: { employees, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body     = createEmployeeSchema.parse(await req.json())
  const exists   = await prisma.employee.findUnique({ where: { email: body.email } })
  if (exists)    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })

  const employee = await prisma.employee.create({ data: body })
  return NextResponse.json({ data: employee }, { status: 201 })
}
```

---

## ─────────────────────────────────────────────────────────
## STEP 2 — FRONTEND (React / Next.js Web)
## ─────────────────────────────────────────────────────────

### 2A — Custom Hook (API logic lives here, NOT in components)
```js
// src/hooks/useEmployees.js
import { useState, useCallback } from 'react'
import api from '@/lib/api'   // or axios instance

export const useEmployees = () => {
  const [employees,  setEmployees]  = useState([])
  const [employee,   setEmployee]   = useState(null)
  const [isLoading,  setIsLoading]  = useState(false)
  const [error,      setError]      = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })

  const fetchEmployees = useCallback(async (params = {}) => {
    setIsLoading(true); setError(null)
    try {
      const res = await api.get('/employees', { params })
      setEmployees(res.data.data.employees)
      setPagination(res.data.data.pagination)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load employees')
    } finally { setIsLoading(false) }
  }, [])

  const fetchEmployee = useCallback(async (id) => {
    setIsLoading(true); setError(null)
    try {
      const res = await api.get(`/employees/${id}`)
      setEmployee(res.data.data)
      return res.data.data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load employee')
    } finally { setIsLoading(false) }
  }, [])

  const createEmployee = useCallback(async (data) => {
    setIsLoading(true); setError(null)
    try {
      const res = await api.post('/employees', data)
      return { success: true, data: res.data.data }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create employee'
      setError(msg)
      return { success: false, error: msg }
    } finally { setIsLoading(false) }
  }, [])

  const updateEmployee = useCallback(async (id, data) => {
    setIsLoading(true); setError(null)
    try {
      const res = await api.put(`/employees/${id}`, data)
      return { success: true, data: res.data.data }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update employee'
      setError(msg)
      return { success: false, error: msg }
    } finally { setIsLoading(false) }
  }, [])

  const deleteEmployee = useCallback(async (id) => {
    try {
      await api.delete(`/employees/${id}`)
      setEmployees(prev => prev.filter(e => e._id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete' }
    }
  }, [])

  return {
    employees, employee, isLoading, error, pagination,
    fetchEmployees, fetchEmployee, createEmployee, updateEmployee, deleteEmployee,
  }
}
```

### 2B — List Component
```jsx
// src/components/employees/EmployeeList.jsx
import { useEffect, useState } from 'react'
import { useEmployees } from '@/hooks/useEmployees'
import EmployeeForm from './EmployeeForm'

export default function EmployeeList() {
  const { employees, isLoading, error, pagination, fetchEmployees, deleteEmployee } = useEmployees()
  const [search,     setSearch]     = useState('')
  const [department, setDepartment] = useState('')
  const [page,       setPage]       = useState(1)
  const [showForm,   setShowForm]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  useEffect(() => {
    fetchEmployees({ page, search, department })
  }, [page, search, department])

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this employee?')) return
    const result = await deleteEmployee(id)
    if (!result.success) alert(result.error)
  }

  const handleEdit = (emp) => { setEditTarget(emp); setShowForm(true) }
  const handleCreate = () => { setEditTarget(null); setShowForm(true) }
  const handleFormClose = () => { setShowForm(false); fetchEmployees({ page, search, department }) }

  if (isLoading && employees.length === 0)
    return <div className="flex justify-center p-12"><Spinner /></div>

  if (error)
    return <ErrorState message={error} onRetry={() => fetchEmployees({ page, search, department })} />

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
        <button onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="text" placeholder="Search by name or email..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <select value={department} onChange={e => { setDepartment(e.target.value); setPage(1) }}
          className="border rounded-lg px-3 py-2 text-sm">
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      {/* Table */}
      {employees.length === 0 ? (
        <EmptyState message="No employees found" action="Add the first employee" onAction={handleCreate} />
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Department</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Position</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees.map(emp => (
                <tr key={emp._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{emp.firstName} {emp.lastName}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.email}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{emp.department}</span></td>
                  <td className="px-4 py-3 text-gray-600">{emp.position}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:underline mr-3 text-xs">Edit</button>
                    <button onClick={() => handleDelete(emp._id)} className="text-red-500 hover:underline text-xs">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 text-sm text-gray-600">
            <span>Showing {((page - 1) * pagination.limit) + 1}–{Math.min(page * pagination.limit, pagination.total)} of {pagination.total}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-40">← Prev</button>
              <span className="px-3 py-1">Page {page} of {pagination.totalPages}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= pagination.totalPages}
                className="px-3 py-1 border rounded disabled:opacity-40">Next →</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <EmployeeForm employee={editTarget} onClose={handleFormClose} />
      )}
    </div>
  )
}
```

### 2C — Form Component
```jsx
// src/components/employees/EmployeeForm.jsx
import { useState, useEffect } from 'react'
import { useEmployees } from '@/hooks/useEmployees'

const DEPARTMENTS = ['Engineering', 'HR', 'Sales', 'Finance', 'Operations']

export default function EmployeeForm({ employee, onClose }) {
  const isEditing = Boolean(employee)
  const { createEmployee, updateEmployee, isLoading } = useEmployees()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    department: '', position: '', phone: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (employee) setForm({
      firstName:  employee.firstName  || '',
      lastName:   employee.lastName   || '',
      email:      employee.email      || '',
      department: employee.department || '',
      position:   employee.position   || '',
      phone:      employee.phone      || '',
    })
  }, [employee])

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName  = 'First name is required'
    if (!form.lastName.trim())  errs.lastName   = 'Last name is required'
    if (!form.email.trim())     errs.email      = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.department)       errs.department = 'Department is required'
    if (!form.position.trim())  errs.position   = 'Position is required'
    return errs
  }

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(err => ({ ...err, [field]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const result = isEditing
      ? await updateEmployee(employee._id, form)
      : await createEmployee(form)

    if (result.success) onClose()
    else setErrors({ form: result.error })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.form && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{errors.form}</div>}

          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" error={errors.firstName}>
              <input value={form.firstName} onChange={handleChange('firstName')}
                placeholder="Ahmed" className={inputClass(errors.firstName)} />
            </Field>
            <Field label="Last Name" error={errors.lastName}>
              <input value={form.lastName} onChange={handleChange('lastName')}
                placeholder="Khan" className={inputClass(errors.lastName)} />
            </Field>
          </div>

          <Field label="Email" error={errors.email}>
            <input type="email" value={form.email} onChange={handleChange('email')}
              placeholder="ahmed@company.com" className={inputClass(errors.email)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Department" error={errors.department}>
              <select value={form.department} onChange={handleChange('department')}
                className={inputClass(errors.department)}>
                <option value="">Select...</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Position" error={errors.position}>
              <input value={form.position} onChange={handleChange('position')}
                placeholder="Senior Developer" className={inputClass(errors.position)} />
            </Field>
          </div>

          <Field label="Phone (optional)" error={errors.phone}>
            <input type="tel" value={form.phone} onChange={handleChange('phone')}
              placeholder="+92 300 1234567" className={inputClass(errors.phone)} />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
              {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
)

const inputClass = (error) =>
  `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-300'
  }`
```

---

## ─────────────────────────────────────────────────────────
## STEP 3 — REACT NATIVE (Mobile)
## ─────────────────────────────────────────────────────────

When stack is React Native, replace web components with native:

```jsx
// screens/EmployeeListScreen.jsx
import { View, Text, FlatList, TextInput, TouchableOpacity,
         StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { useEmployees } from '@/hooks/useEmployees'
import { useNavigation } from '@react-navigation/native'

export default function EmployeeListScreen() {
  const nav = useNavigation()
  const { employees, isLoading, error, pagination, fetchEmployees, deleteEmployee } = useEmployees()
  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)

  useEffect(() => { fetchEmployees({ page, search }) }, [page, search])

  const handleDelete = (id) => {
    Alert.alert('Confirm', 'Remove this employee?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteEmployee(id) },
    ])
  }

  if (isLoading && employees.length === 0)
    return <View style={s.center}><ActivityIndicator size="large" color="#3b82f6" /></View>

  return (
    <View style={s.container}>
      <TextInput style={s.search} placeholder="Search employees..."
        value={search} onChangeText={t => { setSearch(t); setPage(1) }} />

      <FlatList
        data={employees}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardInfo}>
              <Text style={s.name}>{item.firstName} {item.lastName}</Text>
              <Text style={s.sub}>{item.position} · {item.department}</Text>
              <Text style={s.email}>{item.email}</Text>
            </View>
            <View style={s.actions}>
              <TouchableOpacity onPress={() => nav.navigate('EmployeeForm', { employee: item })}>
                <Text style={s.editBtn}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={s.deleteBtn}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>No employees found</Text>}
        onEndReached={() => { if (page < pagination.totalPages) setPage(p => p + 1) }}
        onEndReachedThreshold={0.3}
      />

      <TouchableOpacity style={s.fab} onPress={() => nav.navigate('EmployeeForm')}>
        <Text style={s.fabText}>+ Add Employee</Text>
      </TouchableOpacity>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  search:    { margin: 16, padding: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  card:      { flexDirection: 'row', backgroundColor: '#fff', margin: 8, marginHorizontal: 16, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#f0f0f0' },
  cardInfo:  { flex: 1 },
  name:      { fontSize: 15, fontWeight: '600', color: '#111827' },
  sub:       { fontSize: 12, color: '#6b7280', marginTop: 2 },
  email:     { fontSize: 12, color: '#3b82f6', marginTop: 2 },
  actions:   { justifyContent: 'space-around' },
  editBtn:   { color: '#3b82f6', fontSize: 13, fontWeight: '500', marginBottom: 8 },
  deleteBtn: { color: '#ef4444', fontSize: 13, fontWeight: '500' },
  empty:     { textAlign: 'center', color: '#9ca3af', marginTop: 60 },
  fab:       { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 50, elevation: 4 },
  fabText:   { color: '#fff', fontWeight: '600' },
})
```

---

## ─────────────────────────────────────────────────────────
## STEP 4 — FLUTTER (Mobile)
## ─────────────────────────────────────────────────────────

When stack is Flutter:

```dart
// lib/features/employees/screens/employee_list_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/employee_provider.dart';
import '../widgets/employee_card.dart';
import '../widgets/employee_form.dart';

class EmployeeListScreen extends StatefulWidget {
  const EmployeeListScreen({super.key});

  @override
  State<EmployeeListScreen> createState() => _EmployeeListScreenState();
}

class _EmployeeListScreenState extends State<EmployeeListScreen> {
  final _searchCtrl  = TextEditingController();
  String _department = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<EmployeeProvider>().fetchEmployees();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Employees'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showForm(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchCtrl,
              decoration: InputDecoration(
                hintText: 'Search employees...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true, fillColor: Colors.white,
              ),
              onChanged: (v) => context.read<EmployeeProvider>()
                  .fetchEmployees(search: v),
            ),
          ),

          // List
          Expanded(
            child: Consumer<EmployeeProvider>(
              builder: (_, provider, __) {
                if (provider.isLoading) return const Center(child: CircularProgressIndicator());
                if (provider.error != null) return Center(child: Text(provider.error!));
                if (provider.employees.isEmpty) return const Center(child: Text('No employees found'));

                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: provider.employees.length,
                  itemBuilder: (_, i) => EmployeeCard(
                    employee: provider.employees[i],
                    onEdit:   () => _showForm(context, employee: provider.employees[i]),
                    onDelete: () => _confirmDelete(context, provider.employees[i].id),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _showForm(BuildContext ctx, {employee}) {
    showModalBottomSheet(
      context: ctx,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => EmployeeForm(employee: employee),
    );
  }

  void _confirmDelete(BuildContext ctx, String id) {
    showDialog(
      context: ctx,
      builder: (_) => AlertDialog(
        title: const Text('Remove Employee'),
        content: const Text('Are you sure you want to deactivate this employee?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () { ctx.read<EmployeeProvider>().deleteEmployee(id); Navigator.pop(ctx); },
            child: const Text('Remove', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}
```

```dart
// lib/features/employees/providers/employee_provider.dart
import 'package:flutter/foundation.dart';
import '../models/employee.dart';
import '../services/employee_service.dart';

class EmployeeProvider extends ChangeNotifier {
  List<Employee> employees = [];
  bool    isLoading = false;
  String? error;
  int     page = 1, totalPages = 1;

  final _service = EmployeeService();

  Future<void> fetchEmployees({ String? search, String? department, int page = 1 }) async {
    isLoading = true; error = null; notifyListeners();
    try {
      final result = await _service.getEmployees(
        page: page, search: search, department: department);
      employees  = result.employees;
      totalPages = result.totalPages;
      this.page  = page;
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false; notifyListeners();
    }
  }

  Future<void> createEmployee(Map<String, dynamic> data) async {
    final emp = await _service.createEmployee(data);
    employees.insert(0, emp);
    notifyListeners();
  }

  Future<void> updateEmployee(String id, Map<String, dynamic> data) async {
    final updated = await _service.updateEmployee(id, data);
    final index = employees.indexWhere((e) => e.id == id);
    if (index != -1) { employees[index] = updated; notifyListeners(); }
  }

  Future<void> deleteEmployee(String id) async {
    await _service.deleteEmployee(id);
    employees.removeWhere((e) => e.id == id);
    notifyListeners();
  }
}
```

---

## ─────────────────────────────────────────────────────────
## STEP 5 — TESTS
## ─────────────────────────────────────────────────────────

Always create tests. Match the framework found in the project.

### Backend (Jest/Supertest)
```js
// tests/api/employees.test.js
describe('Employee API', () => {
  describe('GET /api/employees', () => {
    it('returns paginated list', async () => { ... })
    it('filters by search term', async () => { ... })
    it('returns 401 without auth', async () => { ... })
  })
  describe('POST /api/employees', () => {
    it('creates employee with valid data → 201', async () => { ... })
    it('returns 400 for missing required fields', async () => { ... })
    it('returns 409 for duplicate email', async () => { ... })
  })
  describe('PUT /api/employees/:id', () => {
    it('updates employee → 200', async () => { ... })
    it('returns 404 for unknown id', async () => { ... })
  })
  describe('DELETE /api/employees/:id', () => {
    it('soft-deletes employee → 200', async () => { ... })
  })
})
```

### Frontend (Vitest/RTL)
```js
// tests/components/EmployeeList.test.jsx
describe('EmployeeList', () => {
  it('shows loading skeleton on mount')
  it('renders employee rows from API')
  it('shows empty state when no data')
  it('shows error state when API fails')
  it('opens form when Add Employee clicked')
  it('filters list when search input changes')
  it('changes page when pagination clicked')
})
```

---

## COMPLETION SUMMARY (always show this)

```
✅ Feature complete: [Feature Name]

Backend:
  ✅ Model / Schema
  ✅ Validation
  ✅ CRUD API endpoints (5 routes)
  ✅ Auth + authorization
  ✅ Backend tests

Frontend ([web/mobile]):
  ✅ Custom hook (API + state)
  ✅ List screen with search, filter, pagination
  ✅ Create / Edit form with validation
  ✅ Loading / Error / Empty states
  ✅ Frontend tests

Config:
  ✅ Route registered
  ✅ Navigation updated

Run now:
  [migration command if needed]
  [dev server command]
  [test command]
```
