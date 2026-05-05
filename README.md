# claude-template (Private)

> Plug-and-play Claude Code setup — one command, any project.

---

## Setup (One Time — Repo Owner)

### Step 1 — Create Private GitHub Repo

1. Go to **github.com → New repository**
2. Name it: `claude-template`
3. Set to **Private** ✅
4. **Do NOT** add README or .gitignore (we have our own)
5. Click **Create repository**

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

This is needed so team members can install from private repo.

1. GitHub → Settings → Developer Settings → Personal Access Tokens → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Name: `claude-template-access`
4. Expiration: No expiration (or 1 year)
5. Scopes: check ✅ `repo` (full repo access)
6. Click **Generate token**
7. **Copy it** — you only see it once

Share this token with your team (via password manager, not Slack/email plain text).

---

## Install in Any Project (Team Members)

### One-time machine setup

```bash
# Save your GitHub token (only once per machine)
git config --global url."https://YOUR_TOKEN@github.com/".insteadOf "https://github.com/"
```

Replace `YOUR_TOKEN` with the token from Step 3 above.

### Install in any project

```bash
# Go to your project
cd your-project

# Download and run installer (one command)
npx degit YOUR_ORG/claude-template claude-setup --force && node claude-setup/init.js && rm -rf claude-setup
```

Replace `YOUR_ORG` with your GitHub username or organization name.

---

## What the installer does

| Action | Detail |
|--------|--------|
| Creates `.claude/` | hooks, commands, agents, skills, rules |
| Skips existing files | Never overwrites your CLAUDE.md or existing configs |
| Makes hooks executable | `chmod +x` on all `.sh` files |
| Updates `.gitignore` | Adds Claude-specific entries |
| Detects your stack | React Native, Next.js, Flutter, Python, Node — shows relevant tips |

---

## Commands available after install

| Command | What it does |
|---------|-------------|
| `/feature create X` | Build complete FE + BE feature |
| `/fix X not working` | Find root cause and fix any bug |
| `/refactor X` | Clean up and improve code |
| `/test src/X.ts` | Write tests for any file |
| `/review src/X.ts` | Code review with severity levels |
| `/deploy staging` | Deploy with test gate |
| `/document src/X` | Auto-generate docs |
| `/bootstrap component X` | Scaffold new component + test |

---

## Keeping template up to date

### Update the template repo
```bash
cd claude-template
# Make your changes
git add .
git commit -m "feat: add new command"
git push
```

### Pull latest into a project
```bash
cd your-project
npx degit YOUR_ORG/claude-template claude-setup --force && node claude-setup/init.js && rm -rf claude-setup
```

New files will be added. Existing files will be skipped (safe to run multiple times).

---

## Team workflow

```
Repo Owner
  → Creates private GitHub repo
  → Pushes this template
  → Creates PAT token
  → Shares token with team (via password manager)

Team Member (first time)
  → git config --global url."https://TOKEN@github.com/".insteadOf "https://github.com/"
  → cd new-project
  → npx degit ORG/claude-template claude-setup --force && node claude-setup/init.js && rm -rf claude-setup

Team Member (any project after that)
  → cd any-project
  → npx degit ORG/claude-template claude-setup --force && node claude-setup/init.js && rm -rf claude-setup
```

---

## File structure of this repo

```
claude-template/
├── init.js                      ← installer script
├── README.md                    ← this file
├── CLAUDE.md                    ← template (only copied if project has none)
├── .env.example                 ← template (only copied if project has none)
├── .gitignore                   ← template gitignore
└── .claude/
    ├── settings.json
    ├── hooks/
    │   ├── session-start.sh     ← project info on start
    │   ├── post-tool.sh         ← auto-format + line count warning
    │   └── pre-commit.sh        ← tests + lint before commit
    ├── commands/
    │   ├── feature.md           ← /feature
    │   ├── fix.md               ← /fix
    │   ├── refactor.md          ← /refactor
    │   ├── test.md              ← /test
    │   ├── review.md            ← /review
    │   ├── deploy.md            ← /deploy
    │   ├── document.md          ← /document
    │   └── bootstrap.md         ← /bootstrap
    ├── agents/
    │   ├── code-reviewer.md
    │   ├── debugger.md
    │   ├── test-writer.md
    │   ├── feature-builder.md
    │   ├── security-auditor.md
    │   └── docs-writer.md
    ├── skills/
    │   ├── frontend.md
    │   ├── backend.md
    │   ├── testing.md
    │   ├── fullstack-patterns.md
    │   └── debugging-patterns.md
    └── rules/
        ├── general.md
        ├── frontend.md
        ├── api.md
        └── testing.md
```
