# [PROJECT_NAME]

## Project Overview
[One paragraph: what this project does, who uses it, main purpose.]

## Tech Stack
- Frontend: [React / Vue / Next.js / React Native]
- Backend: [Node.js + Express / Python + FastAPI / Laravel / none]
- Database: [PostgreSQL / MySQL / SQLite / MongoDB / none]
- Styling: [Tailwind CSS / NativeWind / CSS Modules / SCSS]
- Auth: [JWT / NextAuth / Sanctum / none]
- Testing: [Jest / Pytest / PHPUnit]
- Deploy: [Vercel / Railway / Docker / VPS]

## Dev Commands
```
# Install dependencies
[npm install / pip install -r requirements.txt / composer install]

# Start dev server
[npm run dev / python main.py / php artisan serve]

# Run tests
[npm test / pytest / php artisan test]

# Build for production
[npm run build]

# Database migrations
[npx prisma migrate dev / python manage.py migrate]
```

## Folder Structure
```
[Describe YOUR project layout, e.g:]
src/
  components/     ← reusable UI components
  features/       ← feature modules
  hooks/          ← custom hooks
  services/       ← API and data logic
  store/          ← state management
  utils/          ← helpers
  config/         ← app configuration
```

## Coding Conventions
- Variable naming: [camelCase / snake_case]
- Component naming: PascalCase
- File naming: [kebab-case / PascalCase]
- API style: [REST / GraphQL]
- State management: [Redux / Zustand / Context]
- Max file length: [150-300 lines depending on type]
- No inline styles — [Tailwind / NativeWind] className only
- No inline business logic — hooks and services only

## Key Rules (Claude MUST follow)
1. Never put secrets or API keys in code — .env only
2. Every new feature needs a test file
3. All API endpoints must validate input
4. Always handle loading + error + empty states in UI
5. No console.log in production code
6. Reuse existing components — never duplicate
7. Functions max 40 lines — split if longer
8. Paginate all list endpoints — never unlimited data
9. Follow existing architecture — never assume structure
10. Read this file at the start of every session

## Important Context
[Write what Claude needs to know:
- Multi-tenant? SaaS? Single user?
- Payment system (Stripe, PayPal)?
- Third-party APIs integrated?
- Legacy areas to avoid?
- Deployment constraints?
- Special rules for this project?]

## Source of Truth Priority
1. CLAUDE.md (this file)
2. Active approved task
3. Existing architecture
4. User prompt

## File Line Limits
- components/ → max 150 lines
- screens/ or pages/ → max 200 lines
- hooks/ → max 80 lines
- services/ → max 120 lines
- store/slices/ → max 100 lines

Verify: wc -l CLAUDE.md
Must be under 200 lines.
