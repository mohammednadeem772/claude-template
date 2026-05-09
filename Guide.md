# Claude Template — Complete User Guide

> Everything you need to understand and use this AI engineering system from day one.

---

## Table of Contents

1. [What Is This?](#1-what-is-this)
2. [Installation](#2-installation)
3. [First Setup — CLAUDE.md](#3-first-setup--claudemd)
4. [How the System Works](#4-how-the-system-works)
5. [Commands — When and How to Use Each](#5-commands--when-and-how-to-use-each)
6. [Skills — Auto-Loaded Intelligence](#6-skills--auto-loaded-intelligence)
7. [Agents — Specialized Workers](#7-agents--specialized-workers)
8. [Rules — Guardrails Claude Always Follows](#8-rules--guardrails-claude-always-follows)
9. [Hooks — Automatic Triggers](#9-hooks--automatic-triggers)
10. [Full Workflow Examples](#10-full-workflow-examples)
11. [Folder Structure Reference](#11-folder-structure-reference)
12. [Tips and Best Practices](#12-tips-and-best-practices)

---

## 1. What Is This?

**claude-template** is a plug-and-play configuration system for Claude Code.

Without it, Claude Code is a blank slate — it has no knowledge of your project, no consistent behavior, and no workflow automation. You end up repeating instructions every session.

With this template, Claude:
- Learns your project through CLAUDE.md, project files, and loaded context each session
- Automatically applies the right patterns for each task type
- Follows consistent rules without you having to repeat them
- Has specialized agents for review, debugging, testing, and more
- Gives you slash commands for every common dev workflow

**One install. Every project. Zero repeated instructions.**

---

## 2. Installation

Run this single command inside your project folder:

```bash
npx degit YOUR_ORG/claude-template claude-setup --force && node claude-setup/init.js && rm -rf claude-setup
```

What this does:
1. Clones the template into a temp folder called `claude-setup`
2. Runs `init.js` which copies all `.claude/` files into your project
3. Detects your stack automatically (React, Next.js, Python, etc.)
4. Creates a `CLAUDE.md` file for you to fill in
5. Updates your `.gitignore`
6. Deletes the temp folder — clean install

**It never overwrites existing files.** If a file already exists, it skips it and keeps yours.

---

## 3. First Setup — CLAUDE.md

After install, one file needs your attention: **`CLAUDE.md`** in your project root.

This is the single source of truth Claude reads at the start of every session. Think of it as your project's onboarding doc for the AI.

### What to put in CLAUDE.md

```markdown
# MyApp

## Stack
- Frontend: React + TypeScript + Tailwind
- Backend: Node.js + Express + PostgreSQL
- Auth: JWT tokens
- ORM: Prisma

## Dev Commands
- npm run dev       — start dev server
- npm run build     — production build
- npm test          — run tests
- npm run migrate   — run DB migrations

## Conventions
- All API URLs go in src/config/endpoints.ts — never inline
- Components go in src/components/
- Custom hooks go in src/hooks/
- Max 300 lines per file
- TypeScript strict mode — no `any`

## Before Every Deploy
- Run npm test
- Run npm run build
- Check for console.log statements
```

Keep it under 200 lines. The more specific you are, the better Claude performs.

---

## 4. How the System Works

When you type a command or plain language into Claude Code, here is what happens:

```
You type something
       ↓
Claude reads CLAUDE.md (your project context)
       ↓
Auto-selector skill detects task type
       ↓
Relevant skills auto-load (silently)
       ↓
Claude picks the right agent if needed
       ↓
Rules run as guardrails throughout
       ↓
Hooks fire before/after key actions
       ↓
Output delivered
```

You do not need to manage any of this. It runs automatically every session.

### The four layers

| Layer | What it is | You manage it? |
|-------|-----------|----------------|
| Commands | Slash commands you type | Yes — you trigger these |
| Skills | Behavior patterns Claude auto-loads | No — fires automatically |
| Agents | Specialized workers for focused tasks | Occasionally — some auto-trigger |
| Rules | Hard guardrails Claude never breaks | No — always active |
| Hooks | Scripts that run on events | No — automatic |

---

## 5. Commands — When and How to Use Each

Commands are typed in the Claude Code chat. Use them when you want to trigger a specific workflow.

---

### /auto — Smart Task Detection
**Use when:** You want to describe a task in plain English and let Claude figure out what to do.

```
/auto add a forgot password flow to the login page
/auto the search bar is not filtering results correctly
/auto write tests for the UserService class
```

Claude reads your request, detects whether it is a bug fix, new feature, refactor, or documentation task, then routes it to the correct workflow automatically.

**Best for:** Everyday tasks where you do not want to think about which command to use.

---

### /build — Incremental Feature Builder
**Use when:** Building a new feature that requires multiple steps and you want approval at each stage.

```
/build user profile settings page
/build email notification system
/build CSV export for the reports table
```

Claude breaks the feature into steps, shows you the plan, waits for your approval, then builds one step at a time. If something looks wrong, you can stop before it goes further.

**Best for:** Medium to large features where you want control over each stage.

---

### /ship — Full Pipeline
**Use when:** You want to take a feature all the way — build, test, review, security check — in one go.

```
/ship payment integration
/ship user authentication
```

This runs: build → test → code review → security audit → deploy guard in sequence. Each step must pass before the next begins.

**Best for:** Features going directly to production. Do not use for quick experiments.

---

### /feature — Full Stack Feature
**Use when:** Building a feature that needs both frontend and backend work.

```
/feature blog post creation with rich text editor
/feature user invite system with email flow
```

Claude scaffolds the API endpoint, database schema, frontend component, and wires them together. Follows your CLAUDE.md conventions throughout.

**Best for:** Features that touch both FE and BE in one task.

---

### /fix — Bug Fixer
**Use when:** Something is broken and you need it fixed.

```
/fix login button does nothing on mobile
/fix TypeError: cannot read properties of undefined in UserCard.tsx
/fix API returns 500 on POST /api/orders
```

You can paste the error message directly. Claude finds the root cause, explains it, and fixes only what is broken — no unnecessary changes.

**Best for:** Any bug, with or without an error message.

---

### /analyze-error — Deep Error Diagnosis
**Use when:** You have an error, stack trace, or log output that needs explanation.

```
/analyze-error "FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed"
/analyze-error --file crash.log
/analyze-error --last
```

Unlike `/fix` which goes straight to fixing, `/analyze-error` first explains the error in plain language — what type it is, what caused it, where it came from — then gives you Quick Fix → Better Fix → Best Practice options.

**Best for:** Errors you do not understand, or want to learn from before fixing.

---

### /review — Code Review
**Use when:** You want feedback on code quality before merging or shipping.

```
/review src/components/PaymentForm.tsx
/review the last 3 files I changed
```

Returns findings with severity levels: Critical → High → Medium → Low. Claude never modifies files during a review — read only.

**Best for:** Pre-merge checks, PR preparation, learning from feedback.

---

### /test — Write Tests
**Use when:** A file has no tests or needs better coverage.

```
/test src/services/EmailService.ts
/test src/utils/validators.js
```

Claude reads the file, understands what it does, and writes appropriate tests. Follows your existing test style and framework.

**Best for:** Adding tests to new or untested files.

---

### /test-all — Run Full Suite
**Use when:** You want to run all tests and get a summary.

```
/test-all
/test-all --coverage
```

Runs your full test suite, identifies failures, and gives a fix plan for anything broken.

**Best for:** Before merging a PR or doing a deploy.

---

### /refactor — Code Cleanup
**Use when:** Code works but is messy, hard to read, or needs restructuring.

```
/refactor src/pages/Dashboard.tsx
/refactor the authentication middleware
```

Claude improves structure, readability, and naming without changing behavior. Always preserves functionality.

**Best for:** Technical debt cleanup, code that grew too big.

---

### /optimize — Token and Prompt Optimizer
**Use when:** Claude is being slow, expensive, or using too much context.

```
/optimize
/optimize --context
```

Compresses the current context, removes redundant information, and makes the session leaner.

**Best for:** Long sessions where Claude starts slowing down or repeating itself.

---

### /context — Smart File Loader
**Use when:** You want Claude to load specific files into context before a task.

```
/context load the auth module
/context load all files related to payments
```

Instead of manually telling Claude which files to read, this command intelligently loads only what is relevant.

**Best for:** Starting a focused task on a specific part of the codebase.

---

### /task — Session Task Tracker
**Use when:** You have multiple things to do in one session and want to track progress.

```
/task add "fix login bug"
/task add "write tests for UserService"
/task add "review the PR changes"
/task list
/task done 1
```

Keeps a checklist visible during the session so nothing gets forgotten.

**Best for:** Multi-task sessions, work planning within a Claude session.

---

### /retry — Recovery Engine
**Use when:** A previous step failed and you need to resume from where it stopped.

```
/retry
/retry --from step 3
```

Claude remembers what was being built, identifies what failed, and resumes intelligently without starting over.

**Best for:** When `/build` or `/ship` hits an error mid-way.

---

### /compress — Reasoning Compressor
**Use when:** Claude is writing very long reasoning blocks and you want tighter responses.

```
/compress
/compress --heavy
```

Strips verbose chain-of-thought, summarizes context, and keeps only what matters going forward.

**Best for:** When responses are getting bloated or the session feels slow.

---

### /guard — Pre-Deploy Safety Check
**Use when:** About to deploy and want a final safety scan.

```
/guard
/guard --strict
```

Checks for: hardcoded secrets, debug logs left in code, missing error handling, broken imports, and environment config issues.

**Best for:** Always run this before any production deploy.

---

### /deploy — Deploy Command
**Use when:** Ready to deploy to staging or production.

```
/deploy staging
/deploy production
```

Runs the guard checks first, then executes your deploy flow as defined in CLAUDE.md.

**Best for:** Managed deployments with a safety net.

---

### /document — Documentation Generator
**Use when:** A file, module, or API has no documentation.

```
/document src/services/PaymentService.ts
/document the REST API endpoints
```

Generates JSDoc, README sections, or API docs based on the actual code.

**Best for:** Catching up on documentation debt.

---

### /bootstrap — Scaffold Generator
**Use when:** Starting a new component, screen, API route, or module from scratch.

```
/bootstrap component UserProfileCard
/bootstrap api-route /api/notifications
/bootstrap screen SettingsPage
```

Creates the file with correct structure, imports, and boilerplate based on your project conventions.

**Best for:** Starting new files the right way, consistently.

---

## 6. Skills — Auto-Loaded Intelligence

Skills are behavior pattern files that Claude loads automatically based on what you are doing. You never call them directly.

| Skill | Fires when |
|-------|-----------|
| `auto-selector` | Every single prompt — always active |
| `token-optimizer` | Prompts are getting long or repetitive |
| `context-loader` | Any file reading operation |
| `fullstack-patterns` | Feature or screen task detected |
| `debugging-patterns` | Words like "fix", "bug", "error", "broken" appear |
| `incremental-builder` | Large feature request detected |
| `agent-chain` | `/ship` command is used |
| `deploy-guard` | Deploy or release words detected |
| `task-tracker` | `/task` used or multiple work items detected |
| `recovery-engine` | A pipeline step fails or error is detected |
| `reasoning-compressor` | Verbose reasoning or heavy context detected |
| `error-analyzer` | Error messages pasted or `/analyze-error` used |
| `frontend` | UI, component, or styling task |
| `backend` | API, server, or database task |
| `testing` | Test writing or test running task |

**You do not need to do anything.** Skills load silently and apply their patterns. If Claude seems to handle a task differently in different situations, that is the skills working correctly.

---

## 7. Agents — Specialized Workers

Agents are focused sub-workers Claude can spin up for a specific job. Some are triggered automatically by commands, others Claude calls internally.

| Agent | What it does | Triggered by |
|-------|-------------|-------------|
| `code-reviewer` | Reviews code, never edits files | `/review`, `/ship` |
| `debugger` | Finds root cause of bugs | `/fix`, `/analyze-error` |
| `test-writer` | Writes tests for any file | `/test`, `/ship` |
| `feature-builder` | Builds full-stack features | `/feature`, `/build` |
| `security-auditor` | Scans for vulnerabilities | `/guard`, `/ship` |
| `docs-writer` | Generates docs from source code | `/document` |

Agents operate within guardrails — for example, `code-reviewer` is read-only and will never modify a file even if asked.

---

## 8. Rules — Guardrails Claude Always Follows

Rules are hard constraints in `.claude/rules/`. Claude reads these at session start and they stay active throughout. They cannot be overridden by user instructions.

Common rules in this template:

- **No inline secrets** — never write API keys or passwords directly in code
- **No debug logs in production** — strips `console.log` before any deploy step
- **File size limits** — warns when a file exceeds the line limit set in CLAUDE.md
- **Test before ship** — `/ship` cannot skip the test step
- **English only** — all code comments, variable names, and docs in English
- **Review is read-only** — code-reviewer agent cannot modify files

Rules are the reason you can trust Claude to behave consistently across sessions.

---

## 9. Hooks — Automatic Triggers

Hooks are scripts in `.claude/hooks/` that fire automatically on certain events. They run without you doing anything.

| Hook | When it fires |
|------|--------------|
| session-start.sh | When a new Claude Code session begins — loads project info |
| post-tool.sh | After any file is modified — runs auto-format and line count check |
| pre-commit.sh | Before Claude stages a git commit — runs tests and lint |

Hooks handle things like: checking the build passes before deploy, validating environment variables exist, or logging what was done in a session.

You can edit hooks in `.claude/hooks/` to add your own project-specific checks.

---

## 10. Full Workflow Examples

### Scenario A — Fixing a bug reported by a user

```
User: the checkout button freezes on Safari

You: /fix checkout button freezes on Safari

Claude:
  1. Loads debugging-patterns skill
  2. Reads relevant files (context-loader skill)
  3. debugger agent identifies root cause
  4. Explains the issue
  5. Applies the fix
  6. Suggests a test to verify
```

---

### Scenario B — Building a new feature end-to-end

```
You: /ship dark mode toggle

Claude:
  1. /build — scaffolds the toggle component + CSS variables (you approve each step)
  2. /test  — writes tests for the toggle logic
  3. /review — code-reviewer agent checks quality
  4. /guard — security-auditor scans for issues
  5. Reports: ready to deploy or lists what to fix
```

---

### Scenario C — You are new to the codebase

```
You: /context load the authentication module
Claude: loads all auth-related files silently

You: /auto how does the login flow work?
Claude: explains the login flow using the loaded context

You: /fix login fails when email has uppercase letters
Claude: already has context loaded, finds and fixes the issue immediately
```

---

### Scenario D — Session with multiple tasks

```
You: /task add "fix the search bug"
You: /task add "add export button to reports"
You: /task add "write tests for OrderService"
You: /task list

Claude shows:
  [ ] fix the search bug
  [ ] add export button to reports
  [ ] write tests for OrderService

You work through each one. Claude marks them done as you go.
```

---

## 11. Folder Structure Reference

After install, your project will have:

```
your-project/
├── CLAUDE.md                        ← Edit this — your project config
├── .claude/
│   ├── commands/                    ← All slash command definitions
│   │   ├── auto.md
│   │   ├── build.md
│   │   ├── ship.md
│   │   ├── fix.md
│   │   ├── analyze-error.md
│   │   └── ... (19 total)
│   ├── skills/                      ← Auto-loaded behavior patterns
│   │   ├── auto-selector.md
│   │   ├── debugging-patterns.md
│   │   ├── error-analyzer.md
│   │   └── ... (15 total)
│   ├── agents/                      ← Specialized sub-workers
│   │   ├── code-reviewer.md
│   │   ├── debugger.md
│   │   └── ... (6 total)
│   ├── rules/                       ← Hard guardrails, always active
│   │   └── *.md
│   └── hooks/                       ← Scripts that fire on events
│       ├── pre-deploy.sh
│       └── session-start.sh
└── .gitignore                       ← Updated with Claude entries
```

---

## 12. Tips and Best Practices

**Keep CLAUDE.md current.** When you add a new convention, tool, or pattern to your project, add it to CLAUDE.md. This is the single thing that makes the biggest difference in output quality.

**Use /auto for everyday work.** You do not need to pick the perfect command every time. `/auto` is intelligent enough for most tasks.

**Use /ship only for real features.** The full pipeline is thorough but slow. For quick fixes, use `/fix` directly.

**Paste errors directly.** When something breaks, paste the full error message or stack trace into the chat. Claude handles it better than a description.

**Use /guard before every deploy.** It takes 30 seconds and has caught real issues.

**Use /task for long sessions.** If you have 3 or more things to do, start with `/task add` for each. It keeps the session focused.

**Check line counts if you edit files.** The template enforces line limits:
- `commands/` → max 100 lines
- `skills/` → max 80 lines
- `agents/` → max 50 lines
- `rules/` → max 60 lines

**Do not add stack-specific content to the template files.** Put project-specific rules in CLAUDE.md, not in the `.claude/` files. The template is meant to stay generic so it works across any project.

---

*claude-template — built for engineers who want Claude Code to work like a senior team member, not a blank chat window.*