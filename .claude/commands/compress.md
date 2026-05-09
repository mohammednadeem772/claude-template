# /compress — Compress Long AI Reasoning and Context

## Usage

```bash
/compress                  — compress current conversation context
/compress reasoning        — remove verbose thinking, keep conclusions
/compress context          — summarize loaded context to key points
/compress --aggressive     — maximum compression, keep only essentials
/compress --preview        — show what would be removed before compressing
```

## What It Does

- Remove repeated instructions already in CLAUDE.md
- Collapse verbose reasoning into conclusions only
- Summarize long discussions to decisions made
- Keep: decisions, conclusions, action items, code changes
- Remove: filler phrases, step-by-step thinking, repetition
- Show before/after token estimate

## Output Format

```text
── Compression Report ─────────────
Before: ~X tokens
After:  ~Y tokens
Saved:  ~Z tokens (XX%)

Kept:
  ✅ Decision to use Redux for state
  ✅ Payment API endpoint structure
  ✅ Code changes in auth.js

Removed:
  ✂️ Verbose reasoning steps
  ✂️ Repeated CLAUDE.md instructions
  ✂️ Filler phrases ("let me think", "certainly")
───────────────────────────────────
```

## What Gets Compressed

### Always Removed

- Filler phrases: "let me think", "certainly", "I'll help you with that"
- Repeated instructions from CLAUDE.md
- Verbose reasoning steps (keep conclusions only)
- Step-by-step thinking already documented
- Duplicate context from multiple file reads

### Always Kept

- Written code and file changes
- User requirements and decisions
- Error messages and stack traces
- Action items and next steps
- Critical context for ongoing work

## Compression Modes

**Default** (`/compress`) — removes obvious redundancy, preserves all critical information.

**Reasoning** (`/compress reasoning`) — collapses verbose thinking to conclusions only.
`Before: "Let me think... after analyzing..." → After: "Solution: Use Redux with async thunks."`

**Context** (`/compress context`) — summarizes loaded file context to key points only.

**Aggressive** (`/compress --aggressive`) — maximum compression, use when context window is critical.

## Critical Rules

1. **Never compress written code** — all code stays intact
2. **Never compress user requirements** — keep user decisions
3. **Never compress errors** — error messages stay full
4. **Always show what was removed** — full transparency
5. **Ask before aggressive** — confirm before max compression

## Integration

Auto-suggested when:

- Response exceeds 500 words
- Same instruction repeated 2+ times
- Context window above 70%
- Heavy reasoning detected

## Preview Mode

```bash
/compress --preview

── Preview: What will be removed ──
✂️ 450 tokens — repeated instructions
✂️ 680 tokens — verbose reasoning
✂️ 220 tokens — filler phrases
Total removal: ~1,350 tokens (18%)
Proceed? (y/n)
───────────────────────────────────
```
