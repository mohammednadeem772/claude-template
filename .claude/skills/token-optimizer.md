# Skill: Token Optimizer

## Auto-loads when Claude detects:
- Long prompts (>100 tokens)
- Repeated context (stack mentioned when already in CLAUDE.md)
- Filler words ("please", "can you", "I would like", "kindly")
- Verbose error messages
- Excessive preambles before code
- Paragraphs that could be lists
- Over-explanation of simple tasks

## Core Principle

**Every token counts. Be direct, be precise, be brief.**

Code speaks louder than words. Show, don't explain.

## Token Optimization Rules (MUST FOLLOW)

### Rule 1: Code First, Words After
```
❌ BAD (45 tokens before code)
"I'll help you fix the pagination issue. The problem is in the offset calculation
where we're using page * limit instead of (page - 1) * limit. This causes the
first page to be skipped. Here's the corrected code:"

✅ GOOD (code first, brief context)
Fix: src/hooks/useEmployees.js:34

const offset = (page - 1) * limit  // was: page * limit

Cause: page 1 was skipping first 20 records
```

### Rule 2: Never Repeat CLAUDE.md Context
```
❌ BAD
"Since you're using React with TypeScript and Tailwind CSS..."

✅ GOOD
[Just write the code — stack is known from CLAUDE.md]
```

### Rule 3: Error Messages = Action Only
```
❌ BAD (32 tokens)
"I encountered an error while trying to read the file. The file at the specified
path doesn't seem to exist. You should check if the path is correct."

✅ GOOD (8 tokens)
File not found: verify path src/components/Login.jsx exists
```

### Rule 4: Minimal File Headers
```
❌ BAD
"I'll create the employee form component now. This will be a reusable form
component that handles both create and edit modes with full validation."

✅ GOOD
Create src/components/EmployeeForm.jsx
```

### Rule 5: Lists Over Paragraphs
```
❌ BAD (68 tokens)
"To fix this issue, you'll need to do several things. First, add the page
variable to the useEffect dependency array so it re-runs when page changes.
Then, make sure the page is being sent in the API request. Finally, verify
that the backend is calculating the offset correctly using (page - 1) * limit
instead of just page * limit."

✅ GOOD (28 tokens)
Fix pagination:
- Add page to useEffect deps: useEffect(() => {}, [page])
- Send page in API: api.get('/employees', { params: { page } })
- Fix offset: (page - 1) * limit
```

### Rule 6: Match Output Length to Task Complexity
```
Simple fix (1 line change):
  → 1-2 sentences max

Medium change (1 file):
  → Show code, 1 line context

Complex change (multiple files):
  → File list, key changes, brief why

Architecture change:
  → Structured plan, then execute
```

### Rule 7: No Filler Words
Remove these completely:
- "please", "kindly", "I would appreciate"
- "let me", "I'll go ahead and"
- "just", "simply", "basically"
- "I think", "maybe", "possibly"
- "of course", "obviously", "clearly"
- "as you can see", "as mentioned"

### Rule 8: Compress Status Updates
```
❌ BAD (42 tokens)
"I've successfully created the employee form component with all the necessary
validation logic. The form now handles both create and edit modes as requested.
I've also added proper error handling and loading states."

✅ GOOD (9 tokens)
Created EmployeeForm.jsx with validation, error/loading states
```

### Rule 9: File Paths Over Descriptions
```
❌ BAD (18 tokens)
"the custom hook that handles employee-related API calls in the hooks directory"

✅ GOOD (3 tokens)
src/hooks/useEmployees.js
```

### Rule 10: Skip Obvious Explanations
```
❌ BAD
const handleSubmit = async (e) => {
  e.preventDefault()  // This prevents the default form submission behavior
  ...
}

✅ GOOD
const handleSubmit = async (e) => {
  e.preventDefault()
  ...
}
```

## Response Templates (by task type)

### Simple Fix
```
Fix: [file:line]
[corrected code]
Cause: [one line]
```

### Single File Creation
```
Create [file path]
[code only, no preamble]
```

