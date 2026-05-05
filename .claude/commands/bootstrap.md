# /bootstrap — Scaffold New Feature, Component, or Module

## Usage
```
/bootstrap feature user-profile     # Full feature (route + component + api + test)
/bootstrap component Button         # Single UI component + test
/bootstrap api /users               # API endpoint + handler + validation + test
/bootstrap model Order              # Data model + migration + test
/bootstrap page Dashboard           # Full page component + route + test
/bootstrap hook useCart             # Custom React/Vue hook + test
```

## Rules
- Match EVERY naming convention from CLAUDE.md
- Always create a corresponding test file
- Add new file to index/barrel file if one exists
- NEVER overwrite existing files — check first, warn if exists
- Follow the folder structure defined in CLAUDE.md

## What Gets Generated

### /bootstrap feature [name]
Creates complete feature folder:
```
src/features/[name]/
  index.js              # Public exports
  [Name]Page.jsx        # Page component
  [Name]Form.jsx        # Form component (if needed)
  use[Name].js          # Custom hook (business logic)
  [name].api.js         # API calls
  [name].test.js        # Tests for all of the above
```

### /bootstrap component [Name]
```
src/components/[Name]/
  [Name].jsx            # Component
  [Name].test.jsx       # Tests
  index.js              # Export
```
Component must have:
- PropTypes or TypeScript interface
- Loading state (if async)
- Error state
- Empty state (if shows a list)
- Accessible (labels, keyboard nav)

### /bootstrap api [/path]
```
src/api/[resource].js   # API handler
src/api/[resource].validation.js  # Input validation
tests/api/[resource].test.js      # Tests
```
Endpoint must have:
- Input validation
- Authentication check
- Proper HTTP status codes
- Error handling
- JSDoc comment

### /bootstrap model [Name]
```
src/models/[Name].js    # Model/Schema definition
migrations/[timestamp]_create_[name]s.js  # DB migration
tests/models/[Name].test.js               # Model tests
```

### /bootstrap page [Name]
```
src/pages/[Name].jsx    # Page component
src/pages/[Name].test.jsx  # Page tests
```
Add route automatically if router config file exists.

## After Scaffolding
Always show:
```
Created files:
  ✅ src/components/Button/Button.jsx
  ✅ src/components/Button/Button.test.jsx
  ✅ src/components/Button/index.js

Next steps:
  1. Fill in the component logic
  2. Run: npm test src/components/Button/
  3. Import: import Button from '@/components/Button'
```
