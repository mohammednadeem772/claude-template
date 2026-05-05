# [PROJECT_NAME]
# ─────────────────────────────────────────────
# INSTRUCTIONS: Replace every [PLACEHOLDER] with
# your real values before using Claude Code.
# Keep this file under 200 lines.
# ─────────────────────────────────────────────

## Project Overview
[One paragraph describing what this project does.
Example: "E-commerce platform for selling handmade crafts.
Users can browse, add to cart, and checkout via Stripe."]

## Tech Stack
- Frontend:  [React 18 / Vue 3 / Next.js 14 / plain HTML]
- Backend:   [Node.js + Express / Python + FastAPI / Laravel]
- Database:  [PostgreSQL / MongoDB / MySQL / SQLite]
- Styling:   [Tailwind CSS / CSS Modules / SCSS]
- Auth:      [JWT / NextAuth / Laravel Sanctum]
- Testing:   [Jest + RTL / Pytest / PHPUnit]
- Deploy:    [Vercel / Railway / Docker / VPS]

## Dev Commands
```bash
# Install dependencies
[npm install / pip install -r requirements.txt / composer install]

# Start development server
[npm run dev / python main.py / php artisan serve]

# Run tests
[npm test / pytest / php artisan test]

# Build for production
[npm run build / python manage.py collectstatic]

# Database migrations
[npx prisma migrate dev / python manage.py migrate / php artisan migrate]
```

## Folder Structure
```
[Describe YOUR project layout, e.g:]
src/
  components/     # Reusable UI components
  pages/          # Route-level pages
  api/            # API call functions
  hooks/          # Custom React hooks
  utils/          # Helper functions
  store/          # State management
tests/            # All test files
docs/             # Documentation
public/           # Static assets
```

## Coding Conventions
- Variable naming:   [camelCase / snake_case]
- Component naming:  [PascalCase]
- File naming:       [kebab-case / PascalCase]
- API style:         [REST / GraphQL / tRPC]
- CSS approach:      [Tailwind utility classes / BEM / CSS Modules]
- State management:  [React useState/Context / Redux / Zustand / Pinia]

## Key Rules (Claude MUST follow these)
1. Every new feature needs a test file
2. Never put secrets or API keys in code — use .env only
3. All API endpoints must validate input
4. Error messages must be user-friendly (no stack traces to UI)
5. Functions max 40 lines — split if longer
6. No console.log in production code
7. Always handle loading and error states in UI
8. Paginate list endpoints — never return unlimited data

## Important Context
[Write anything Claude needs to know about your specific project:
- Does it have multi-tenant architecture?
- Any payment system (Stripe, PayPal)?
- Any third-party APIs integrated?
- Any legacy code areas to avoid?
- Deployment constraints?]

## MCP Integrations
See mcp.json — GitHub and filesystem enabled by default.
Enable postgres/slack/playwright as needed.
