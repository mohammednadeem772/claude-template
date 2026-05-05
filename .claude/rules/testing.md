# Testing Rules
# Applies to: tests/** __tests__/** *.test.* *.spec.*

## Test Structure

### Naming
- Describe block: name of function/component/module
- Test name: "should [do X] when [condition Y]"
- Be specific: NOT "works correctly" — YES "returns 0 when cart is empty"

### Pattern: Arrange → Act → Assert
```js
it('should apply discount when user has promo code', () => {
  // Arrange — set up the scenario
  const cart = { items: [{ price: 1000 }] }
  const promoCode = 'SAVE20'

  // Act — do the thing
  const result = applyPromo(cart, promoCode)

  // Assert — check the result
  expect(result.total).toBe(800)
  expect(result.discount).toBe(200)
})
```

## What to Test

### Functions/Utilities
- Happy path (normal valid input)
- Edge cases: `null`, `undefined`, `0`, `""`, `[]`, very large numbers
- Error cases: invalid input, what should it throw or return?
- Boundary values: exactly at the limit, one above, one below

### API Endpoints (integration tests)
- 200/201 with valid data
- 400 with missing required fields
- 400 with invalid field values (wrong type, too long, etc.)
- 401 with no auth token
- 403 with wrong user's token
- 404 with non-existent ID
- 422 with valid JSON but business rule violation

### React/Vue Components
- Renders without crashing (smoke test)
- Shows correct content from props
- Handles user events (click, type, submit)
- Shows loading state while fetching
- Shows error state when fetch fails
- Shows empty state when no data
- Accessibility: inputs have labels

## What NOT to Test
- Library code (axios, lodash, React itself)
- Implementation details (internal state, private methods)
- Trivial getters/setters with no logic
- Things that would require rewriting the test for every refactor

## Mocking Rules
- Mock ALL external dependencies: DB, APIs, email, SMS, payment, time
- NEVER hit real databases or APIs in unit tests
- Integration tests MAY use a test database (never production)
- Reset ALL mocks between tests (beforeEach/afterEach)
- Don't mock what you're testing

```js
// Correct — mock the dependency, test the function
jest.mock('../api/users')
import { getUser } from '../api/users'
getUser.mockResolvedValue({ id: 1, name: 'Ahmed' })
```

## Coverage Goals
- Business logic (utils, services): > 80%
- Security-critical code (auth, payments): 100%
- UI components: > 70%
- Coverage is a GUIDE, not the goal — meaningful tests matter more

## Test Independence
- Tests must pass in any order
- Tests must not share mutable state
- Each test creates its own data
- Each test cleans up after itself
