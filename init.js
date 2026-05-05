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
  try { fs.chmodSync(p, '755') } catch {}
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
        makeExecutable(path.join(hooksDir, f))
        ok(`.claude/hooks/${f} — executable`)
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
    const claudeMdSrc = path.join(TEMPLATE_DIR, 'CLAUDE.md')
    if (fs.existsSync(claudeMdSrc)) {
      let content = fs.readFileSync(claudeMdSrc, 'utf8')
      content = content.replace(/\[PROJECT_NAME\]/g, projectName)
      fs.writeFileSync(claudeMdDest, content)
      ok(`CLAUDE.md created — ${c.yellow}edit it and fill in your stack${c.reset}`)
    }
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
  const needsEdit = hasClaude && fs.readFileSync(path.join(TARGET_DIR, 'CLAUDE.md'), 'utf8').includes('[PROJECT_NAME]')

  if (!hasClaude) {
    warn(`No CLAUDE.md found — create one so Claude knows your stack`)
  } else if (needsEdit) {
    warn(`Edit CLAUDE.md and fill in your stack details`)
  } else {
    ok(`CLAUDE.md found — Claude knows your project`)
  }

  log()
  log(`  ${c.bold}Next steps:${c.reset}`)
  log(`  ${c.cyan}1.${c.reset} Run: ${c.bold}claude${c.reset}`)
  log(`  ${c.cyan}2.${c.reset} Try: ${c.bold}/feature create login screen${c.reset}`)
  log(`  ${c.cyan}3.${c.reset} Try: ${c.bold}/fix pagination issue on dashboard${c.reset}`)
  log(`  ${c.cyan}4.${c.reset} Try: ${c.bold}/review src/screens/LoginScreen.tsx${c.reset}`)
  log()
  log(`  ${c.gray}Commands: .claude/commands/  |  Agents: .claude/agents/${c.reset}`)
  log()
}

main()
