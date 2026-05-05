# API Rules
# Applies to: src/api/** src/routes/** app/Http/Controllers/** api/**

## REST Conventions

### URLs
- Plural nouns for resources: `/users`, `/orders`, `/products`
- Nested for relationships: `/users/:id/orders`
- Kebab-case for multi-word: `/product-categories`
- Never verbs in URL: NOT `/getUsers`, `/createOrder`

### HTTP Methods
- `GET`    — read, never changes data
- `POST`   — create new resource
- `PUT`    — replace entire resource
- `PATCH`  — update specific fields
- `DELETE` — remove resource

### Status Codes
- `200` — success (GET, PUT, PATCH)
- `201` — created (POST)
- `204` — success, no content (DELETE)
- `400` — validation error (bad request)
- `401` — not authenticated (no/invalid token)
- `403` — not authorized (valid token, wrong permissions)
- `404` — resource not found
- `409` — conflict (e.g. email already exists)
- `422` — unprocessable entity (validation failed)
- `429` — too many requests (rate limited)
- `500` — server error (never expected, always log)

## Request & Response

### Always return JSON
```json
// Success
{ "data": { "id": 1, "name": "Ahmed" }, "error": null }

// Error
{ "data": null, "error": "Email already in use" }

// List
{ "data": [...], "pagination": { "page": 1, "total": 42 }, "error": null }
```

### Input Validation (every endpoint)
```js
// Validate BEFORE touching the database
const { error, value } = userSchema.validate(req.body)
if (error) return res.status(400).json({ data: null, error: error.message })
```

### What to strip from responses
- Password hashes
- Internal tokens
- Database internal IDs you don't want exposed
- Other users' private data

## Authentication & Authorization

```js
// Every protected route needs both:

// 1. Authentication — who are you?
router.use(requireAuth)  // verifies JWT, sets req.user

// 2. Authorization — are you allowed?
router.get('/orders/:id', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json(...)

  // Authorization check — is this order yours?
  if (order.userId !== req.user.id) {
    return res.status(403).json({ data: null, error: 'Access denied' })
  }

  res.json({ data: order })
})
```

## Performance

- Paginate all list endpoints — no unlimited data returns
  - Default page size: 20
  - Maximum page size: 100
  - Return: `{ data: [...], pagination: { page, limit, total, pages } }`
- Add DB indexes on fields used in WHERE and ORDER BY
- Use `select()` to return only needed fields
- Use transactions for operations that modify multiple tables

## Rate Limiting

Apply rate limiting to:
- Login endpoint: 5 attempts per minute per IP
- Password reset: 3 per hour per email
- Any expensive operation: define reasonable limit
