# /optimize — Compress Prompts, Save Tokens

## Usage

```bash
/optimize "Can you please help me create a user registration feature?"
/optimize --analyze                    # context window health check
/optimize template feature             # show /feature template
```

## WHY?

Shorter prompts = faster + cheaper + more context space

Problems: filler words, redundant context (already in CLAUDE.md), long backstories
Good: direct commands, structured, context-aware, specific location

## RULES

**Remove Filler Words**
```
❌ "Hi Claude! Can you please help me create a new feature for user registration?
I would really appreciate it if you could add form validation as well. Thanks!"
(38 tokens)

✅ "Create user registration feature with form validation"
(12 tokens — 68% reduction)
```

**Skip Stack Info from CLAUDE.md**
```
❌ "I'm using React with TypeScript and Tailwind. Backend is Node.js with Express.
Can you create an employee listing screen with a form?"
(45 tokens)

✅ "Create employee listing screen with form"
(8 tokens — 82% reduction)
```

**Command Structure, Not Prose**
```
❌ "I noticed when users submit the login form, nothing happens.
I think maybe there's an issue. Could you take a look?"
(52 tokens)

✅ "Fix login form not submitting"
(9 tokens — 83% reduction)
```

**Lists Over Paragraphs**
```
❌ "I need a dashboard page that shows metrics. It should have charts for sales,
a table with recent orders, and KPI cards at the top..."
(68 tokens)

✅ "Create dashboard with: sales charts, recent orders table,
KPI cards (revenue/customers/conversion), mobile responsive"
(20 tokens — 71% reduction)
```

## TEMPLATES

| Task | Template | Tokens |
| ---- | -------- | ------ |
| Feature | `Create [name] with: [req1], [req2], tests` | 15-25 |
| Fix | `Fix [symptom] in [file:line]` | 8-15 |
| Review | `Review [file] for [focus]` | 10-20 |
| Test | `Write tests for [file] covering [scenarios]` | 10-18 |
| Refactor | `Refactor [file] to [goal]` | 12-20 |

## TOKEN BUDGET

- Simple fix: 10-30 tokens
- Medium feature: 30-80 tokens
- Large feature: 80-150 tokens
- Complex: break into phases

## CONTEXT HEALTH

`/optimize --analyze` — check context usage and get recommendations
