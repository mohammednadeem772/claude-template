# Skill: Backend Development

## Auto-loads when

Keywords: "API", "route", "controller", "database", "server side", "backend"

## Before Writing Backend Code

1. Check CLAUDE.md: framework, database/ORM, auth method, API style
2. Check existing routes for patterns
3. Plan: route + controller + validation + test

## Every API Endpoint Must Have

- Input validation (before DB)
- Authentication + Authorization checks
- Proper HTTP status codes
- Error handling (try/catch)
- Test file

## Standard Structure

```js
// Route
router.post('/login', validateLogin, authController.login)

// Controller
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
    res.status(500).json({ data: null, error: 'Login failed' })
  }
}
```

## Database Patterns

**Parameterized queries (NEVER string concatenate):**
```js
// Wrong — SQL injection
db.query(`SELECT * FROM users WHERE email='${email}'`)

// Correct
db.query('SELECT * FROM users WHERE email = $1', [email])
```

**Transactions:**
```js
const trx = await db.transaction()
try {
  await Order.create({ ...data }, { transaction: trx })
  await Cart.destroy({ where: { userId }, transaction: trx })
  await trx.commit()
} catch (err) {
  await trx.rollback()
  throw err
}
```

## Response Format

```json
// Success: { "data": { "id": 1 }, "error": null }
// Error: { "data": null, "error": "Email already in use" }
// List: { "data": [...], "pagination": { "page": 1, "total": 42 }, "error": null }
```
