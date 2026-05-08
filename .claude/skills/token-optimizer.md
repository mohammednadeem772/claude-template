# Skill: Token Optimizer

## Auto-loads when

- Long prompts (>100 tokens)
- Repeated context (stack mentioned when already in CLAUDE.md)
- Filler words ("please", "can you", "I would like")
- Verbose error messages
- Excessive preambles before code

## Core Principle

**Every token counts. Be direct, be precise, be brief.**

Code speaks louder than words. Show, don't explain.

## Rules (MUST FOLLOW)

**Rule 1: Code First, Words After**
```
❌ BAD (45 tokens before code)
"I'll help you fix the pagination issue. The problem is..."

✅ GOOD (code first, brief context)
Fix: src/hooks/useEmployees.js:34
const offset = (page - 1) * limit
Cause: page 1 was skipping first 20 records
```

**Rule 2: Never Repeat CLAUDE.md Context**
Stack info already known from CLAUDE.md — skip it

**Rule 3: Error Messages = Action Only**
```
❌ BAD (32 tokens)
"I encountered an error while trying to read the file..."

✅ GOOD (8 tokens)
File not found: verify path exists
```

**Rule 4: Lists Over Paragraphs**
Use bullet points, not paragraphs

**Rule 5: No Filler Words**
Remove: "please", "let me", "I'll", "just", "simply", "I think", "maybe"

**Rule 6: File Paths Over Descriptions**
```
❌ "the custom hook in the hooks directory"
✅ src/hooks/useEmployees.js
```

**Rule 7: Skip Obvious Explanations**
Don't comment what code does if name is clear

## Response Templates

**Simple Fix:** `Fix: [file:line] | [code] | Cause: [one line]`

**File Creation:** `Create [file path] | [code only]`

**Bug Diagnosis:** `Issue: [file:line] | Root: [one sentence] | Fix: [code]`

## Length Guidelines

- File creation: 5 tokens header + code
- Simple fix: 15-25 tokens total
- Medium feature: 30-50 tokens
- Complex feature: 80-120 tokens
- Error message: 8-12 tokens

## Anti-Patterns

❌ Preamble before code blocks
❌ Summarizing what you just did
❌ Repeating user's request back
❌ Uncertain language ("probably", "maybe")
❌ Over-explaining simple changes
