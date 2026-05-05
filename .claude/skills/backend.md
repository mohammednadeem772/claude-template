# Skill: Backend Development

## Auto-loads when Claude detects these tasks:
- "API banao / create API / create endpoint"
- "route banao / create route"
- "controller banao"
- "database se / from database"
- "server side / backend"

## Before Writing Any Backend Code

1. Check CLAUDE.md for:
   - Framework (Express / FastAPI / Laravel / etc.)
   - Database and ORM
   - Auth method (JWT / sessions)
   - API style (REST / GraphQL)

2. Check existing routes for patterns

3. Plan what's needed:
   - Route definition
   - Controller/handler function
   - Input validation schema
   - DB query / ORM call
   - Test file

## Every API Endpoint Must Have

- [ ] Input validation (before hitting DB)
- [ ] Authentication check (if protected)
- [ ] Authorization check (ownership check)
- [ ] Proper HTTP status codes
- [ ] Error handling with try/catch
- [ ] Correct response format (see api rules)
- [ ] Test file

## Standard Endpoint Structure (Express)

```js
// Route file: src/routes/auth.js
router.post('/login', validateLogin, authController.login)

// Validation middleware: src/middleware/validation.js
export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body)
  if (error) return res.status(400).json({ data: null, error: error.message })
  next()
}

// Controller: src/controllers/authController.js
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(401).json({ data: null, error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ data: null, error: 'Invalid credentials' })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({ data: { token, user: { id: user.id, email: user.email } }, error: null })

  } catch (error) {
    logger.error('Login failed', { email, error: error.message })
    res.status(500).json({ data: null, error: 'Login failed. Please try again.' })
  }
}
```

## Database Patterns

### Parameterized queries (NEVER string concatenate)
```js
// Wrong — SQL injection risk
db.query(`SELECT * FROM users WHERE email='${email}'`)

// Correct
db.query('SELECT * FROM users WHERE email = $1', [email])
```

### Transactions (multiple DB operations)
```js
const trx = await db.transaction()
try {
  await Order.create({ ...orderData }, { transaction: trx })
  await Cart.destroy({ where: { userId }, transaction: trx })
  await trx.commit()
} catch (err) {
  await trx.rollback()
  throw err
}
```
