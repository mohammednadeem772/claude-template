#!/usr/bin/env node
// init.js — Claude Template Installer
// Usage: node init.js (run from inside your project)

const fs   = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// ── Colors ──────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',  bold:  '\x1b[1m',
  green:  '\x1b[32m', yellow:'\x1b[33m',
  blue:   '\x1b[34m', cyan:  '\x1b[36m',
  gray:   '\x1b[90m', red:   '\x1b[31m',
}
const ok   = m => console.log(`  ${c.green}✅${c.reset} ${m}`)
const warn = m => console.log(`  ${c.yellow}⚠ ${c.reset} ${m}`)
const info = m => console.log(`  ${c.blue}→${c.reset}  ${m}`)
const skip = m => console.log(`  ${c.gray}–  ${m}${c.reset}`)
const bold = m => `${c.bold}${m}${c.reset}`
const log  = m => console.log(m || '')

// ── Paths ────────────────────────────────────────────────────
// __dirname = wherever init.js lives (inside cloned template)
const TEMPLATE_DIR = __dirname
const TARGET_DIR   = process.cwd()

// ── Helpers ──────────────────────────────────────────────────
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    entry.isDirectory() ? copyDir(s, d) : copyFileIfMissing(s, d)
  }
}

function copyFileIfMissing(src, dest) {
  const rel = path.relative(TARGET_DIR, dest)
  if (fs.existsSync(dest)) {
    skip(`${rel}  (already exists — kept yours)`)
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    ok(rel)
  }
}

function makeExecutable(p) {
  try {
    fs.chmodSync(p, '755')
  } catch {
    // chmod not supported on Windows — skipping silently
  }
}

function detectStack() {
  try {
    const pkg  = JSON.parse(fs.readFileSync(path.join(TARGET_DIR, 'package.json'), 'utf8'))
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    if (deps['react-native'])             return 'react-native'
    if (deps['next'])                     return 'nextjs'
    if (deps['react'])                    return 'react'
  } catch {}
  if (fs.existsSync(path.join(TARGET_DIR, 'pubspec.yaml')))    return 'flutter'
  if (fs.existsSync(path.join(TARGET_DIR, 'requirements.txt'))) return 'python'
  if (fs.existsSync(path.join(TARGET_DIR, 'artisan')))          return 'laravel'
  if (fs.existsSync(path.join(TARGET_DIR, 'go.mod')))           return 'go'
  return 'node'
}

function getProjectName() {
  try {
    return JSON.parse(fs.readFileSync(path.join(TARGET_DIR, 'package.json'), 'utf8')).name
      || path.basename(TARGET_DIR)
  } catch {
    return path.basename(TARGET_DIR)
  }
}

