# claude-template

> Plug-and-play Claude Code setup for any project.
> One command installs everything.

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/claude-template.git claude-setup && node claude-setup/init.js && rm -rf claude-setup
```

## Commands (16)

| Command | What it does |
| ------- | ------------ |
| /auto | Detects task type from plain language |
| /build | Incremental feature builder with approval steps |
| /ship | Full pipeline: build → test → review → security |
| /feature | Build complete FE+BE feature |
| /fix | Find and fix any bug |
| /review | Code review with severity levels |
| /test | Write tests for any file |
| /test-all | Run full test suite |
| /refactor | Clean up and improve code |
| /optimize | Compress prompts, save tokens |
| /context | Smart file loading |
| /task | Track work items during session |
| /guard | Pre-deploy safety checks |
| /deploy | Deploy to staging or production |
| /document | Auto-generate documentation |
| /bootstrap | Scaffold new component, screen, or API |

## Agents (6)

| Agent | What it does |
| ----- | ------------ |
| code-reviewer | Reviews code, never modifies files |
| debugger | Finds root cause of any bug |
| test-writer | Writes tests for any file |
| feature-builder | Builds full-stack features |
| security-auditor | Scans for vulnerabilities |
| docs-writer | Generates documentation from source |

## Skills (12 — auto-load)

| Skill | Auto-loads when |
| ----- | --------------- |
| auto-selector | Every prompt |
| token-optimizer | Long or repeated prompts |
| context-loader | Any file read operation |
| fullstack-patterns | Feature or screen tasks |
| debugging-patterns | Fix or bug keywords |
| incremental-builder | Large feature requests |
| agent-chain | /ship command used |
| deploy-guard | Deploy or release keywords |
| task-tracker | /task used or work items detected |
| frontend | UI or component tasks |
| backend | API or server tasks |
| testing | Test writing tasks |

## How it works

1. Install the template in any project
2. Claude reads your CLAUDE.md to understand your project
3. Use slash commands or plain language
4. Claude auto-detects task type and applies correct patterns

## Stack

Works with any project.
Claude reads your CLAUDE.md and adapts automatically.
No stack configuration needed.

## CLAUDE.md

The only file you need to edit after install.
Tell Claude your stack, commands, and conventions.
Keep it under 200 lines.
