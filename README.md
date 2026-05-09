# claude-template (Private)

> Plug-and-play Claude Code setup — one command, any project.

---

## Setup (One Time — Repo Owner)

### Step 1 — Create Private GitHub Repo

1. Go to github.com → New repository
2. Name it: claude-template
3. Set to Private
4. Do NOT add README or .gitignore
5. Click Create repository

### Step 2 — Push this template

```bash
cd claude-template
git init
git add .
git commit -m "feat: initial claude code template"
git remote add origin https://github.com/YOUR_ORG/claude-template.git
git branch -M main
git push -u origin main
```

### Step 3 — Create a GitHub Personal Access Token (PAT)

1. GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Click Generate new token (classic)
3. Name: claude-template-access
4. Expiration: No expiration (or 1 year)
5. Scopes: check repo
6. Click Generate token — copy it immediately

Share via password manager. Never plain text in Slack or email.

---

## Install in Any Project (Team Members)

### One-time machine setup

```bash
git config --global url."https://YOUR_TOKEN@github.com/".insteadOf "https://github.com/"
```

### Install in any project

```bash
cd your-project
npx degit YOUR_ORG/claude-template claude-setup --force && node claude-setup/init.js && rm -rf claude-setup
```

## Quick Start (5 Minutes)

1. Install template (see above)
2. Edit CLAUDE.md — add your stack, commands, conventions
3. Run: claude
4. Try these:

```
/fix login not working
/build employee dashboard
/analyze-error "TypeError: cannot read properties of undefined"
```

Plain English also works — no slash commands needed:
- "login broken on mobile"
- "build employee dashboard"
- "why is the API returning 500"
- "write tests for the auth module"

Claude learns your project through CLAUDE.md and loaded context.
> Full guide: see GUIDE.md

---

## What the installer does

| Action | Detail |
|--------|--------|
| Creates .claude/ | commands, skills, agents, rules, hooks |
| Skips existing files | Never overwrites your CLAUDE.md or configs |
| Makes hooks executable | chmod +x on all .sh files |
| Updates .gitignore | Adds Claude-specific entries |
| Detects your stack | React Native, Next.js, Flutter, Python, Node |

---

## Which Command Should I Use?

| Situation | Use |
|-----------|-----|
| Something is broken | /fix |
| Have an error message | /analyze-error |
| Small feature (1-2 files) | /feature |
| Large feature (multi-step) | /build |
| Production-ready feature | /ship |
| Write tests | /test |
| Code review | /review |
| Clean up messy code | /refactor |
| Before deploying | /guard then /deploy |
| Previous step failed | /retry |
| Multiple tasks in session | /task |
| Not sure | /auto or plain English |

---

## Commands (19)

| Command | What it does |
|---------|-------------|
| /auto | Smart task detection from plain language |
| /build | Incremental feature builder with approval steps |
| /ship | Full pipeline: build → test → review → security |
| /feature | Build complete FE+BE feature |
| /fix | Find root cause and fix any bug |
| /review | Code review with severity levels |
| /test | Write tests for any file |
| /test-all | Run full test suite |
| /refactor | Clean up and improve code |
| /optimize | Compress prompts, save tokens |
| /context | Smart file loading |
| /task | Track work items during session |
| /retry | Recover from failed steps and resume pipelines |
| /compress | Compress AI reasoning and context |
| /guard | Pre-deploy safety checks |
| /deploy | Deploy to staging or production |
| /document | Auto-generate documentation |
| /bootstrap | Scaffold new component, screen, or API |
| /analyze-error | Diagnose and explain errors with fix suggestions |

---

## Agents (6)

| Agent | What it does |
|-------|-------------|
| code-reviewer | Reviews code, never modifies files |
| debugger | Finds root cause of any bug |
| test-writer | Writes tests for any file |
| feature-builder | Builds full-stack features |
| security-auditor | Scans for vulnerabilities |
| docs-writer | Generates documentation from source |

---

## Skills (15 — auto-load)

| Skill | Auto-loads when |
|-------|----------------|
| auto-selector | Every prompt |
| token-optimizer | Long or repeated prompts |
| context-loader | Any file read operation |
| fullstack-patterns | Feature or screen tasks |
| debugging-patterns | Fix or bug keywords |
| incremental-builder | Large feature requests |
| agent-chain | /ship command used |
| deploy-guard | Deploy or release keywords |
| task-tracker | /task used or work items detected |
| recovery-engine | Pipeline step fails or error detected |
| reasoning-compressor | Verbose reasoning or heavy context detected |
| error-analyzer | Error messages or /analyze-error command |
| frontend | UI or component tasks |
| backend | API or server tasks |
| testing | Test writing tasks |

---

## Keeping template up to date

```bash
# Update template repo
cd claude-template && git add . && git commit -m "feat: update" && git push

# Pull latest into any project (safe — skips existing files)
npx degit YOUR_ORG/claude-template claude-setup --force && node claude-setup/init.js && rm -rf claude-setup
```

---

## Team workflow

```
Repo Owner
  → Create private repo → push template → create PAT → share via password manager

Team Member (first time on a machine)
  → git config --global url."https://TOKEN@github.com/".insteadOf "https://github.com/"

Any project install
  → npx degit ORG/claude-template claude-setup --force && node claude-setup/init.js && rm -rf claude-setup
```

---

## Hooks (Auto-Run Scripts)

| Hook | Runs when |
|------|-----------|
| session-start.sh | New Claude Code session begins |
| post-tool.sh | After any file is modified |
| pre-commit.sh | Before Claude stages a git commit |

Hooks run automatically. Edit them in .claude/hooks/ to add project-specific checks.

---

## File structure

```
claude-template/
├── init.js
├── README.md
├── CLAUDE.md
├── .env.example
├── .gitignore
└── .claude/
    ├── commands/   ← 19 commands
    ├── agents/     ← 6 agents
    ├── skills/     ← 15 skills
    ├── rules/
    └── hooks/
```