### Multiple File Feature
```
Files:
- [file 1] — [what]
- [file 2] — [what]
- [file 3] — [what]

[code for each file]

Usage: [one line if not obvious]
```

### Bug Diagnosis
```
Issue: [file:line]
Root cause: [one sentence]
Fix: [code or specific change]
Test: [verification step]
```

### Code Review
```
Issues found:
- [file:line] — [problem] → [fix]
- [file:line] — [problem] → [fix]

Security: [if any]
Performance: [if any]
```

## Auto-Compression Triggers

When user prompt contains these patterns, auto-compress:

| User Says | Auto-Convert To |
|-----------|----------------|
| "Can you please create..." | Create... |
| "I would like to add..." | Add... |
| "Could you help me fix..." | Fix... |
| "I think the problem is in the [file]..." | Check [file]... |
| "using React with Node.js" | [skip, known from CLAUDE.md] |
| "The button on the login screen..." | LoginScreen button... |

## Length Guidelines (by response type)

| Response Type | Max Tokens | Example |
|--------------|------------|---------|
| File creation | 5 header + code | Create src/utils/format.js |
| Simple fix | 15-25 total | Fix + code + one-line cause |
| Medium feature | 30-50 total | File list + code blocks |
| Complex feature | 80-120 total | Structured sections + code |
| Error message | 8-12 total | Action-oriented only |
| Status update | 5-10 total | What changed, what's next |
| Code review | 20-40 total | Issues list + specific fixes |

## When to Use More Tokens (exceptions)

Use fuller explanations ONLY when:
- Security implications exist (explain the risk)
- Data loss could occur (warn clearly)
- Architecture decision has tradeoffs (list pros/cons)
- Non-obvious gotcha exists (explain why)
- User is learning (asked "how" or "why")

Even then: brief, structured, essential only.

## Code Comment Policy

Default: **ZERO comments**

Add comment ONLY when:
- Non-obvious workaround: `// Safari requires explicit width for flexbox`
- Subtle invariant: `// Must run before useEffect to prevent race condition`
- Magic number: `const DEBOUNCE_MS = 300 // UX research: optimal typing delay`
- Security requirement: `// Sanitize before DB to prevent NoSQL injection`

Never comment:
- What code does (use descriptive names instead)
- Current task context ("added for feature X")
- Obvious logic

## Anti-Patterns to Avoid

❌ **Preamble before every code block**
```
"Now I'll create the validation schema. This will use Zod to validate
the employee data structure with proper error messages:"
```
✅ Just show the code

❌ **Summarizing what you just did**
```
"I've successfully updated the component to include the new validation logic,
error handling, and loading states as requested."
```
✅ End immediately after last code block

❌ **Repeating user's request back**
```
User: "Fix the pagination"
Claude: "I'll fix the pagination issue you mentioned"
```
✅ Just fix it

❌ **Uncertain language**
```
"This should probably work, maybe try..."
```
✅ Be definitive: "Fix: ..."

❌ **Over-explaining simple changes**
```
User: "Add email validation"
Claude: "I'll add email validation using a regex pattern that checks for..."
```
✅ Just add it

## Measurement Targets

Track your efficiency:

| Metric | Target | Excellent |
|--------|--------|-----------|
| Tokens per file created | <10 header | <5 header |
| Tokens per bug fix | <30 total | <20 total |
| Preamble before code | 0-5 tokens | 0 tokens |
| Filler word count | 0 per response | 0 per response |
| Stack context repetition | 0 mentions | 0 mentions |
| Comments in new code | <2 per file | 0 per file |
| Status update length | <10 tokens | <5 tokens |

## Context Window Awareness

Monitor conversation length:
- **0-30% full**: Normal responses OK
- **30-60% full**: Apply compression rules
- **60-85% full**: Maximum compression, templates only
- **85%+ full**: Extreme brevity, consider conversation reset

When approaching limit:
1. Stop verbose updates
2. Code only, zero preamble
3. File paths instead of descriptions
4. Break complex tasks into new conversation

## Quick Decision Tree

