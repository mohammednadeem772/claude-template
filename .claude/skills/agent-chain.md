# Skill: Agent Chain

## Auto-loads when:

- User types `/ship` command
- Keywords: "build and test", "build and review", "complete feature", "production ready", "full pipeline", "ship feature", "deploy ready"
- Multi-agent workflow detected (mentions 2+ of: build, test, review, security)

## Core Behavior

Execute agents sequentially: **feature-builder** → **test-writer** → **code-reviewer** → **security-auditor**

## STRICT Rules

- Each agent: isolated context, max 2000 tokens, reads previous agent output
- Critical issue → stop chain immediately, report to user
- Skip agents only if: `--quick` (skip security) or `--review-only` (skip 1-2)
- Never run agents in parallel — always sequential
- Show progress after each agent completes

## Agent Responsibilities

**feature-builder:** Build FE + BE code (no tests). Follow CLAUDE.md + .claude/rules/. Report files created.

**test-writer:** Write tests only for new code. Backend: API tests (all endpoints, status codes). Frontend: component tests (render, events, states). Follow .claude/rules/testing.md.

**code-reviewer:** Review for bugs, logic errors, missing error handling, code quality, conventions. NO fixes — identify only. Report: critical (stop) vs warnings (continue).

**security-auditor:** Check SQL injection, XSS, CSRF, auth bypass, hardcoded secrets, authorization. NO fixes — identify only. Report: critical (block) vs warnings (note).

## Handoff Format Between Agents

```text
HANDOFF → [next-agent-name]
Files: path/file1.js, path/file2.jsx
Issues to check: authentication on routes/x.js, validation in validators/y.js
Context: [brief description]
```

## Progress Output (show after each agent)

```text
── Shipping: {feature} ──
[1/4] feature-builder  → ✅ done (5 files)
[2/4] test-writer      → ✅ done (3 test files)
[3/4] code-reviewer    → ⚠️ 2 warnings (continue)
[4/4] security-auditor → ✅ no issues
── Ship complete ──
```

## Stop Conditions

Stop if: agent cannot complete task, code-reviewer finds CRITICAL issues, security-auditor finds CRITICAL vulnerabilities, agent exceeds 2000 tokens.
