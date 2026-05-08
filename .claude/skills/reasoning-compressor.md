# Skill: Reasoning Compressor

## Auto-loads when

- Response exceeds 500 words
- Filler phrases detected: "let me think", "certainly", "I'll help"
- Same instruction repeated 2+ times in conversation
- Context window above 70%
- `/compress` command used

## Core Behavior

Silently remove filler phrases from responses.
Keep conclusions, skip verbose reasoning steps.
Suggest `/compress` when context gets heavy.
Never compress: code, errors, user requirements, decisions.

## Filler Detection

**Common Patterns:**

- "Let me think..."
- "Certainly, I'll help you with that"
- "I understand you want..."
- "Let me analyze..."
- "After thinking through this..."
- "Here's what I'll do..."

**Action:** Strip these automatically from responses. Keep conclusions only.

## Compression Triggers

**Heavy Reasoning:** Response draft exceeds 500 words → compress before output

**Repeated Context:** Same instruction appears 2+ times → auto-suggest `/compress context`

**Context Window:** Above 70% capacity → auto-suggest `/compress --aggressive`

**Verbose Thinking:** Long reasoning chain detected → compress to conclusion

## Silent Operation

Runs in background during response generation.

Interrupts only for:

1. Compression suggestion (context heavy)
2. Preview confirmation (if --preview used)
3. User explicitly calls `/compress`

## What Gets Compressed

**Always Remove:**

- Filler phrases and pleasantries
- Repeated CLAUDE.md instructions
- Verbose step-by-step reasoning
- Duplicate context from file reads

**Always Keep:**

- Written code and changes
- User decisions and requirements
- Error messages and traces
- Action items and next steps

## Auto-Suggestion Format

```
── Context Heavy (70%) ────────────
Suggestion: /compress
Estimated savings: ~2,400 tokens
───────────────────────────────────
```

## Rules

- Session-only (no file persistence)
- Auto-compress filler phrases silently
- Never compress code or errors
- Always show compression stats when /compress used
- Suggest /compress — never auto-execute full compression
- Clear compression history on new session
