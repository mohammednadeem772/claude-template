# /document — Auto-Generate Documentation

## Usage
```
/document src/utils/helpers.js     # Document one file (inline JSDoc/docstrings)
/document src/api/                 # Document all files in folder
/document --readme                 # Generate/update README.md
/document --api                    # Generate API reference markdown
/document --changelog              # Generate CHANGELOG from git log
```

## Rules
- Read the ACTUAL code — never invent or assume behaviour
- Plain English — no unnecessary jargon
- Always include a usage example
- Mark deprecated functions with @deprecated
- Never document trivial getters/setters
- Keep descriptions under 2 sentences

## Output by Type

### Functions / Methods
Use JSDoc (JS) or docstrings (Python/PHP):
```js
/**
 * Calculates the discounted price for a product.
 *
 * @param {number} price - Original price in rupees
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Final price after discount
 *
 * @example
 * getDiscountedPrice(1000, 20) // returns 800
 */
```

### API Endpoints
```markdown
## POST /api/auth/login

Authenticates a user and returns a JWT token.

**Request body:**
| Field    | Type   | Required | Description        |
|----------|--------|----------|--------------------|
| email    | string | Yes      | User email address |
| password | string | Yes      | Min 8 characters   |

**Response 200:**
```json
{ "token": "eyJ...", "user": { "id": 1, "email": "..." } }
```

**Response 401:** Invalid credentials
**Response 422:** Validation error
```

### React Components
```markdown
## LoginForm

Login form with email, password, and remember-me option.

**Props:**
| Prop       | Type     | Default | Description             |
|------------|----------|---------|-------------------------|
| onSuccess  | function | –       | Called after login      |
| redirectTo | string   | '/'     | Where to go after login |

**Usage:**
```jsx
<LoginForm onSuccess={(user) => console.log(user)} redirectTo="/dashboard" />
```
```

### README Template
When --readme flag used:
1. Project title + one-line description
2. Tech stack badges
3. Prerequisites
4. Installation steps
5. Environment variables (from .env.example)
6. How to run (dev, test, build)
7. Folder structure
8. Contributing guide
9. License
