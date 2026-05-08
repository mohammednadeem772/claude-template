# /ship — Complete Feature Delivery Pipeline

## Usage

```bash
/ship employee listing screen    # Full pipeline: build → test → review → security
/ship login with OAuth            # Build complete feature with quality gates
/ship --quick dashboard charts    # Skip security audit (faster)
/ship --review-only               # Only run code-reviewer on existing code
```

## AGENT CHAIN

Runs sequentially (each waits for previous):

1. **feature-builder** → builds complete FE + BE
2. **test-writer** → writes tests for all new code
3. **code-reviewer** → reviews for bugs + quality
4. **security-auditor** → checks for vulnerabilities

## CRITICAL RULES

- Each agent MUST report completion before next starts
- Critical issue found → STOP entire chain immediately
- Show progress [1/4] → [2/4] → [3/4] → [4/4]
- Final summary MANDATORY after all agents complete
- Max 2000 tokens per agent

## AGENT RESPONSIBILITIES

**feature-builder:** Build FE + BE code (no tests). Follow CLAUDE.md + .claude/rules/. Report files created.

**test-writer:** Write tests for new code. Backend: API tests (all endpoints). Frontend: component tests (render, events, states). Follow testing rules.

**code-reviewer:** Review for bugs, logic errors, missing error handling, code quality, conventions. NO fixes — identify only. Report: critical (stop) vs warnings (continue).

**security-auditor:** Check SQL injection, XSS, CSRF, auth bypass, hardcoded secrets, authorization. NO fixes — identify only. Report: critical (block) vs warnings (note).

## PROGRESS OUTPUT (show after each agent)

```
── Shipping: {feature} ──
[1/4] feature-builder  → ✅ Complete (created 8 files)
[2/4] test-writer      → ✅ Complete (added 12 tests)
[3/4] code-reviewer    → ✅ Complete (0 critical, 2 warnings)
[4/4] security-auditor → ✅ Complete (no vulnerabilities)
── Ship complete ──
```

## FINAL SUMMARY (success)

```
✅ Ship complete: {feature}

Pipeline results:
  ✅ Built:    X files created
  ✅ Tested:   X test files written
  ✅ Reviewed: 0 critical, X warnings
  ✅ Secured:  No vulnerabilities

Ready to commit.
```

## FINAL SUMMARY (blocked)

```
🔴 Ship blocked: {feature}

Agent {N} ({name}) found critical issues:
  - {issue 1}
  - {issue 2}

Fix these before shipping.
```

## FLAGS

- `--quick` — skip security-auditor (faster)
- `--review-only` — skip feature-builder and test-writer, only review existing code

## STOP CONDITIONS

Stop if: agent cannot complete task, code-reviewer finds CRITICAL issues, security-auditor finds CRITICAL vulnerabilities, agent exceeds 2000 tokens