// ── Generate CLAUDE.md from detected stack ───────────────────
function generateClaudeMd(projectName, stack) {
  const stackConfigs = {
    'react-native': {
      frontend: 'React Native',
      backend: 'Node.js + Express (if needed)',
      database: 'SQLite (local) / PostgreSQL (remote)',
      styling: 'NativeWind (Tailwind CSS for RN) — className only, no StyleSheet.create',
      auth: 'JWT + react-native-keychain',
      testing: 'Jest + React Native Testing Library',
      deploy: 'EAS Build / React Native CLI',
      install: 'npm install',
      dev: 'npx react-native start',
      test: 'npm test',
      build: 'npx react-native run-android / run-ios',
      migrate: '# No migrations (SQLite auto-init)',
      conventions: [
        'No inline styles — NativeWind className only',
        'No StyleSheet.create — ever',
        'State → Redux Toolkit (useAppDispatch / useAppSelector)',
        'Business logic → custom hooks only, never in components',
        'Navigation → React Navigation v6',
      ],
      limits: 'components/ → 150 | screens/ → 200 | hooks/ → 80 | services/ → 120',
    },
    'nextjs': {
      frontend: 'Next.js 14 (App Router)',
      backend: 'Next.js API Routes (app/api/)',
      database: 'PostgreSQL + Prisma',
      styling: 'Tailwind CSS — className only, no inline styles',
      auth: 'NextAuth.js / getServerSession',
      testing: 'Jest + React Testing Library',
      deploy: 'Vercel / Railway',
      install: 'npm install',
      dev: 'npm run dev',
      test: 'npm test',
      build: 'npm run build',
      migrate: 'npx prisma migrate dev',
      conventions: [
        'API routes → app/api/[resource]/route.ts only',
        'Auth → getServerSession on every protected route',
        'DB → Prisma only, no raw SQL',
        'Styling → Tailwind className only',
        'Server components by default, client only when needed',
      ],
      limits: 'components/ → 150 | pages/ → 200 | hooks/ → 80 | lib/ → 120',
    },
    'react': {
      frontend: 'React 18 + TypeScript',
      backend: 'Node.js + Express (separate)',
      database: 'PostgreSQL / MongoDB',
      styling: 'Tailwind CSS — className only, no inline styles',
      auth: 'JWT tokens',
      testing: 'Jest + React Testing Library',
      deploy: 'Vercel / Netlify / Docker',
      install: 'npm install',
      dev: 'npm run dev',
      test: 'npm test',
      build: 'npm run build',
      migrate: '# Add your migration command',
      conventions: [
        'Logic → custom hooks, never inside components',
        'Styling → Tailwind className only',
        'State → Redux Toolkit / Zustand',
        'API calls → services/ folder only',
      ],
      limits: 'components/ → 150 | pages/ → 200 | hooks/ → 80 | services/ → 120',
    },
    'flutter': {
      frontend: 'Flutter (Dart)',
      backend: 'Node.js + Express / FastAPI',
      database: 'SQLite (local) / PostgreSQL (remote)',
      styling: 'Flutter Theme system — Theme.of(context) only',
      auth: 'JWT + flutter_secure_storage',
      testing: 'Flutter Test + Mockito',
      deploy: 'Play Store / App Store / Firebase Distribution',
      install: 'flutter pub get',
      dev: 'flutter run',
      test: 'flutter test',
      build: 'flutter build apk / ios',
      migrate: '# No migrations (SQLite auto-init)',
      conventions: [
        'State → Provider / Bloc — match existing pattern',
        'Colors → Theme.of(context) only — never hardcoded',
        'Navigation → GoRouter or Navigator — match existing setup',
        'Widgets → separate files, max 200 lines each',
      ],
      limits: 'widgets/ → 150 | screens/ → 200 | blocs/ → 120 | services/ → 120',
    },
    'python': {
      frontend: '[Add your frontend or none]',
      backend: 'Python + FastAPI / Django',
      database: 'PostgreSQL + SQLAlchemy / Django ORM',
      styling: '[Add if applicable]',
      auth: 'JWT + python-jose / Django auth',
      testing: 'Pytest',
      deploy: 'Docker / Railway / VPS',
      install: 'pip install -r requirements.txt',
      dev: 'uvicorn main:app --reload / python manage.py runserver',
      test: 'pytest',
      build: 'docker build .',
      migrate: 'alembic upgrade head / python manage.py migrate',
      conventions: [
        'API → FastAPI routers / Django views only',
        'DB → SQLAlchemy models / Django ORM — no raw SQL',
        'Validation → Pydantic schemas on every endpoint',
        'Auth → JWT middleware on all protected routes',
      ],
      limits: 'routers/ → 120 | models/ → 100 | services/ → 120 | tests/ → 200',
    },
    'laravel': {
      frontend: 'Blade / Vue / React (Inertia)',
      backend: 'Laravel (PHP)',
      database: 'MySQL / PostgreSQL',
      styling: 'Tailwind CSS',
      auth: 'Laravel Sanctum / Breeze',
      testing: 'PHPUnit / Pest',
      deploy: 'Forge / Vapor / Docker',
      install: 'composer install && npm install',
      dev: 'php artisan serve',
      test: 'php artisan test',
      build: 'npm run build',
      migrate: 'php artisan migrate',
      conventions: [
        'Business logic → Service classes only',
        'DB → Eloquent ORM — no raw queries',
        'Auth → Sanctum middleware on protected routes',
        'Validation → Form Request classes',
      ],
      limits: 'Controllers/ → 100 | Services/ → 120 | Models/ → 100 | tests/ → 200',
    },
    'node': {
      frontend: '[Add your frontend or none]',
      backend: 'Node.js + Express / Fastify',
      database: 'PostgreSQL + Prisma / MongoDB',
      styling: '[Add if applicable]',
      auth: 'JWT tokens',
      testing: 'Jest / Vitest',
      deploy: 'Railway / Render / Docker / VPS',
      install: 'npm install',
      dev: 'npm run dev',
      test: 'npm test',
      build: 'npm run build',
      migrate: 'npx prisma migrate dev',
      conventions: [
        'All API URLs → src/config/endpoints.ts — never inline',
        'Auth → JWT middleware on every protected route',
        'DB → Parameterized queries only — no string concat',
        'Validation → Zod / Joi on every endpoint',
      ],
      limits: 'routes/ → 80 | controllers/ → 100 | services/ → 120 | models/ → 80',
    },
  }

  const cfg = stackConfigs[stack] || stackConfigs['node']

  return `# ${projectName}

## Project Overview
[One paragraph: what this project does, who uses it, main purpose.]

## Tech Stack
- Frontend: ${cfg.frontend}
- Backend: ${cfg.backend}
- Database: ${cfg.database}
- Styling: ${cfg.styling}
- Auth: ${cfg.auth}
- Testing: ${cfg.testing}
- Deploy: ${cfg.deploy}

## Dev Commands
\`\`\`
# Install dependencies
${cfg.install}

# Start dev server
${cfg.dev}

# Run tests
${cfg.test}

# Build for production
${cfg.build}

# Database migrations
${cfg.migrate}
\`\`\`

## Folder Structure
\`\`\`
[Describe YOUR project layout here]
src/
  components/     <- reusable UI components
  features/       <- feature modules
  hooks/          <- custom hooks
  services/       <- API and data logic
  store/          <- state management
  utils/          <- helpers
  config/         <- app configuration
\`\`\`

## Coding Conventions
${cfg.conventions.map(c => `- ${c}`).join('\n')}
- No inline business logic — hooks and services only
- Component naming: PascalCase
- No console.log in production code

## Key Rules (Claude MUST follow)
1. Never put secrets or API keys in code — .env only
2. Every new feature needs a test file
3. All API endpoints must validate input
4. Always handle loading + error + empty states in UI
5. Reuse existing components — never duplicate
6. Functions max 40 lines — split if longer
7. Follow existing architecture — never assume structure
8. Read this file at the start of every session
9. At session start — silently read .claude/skills/auto-selector.md
   and apply skill patterns throughout the session

## Important Context
[Add project-specific details:
- Multi-tenant? SaaS? Single user?
- Payment system (Stripe, PayPal)?
- Third-party APIs?
- Legacy areas to avoid?
- Special rules for this project?]

## Source of Truth Priority
1. CLAUDE.md (this file)
2. Active approved task
3. Existing architecture
4. User prompt

## File Line Limits
${cfg.limits}

## Auto-Load Skills
Read silently at session start and apply throughout:
- .claude/skills/auto-selector.md      — always active
- .claude/skills/debugging-patterns.md — when fixing bugs
- .claude/skills/incremental-builder.md — when building features
- .claude/skills/deploy-guard.md        — before any deploy
- .claude/skills/recovery-engine.md     — when steps fail
- .claude/skills/error-analyzer.md      — when errors appear
- .claude/skills/token-optimizer.md     — when context is long
`
}