```
Before responding, ask:

1. Can I show code instead of explaining?
   YES → Show code
   NO  → Continue

2. Is this context already in CLAUDE.md?
   YES → Skip it
   NO  → Continue

3. Can this paragraph be a list?
   YES → Make it a list
   NO  → Continue

4. Does this comment explain WHAT vs WHY?
   WHAT → Delete comment
   WHY  → Keep if non-obvious

5. Is this error message actionable?
   NO  → Add specific action
   YES → Send it

6. Am I repeating myself from earlier messages?
   YES → Reference earlier, don't repeat
   NO  → Send it
```

## Examples (Before → After)

### Example 1: File Creation
```
❌ BEFORE (52 tokens)
"I'll create the employee validation schema now. This will use Zod to validate
the input data for creating and updating employees. The schema will check that
all required fields are present and have valid formats. Here's the code:"

✅ AFTER (5 tokens + code)
Create src/validators/employeeValidator.js
[code only]
```

### Example 2: Bug Fix
```
❌ BEFORE (89 tokens)
"I found the issue with the pagination. The problem is in the useEmployees hook
at line 34. When calculating the offset for the database query, the code is
currently using page * limit, but this causes the first page of results to be
skipped. The correct formula should be (page - 1) * limit, which ensures that
page 1 starts at offset 0. I'll fix this now:"

✅ AFTER (18 tokens)
Fix: src/hooks/useEmployees.js:34
const offset = (page - 1) * limit
Cause: page 1 was skipping first 20 records
```

### Example 3: Multiple Files
```
❌ BEFORE (124 tokens)
"To implement this feature, I'll need to create several files. First, I'll create
the Employee model that defines the database schema. Then I'll create the validation
schema using Zod. After that, I'll create the API controller with all the CRUD
operations. Finally, I'll create the API routes and the test file. Let me start
with the model:"

✅ AFTER (28 tokens + code)
Files:
- models/Employee.js — schema + indexes
- validators/employeeValidator.js — Zod validation
- controllers/employeeController.js — CRUD logic
- routes/employees.js — route definitions
- tests/api/employees.test.js — integration tests

[code for each file, no preamble]
```

### Example 4: Error Message
```
❌ BEFORE (47 tokens)
"I tried to read the file you specified, but I encountered an error. It seems
like the file doesn't exist at that location. You should double-check the path
and make sure you've typed it correctly."

✅ AFTER (8 tokens)
File not found: verify src/components/Login.jsx exists
```

### Example 5: Status Update
```
❌ BEFORE (38 tokens)
"I've completed the implementation of the employee management feature. All the
backend endpoints are working, the frontend components are created, and I've
added tests for everything."

✅ AFTER (7 tokens)
Employee feature complete: API + UI + tests
```

## Integration with Other Skills

This skill works alongside others:

- **debugging-patterns**: Use compressed fix format
- **frontend**: Skip component checklist narration, just apply it
- **backend**: No API explanation, just implement
- **testing**: Show tests, minimal description
- **fullstack-patterns**: Code-first full-stack responses

## Enforcement Checklist

Before sending ANY response, verify:
- [ ] No preamble before first code block
- [ ] Zero filler words ("please", "let me", "I'll")
- [ ] No stack info repetition from CLAUDE.md
- [ ] Lists used instead of paragraphs where possible
- [ ] File paths instead of location descriptions
- [ ] Comments only for non-obvious WHY
- [ ] Error messages are actionable
- [ ] Status updates <10 tokens
- [ ] Response length matches task complexity
- [ ] No summary of what you just showed in code

## Extreme Brevity Mode (when context >85%)

When near token limit, activate extreme mode:

```
File creation:
  [filepath]
  [code only]

Bug fix:
  [file:line]
  [fix only]

Status:
  Done

Error:
  [problem] → [action]

Review:
  Issues:
  - [file:line] [problem]
```

## Token Budget Awareness

Always know approximate tokens used:
- CLAUDE.md: ~1800 tokens (one-time)
- .claude/rules/: ~4200 tokens (one-time)
- Each conversation turn: varies

Optimize every response to maximize:
- Tokens available for actual code
- Conversation turns before compression
- User's ability to ask follow-ups

**Remember: A good response is the shortest one that fully solves the problem.**
