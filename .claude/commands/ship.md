# /ship — Complete Feature Delivery Pipeline

## Usage

```bash
/ship employee listing screen    # Full pipeline: build → test → review → security
/ship login with OAuth            # Build complete feature with quality gates
/ship --quick dashboard charts    # Skip security audit (faster)
/ship --review-only               # Only run code-reviewer on existing code
```

## STEP 0 — DETECT ARCHITECTURE

Before running agents:
1. Read CLAUDE.md — detect project architecture
2. Determine what exists: frontend? backend? tests?
3. Brief each agent with project-specific context

## AGENT CHAIN (adaptive based on project)

Runs sequentially (each waits for previous):

1. **feature-builder** → builds based on detected architecture (FE/BE/both/API-only)
2. **test-writer** → writes tests if test framework exists (skip if none, warn user)
3. **code-reviewer** → reviews for bugs + quality
4. **security-auditor** → checks for vulnerabilities (skip with --quick flag)

## CRITICAL RULES

- Each agent MUST report completion before next starts
- Critical issue found → STOP entire chain immediately
- Show progress [1/4] → [2/4] → [3/4] → [4/4]
- Final summary MANDATORY after all agents complete
- Max 2000 tokens per agent

## AGENT RESPONSIBILITIES (project-aware)

**feature-builder:** Build based on project architecture from CLAUDE.md. If API-only → backend only. If frontend-only → UI only. If both → full-stack. Follow project conventions.

**test-writer:** Write tests IF test framework detected. Backend tests if API exists. Frontend tests if UI exists. Skip if no test framework (warn user).

**code-reviewer:** Review based on project stack. Check patterns from .claude/rules/. NO fixes — identify only. Critical → stop chain.

**security-auditor:** Scan for vulnerabilities in actual project stack. Check what's relevant to detected architecture. Critical → block ship.

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