// ── Main ─────────────────────────────────────────────────────
function main() {
  log()
  log(`${c.bold}${c.cyan}╔══════════════════════════════════════════╗${c.reset}`)
  log(`${c.bold}${c.cyan}║     Claude Code Template Installer       ║${c.reset}`)
  log(`${c.bold}${c.cyan}╚══════════════════════════════════════════╝${c.reset}`)
  log()

  const stack       = detectStack()
  const projectName = getProjectName()

  // Guard: don't run inside the template repo itself
  if (path.resolve(TARGET_DIR) === path.resolve(TEMPLATE_DIR)) {
    warn('You are inside the template repo — run this from your project folder.')
    warn(`cd /path/to/your-project && node ${path.relative(TARGET_DIR, __filename)}`)
    process.exit(1)
  }

  info(`Project : ${bold(projectName)}`)
  info(`Stack   : ${bold(stack)}`)
  info(`Target  : ${bold(TARGET_DIR)}`)
  log()

  // ── 1. Copy .claude/ ────────────────────────────────────────
  log(`${c.bold}Setting up .claude/ folder...${c.reset}`)
  const srcClaude  = path.join(TEMPLATE_DIR, '.claude')
  const destClaude = path.join(TARGET_DIR,   '.claude')
  copyDir(srcClaude, destClaude)
  log()

  // ── 2. Make hooks executable ────────────────────────────────
  log(`${c.bold}Making hooks executable...${c.reset}`)
  const hooksDir = path.join(destClaude, 'hooks')
  if (fs.existsSync(hooksDir)) {
    for (const f of fs.readdirSync(hooksDir)) {
      if (f.endsWith('.sh')) {
        const isWindows = process.platform === 'win32'
        makeExecutable(path.join(hooksDir, f))
        ok(`.claude/hooks/${f} — ${isWindows ? 'copied (chmod skipped on Windows)' : 'executable'}`)
      }
    }
  }
  log()

  // ── 3. CLAUDE.md — only if missing ──────────────────────────
  log(`${c.bold}Checking CLAUDE.md...${c.reset}`)
  const claudeMdDest = path.join(TARGET_DIR, 'CLAUDE.md')
  if (fs.existsSync(claudeMdDest)) {
    skip(`CLAUDE.md already exists — ${c.green}your file is untouched${c.reset}`)
  } else {
    const content = generateClaudeMd(projectName, stack)
    fs.writeFileSync(claudeMdDest, content)
    ok(`CLAUDE.md created — ${c.yellow}stack: ${stack} detected — fill in Important Context${c.reset}`)
  }
  log()

  // ── 4. .env.example — only if missing ───────────────────────
  log(`${c.bold}Checking .env.example...${c.reset}`)
  const envDest = path.join(TARGET_DIR, '.env.example')
  const envSrc  = path.join(TEMPLATE_DIR, '.env.example')
  if (fs.existsSync(envDest)) {
    skip(`.env.example already exists — kept yours`)
  } else if (fs.existsSync(envSrc)) {
    fs.copyFileSync(envSrc, envDest)
    ok(`.env.example created`)
  }
  log()

  // ── 5. .gitignore — append Claude entries ───────────────────
  log(`${c.bold}Updating .gitignore...${c.reset}`)
  const gitignorePath = path.join(TARGET_DIR, '.gitignore')
  const claudeEntries = [
    '',
    '# Claude Code',
    'CLAUDE.local.md',
    '.claude/settings.local.json',
    '.claude/session.log',
    '.claude/deploys.log',
  ].join('\n')

  if (fs.existsSync(gitignorePath)) {
    const existing = fs.readFileSync(gitignorePath, 'utf8')
    if (existing.includes('CLAUDE.local.md')) {
      skip(`.gitignore already has Claude entries`)
    } else {
      fs.appendFileSync(gitignorePath, claudeEntries)
      ok(`.gitignore updated`)
    }
  } else {
    fs.writeFileSync(gitignorePath, claudeEntries.trimStart())
    ok(`.gitignore created`)
  }
  log()

  // ── 6. Stack-specific tips ───────────────────────────────────
  const tips = {
    'react-native': [
      'Styling    → NativeWind className only (no StyleSheet.create)',
      'Redux      → useAppDispatch / useAppSelector only',
      'GPS        → Always through useHybridLocation',
      'File limit → 400 lines max per file',
      'Imports    → Relative paths only (no @/ aliases)',
    ],
    'nextjs': [
      'API routes → app/api/[resource]/route.ts',
      'Auth       → getServerSession on every protected route',
      'DB         → Prisma migrations before testing',
      'Styling    → Tailwind className only',
    ],
    'react': [
      'Logic      → Custom hooks, not inside components',
      'Styling    → Tailwind className only',
      'State      → Redux / Zustand — check existing store',
    ],
    'flutter': [
      'State      → Provider/Bloc — match existing pattern',
      'Colors     → Theme.of(context) only',
      'Navigation → Match existing GoRouter or Navigator setup',
    ],
    'python': [
      'API        → Check FastAPI vs Django/DRF',
      'DB         → SQLAlchemy or Django ORM',
      'Validation → Pydantic schemas on every endpoint',
    ],
    'node': [
      'URLs       → All in endpoints.ts — never inline',
      'Auth       → JWT middleware on protected routes',
      'DB         → Parameterized queries — no string concat',
    ],
  }

  log(`${c.bold}${c.cyan}Stack tips for ${stack}:${c.reset}`)
  for (const tip of (tips[stack] || tips['node'])) {
    info(tip)
  }
  log()

  // ── Done ─────────────────────────────────────────────────────
  log(`${c.bold}${c.green}╔══════════════════════════════════════════╗${c.reset}`)
  log(`${c.bold}${c.green}║   Claude Code Template Ready!            ║${c.reset}`)
  log(`${c.bold}${c.green}╚══════════════════════════════════════════╝${c.reset}`)
  log()

  const hasClaude = fs.existsSync(path.join(TARGET_DIR, 'CLAUDE.md'))
  const needsEdit = hasClaude && fs.readFileSync(path.join(TARGET_DIR, 'CLAUDE.md'), 'utf8').includes('[One paragraph')

  if (!hasClaude) {
    warn(`No CLAUDE.md found — create one so Claude knows your stack`)
  } else if (needsEdit) {
    warn(`Edit CLAUDE.md and fill in your stack details`)
  } else {
    ok(`CLAUDE.md found — Claude knows your project`)
  }

  log()
  log(`  ${c.bold}Next steps:${c.reset}`)
  log(`  ${c.cyan}1.${c.reset}  Run:   ${c.bold}claude${c.reset}`)
  log()
  log(`  ${c.bold}New to the template?${c.reset}`)
  log(`  ${c.cyan}→${c.reset}  Full Guide : ${c.bold}https://github.com/mohammednadeem772/claude-template/blob/main/Guide.md${c.reset}`)
  log()
  log(`  ${c.bold}Commands (19):${c.reset}`)
  log(`  ${c.cyan}2.${c.reset}  ${c.bold}/auto${c.reset}      — smart task detection`)
  log(`  ${c.cyan}3.${c.reset}  ${c.bold}/build${c.reset}     — incremental feature builder`)
  log(`  ${c.cyan}4.${c.reset}  ${c.bold}/ship${c.reset}      — full pipeline: build+test+review+security`)
  log(`  ${c.cyan}5.${c.reset}  ${c.bold}/feature${c.reset}   — build complete FE+BE feature`)
  log(`  ${c.cyan}6.${c.reset}  ${c.bold}/fix${c.reset}       — find and fix any bug`)
  log(`  ${c.cyan}7.${c.reset}  ${c.bold}/review${c.reset}    — code review with severity`)
  log(`  ${c.cyan}8.${c.reset}  ${c.bold}/test${c.reset}      — write tests for any file`)
  log(`  ${c.cyan}9.${c.reset}  ${c.bold}/test-all${c.reset}  — run full test suite`)
  log(`  ${c.cyan}10.${c.reset} ${c.bold}/refactor${c.reset}  — clean up and improve code`)
  log(`  ${c.cyan}11.${c.reset} ${c.bold}/optimize${c.reset}  — compress prompts, save tokens`)
  log(`  ${c.cyan}12.${c.reset} ${c.bold}/context${c.reset}   — smart file loading`)
  log(`  ${c.cyan}13.${c.reset} ${c.bold}/task${c.reset}      — track work during session`)
  log(`  ${c.cyan}14.${c.reset} ${c.bold}/retry${c.reset}     — recover from failed steps`)
  log(`  ${c.cyan}15.${c.reset} ${c.bold}/compress${c.reset}  — compress AI reasoning and context`)
  log(`  ${c.cyan}16.${c.reset} ${c.bold}/guard${c.reset}     — pre-deploy safety checks`)
  log(`  ${c.cyan}17.${c.reset} ${c.bold}/deploy${c.reset}    — deploy to staging or production`)
  log(`  ${c.cyan}18.${c.reset} ${c.bold}/document${c.reset}  — auto-generate documentation`)
  log(`  ${c.cyan}19.${c.reset} ${c.bold}/bootstrap${c.reset} — scaffold new component/screen/API`)
  log(`  ${c.cyan}20.${c.reset} ${c.bold}/analyze-error${c.reset} — diagnose and fix errors`)
  log()
  log(`  ${c.gray}All commands : .claude/commands/${c.reset}`)
  log(`  ${c.gray}All agents   : .claude/agents/${c.reset}`)
  log(`  ${c.gray}All skills   : .claude/skills/${c.reset}`)
  log()
}

main()
