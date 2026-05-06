# /ship — Complete Feature Delivery Pipeline

## Usage

```bash
/ship employee listing screen    # Full pipeline: build → test → review → security
/ship login with OAuth            # Build complete feature with quality gates
/ship --quick dashboard charts    # Skip security audit (faster)
/ship --review-only               # Only run code-reviewer on existing code
```

## Agent Chain

1. **feature-builder** → builds complete FE + BE
2. **test-writer** → writes tests for all new code
3. **code-reviewer** → reviews for bugs + quality
4. **security-auditor** → checks for vulnerabilities

Each agent gets output from previous. Stop on critical issues. Max 2000 tokens per agent.

## Step 1: Parse Arguments

- feature = args (everything except flags)
- skipSecurity = --quick flag present
- reviewOnly = --review-only flag present

## Step 2: Agent 1 — feature-builder

Prompt: "Build complete full-stack feature: {feature}. Follow CLAUDE.md tech stack and conventions. Include: models, API routes, validation, frontend components, hooks. Max 2000 tokens. Report files created."

Stop if: cannot build feature

## Step 3: Agent 2 — test-writer (skip if reviewOnly)

Prompt: "Write comprehensive tests for feature just built. Files from agent 1: {list}. Include: backend API tests, frontend component tests, edge cases. Follow testing rules in CLAUDE.md. Max 2000 tokens."

Stop if: tests cannot be created

## Step 4: Agent 3 — code-reviewer

Prompt: "Review all code for bugs and quality issues. Files to review: {list from agents 1 + 2}. Check: bugs, logic errors, missing error handling, security (basic), code quality, convention violations. Report: critical → stop, warnings → continue. Max 2000 tokens."

Stop if: critical issues found

## Step 5: Agent 4 — security-auditor (skip if --quick)

Prompt: "Security audit for new feature. Files: {list from all agents}. Check: SQL injection, XSS, CSRF, auth bypass, authorization issues, hardcoded secrets, insecure dependencies. Report: critical → block, warnings → note. Max 2000 tokens."

Stop if: critical security issues found

## Progress Output (show after each agent)

```text
── Shipping: {feature} ──
[1/4] feature-builder  → ✅ done
[2/4] test-writer      → ✅ done
[3/4] code-reviewer    → ✅ done / ⚠️ 2 warnings
[4/4] security-auditor → ✅ done / 🔴 CRITICAL
── Ship blocked: fix security issues ──
```

## Final Summary (success)

```text
✅ Ship complete: {feature}

Pipeline results:
  ✅ Built:    X files created
  ✅ Tested:   X test files written
  ✅ Reviewed: 0 critical, X warnings
  ✅ Secured:  No vulnerabilities

Ready to commit.
```

## Final Summary (blocked)

```text
🔴 Ship blocked: {feature}

Agent {N} ({name}) found critical issues:
  - {issue 1}
  - {issue 2}

Fix these before shipping.
```
