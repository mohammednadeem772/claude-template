# /optimize — Compress Prompts, Save Tokens
#
# USAGE EXAMPLES:
#   /optimize                              (analyze current conversation context)
#   /optimize --analyze                    (check context window health)
#   /optimize "Can you please help me create a new user registration feature with form validation?"
#   /optimize "I would like you to fix the bug where pagination is not working correctly"
#   /optimize template feature             (show template for /feature command)
#   /optimize template fix                 (show template for /fix command)
#   /optimize template review              (show template for /review command)
#   /optimize template test                (show template for /test command)
#   /optimize template refactor            (show template for /refactor command)

## ─────────────────────────────────────────────────────────
## WHY OPTIMIZE PROMPTS?
## ─────────────────────────────────────────────────────────

Shorter prompts = faster responses + lower costs + more context space

Problems with verbose prompts:
- Filler words waste tokens ("please", "kindly", "can you", "I would like")
- Redundant context (stack info already in CLAUDE.md)
- Long backstories instead of direct asks
- Uncertain phrasing ("maybe", "I think", "possibly")

Good prompts are:
- Direct commands, not polite requests
- Structured with clear requirements
- Context-aware (don't repeat what's in CLAUDE.md)
- Specific about location and scope

## ─────────────────────────────────────────────────────────
## OPTIMIZATION RULES
## ─────────────────────────────────────────────────────────

### Rule 0: Context-Aware Optimization
```
NEVER repeat information already in CLAUDE.md:
  ❌ "I'm using React with Node.js" → already in CLAUDE.md
  ❌ "The project uses Tailwind CSS" → already in CLAUDE.md
  ✅ Just state the task directly

ALWAYS use /context before large tasks:
  ✅ /context load fix pagination in EmployeeList
  ✅ /context load create appointment booking feature

Start new conversation for unrelated topics:
  ✅ Finish current task → new conversation
  ❌ Mix unrelated tasks in same conversation

Batch related tasks in one message:
  ✅ "Fix pagination + add search filter + update tests"
  ❌ Three separate messages for related changes
```

### Rule 1: Remove Filler Words
```
❌ BEFORE (38 tokens)
"Hi Claude! Can you please help me create a new feature for user registration?
I would really appreciate it if you could add form validation as well. Thanks!"

✅ AFTER (12 tokens)
Create user registration feature with form validation

💰 SAVED: 26 tokens (68% reduction)
```

### Rule 2: Skip Stack Info Already in CLAUDE.md
```
❌ BEFORE (45 tokens)
"I'm using React with TypeScript and Tailwind CSS. The backend is Node.js with Express
and MongoDB. Can you create an employee listing screen with a form?"

✅ AFTER (8 tokens)
Create employee listing screen with form

💰 SAVED: 37 tokens (82% reduction)
Reason: Stack info already in CLAUDE.md — no need to repeat
```

### Rule 3: Use Command Structure, Not Prose
```
❌ BEFORE (52 tokens)
"I noticed that when users try to submit the login form, nothing happens.
I think maybe there's an issue with the form submission handler.
Could you take a look and see what might be wrong?"

✅ AFTER (9 tokens)
Fix login form not submitting

💰 SAVED: 43 tokens (83% reduction)
```

### Rule 4: Be Specific About Location
```
❌ BEFORE (15 tokens)
"The pagination feature isn't working properly in the application"

✅ AFTER (10 tokens)
Fix pagination in src/components/EmployeeList.jsx

💰 SAVED: 5 tokens (33% reduction)
Benefit: Faster execution — Claude knows exactly where to look
```

### Rule 5: List Requirements, Don't Narrate
```
❌ BEFORE (68 tokens)
"I need a dashboard page that shows various metrics. It should have charts
for sales data, a table showing recent orders, and some KPI cards at the top
displaying total revenue, number of customers, and conversion rate.
Also make sure it looks good on mobile devices."

✅ AFTER (20 tokens)
Create dashboard with:
- Sales charts
- Recent orders table
- KPI cards: revenue, customers, conversion
- Mobile responsive

💰 SAVED: 48 tokens (71% reduction)
```

### Rule 6: Use Action Verbs, Not Uncertain Phrases
```
❌ "I think we should maybe add..." → "Add..."
❌ "Could you possibly fix..."      → "Fix..."
❌ "I would like to create..."      → "Create..."
❌ "It seems like there might be..." → "Debug..."
```

## ─────────────────────────────────────────────────────────
## READY-MADE TEMPLATES
## ─────────────────────────────────────────────────────────

### FEATURE Template (avg 15-25 tokens)
```
Create [feature name] with:
- [component 1]
- [component 2]
- [validation/requirement]
- [test coverage]

Examples:
✅ Create appointment booking with calendar, time slots, SMS confirmation, tests
✅ Build product inventory with search, filters, CSV export
✅ Add user role management screen with permissions matrix
```

### FIX Template (avg 8-15 tokens)
```
Fix [symptom] in [file/location]

Examples:
✅ Fix pagination offset in src/hooks/useEmployees.js line 34
✅ Fix form not submitting in LoginForm.jsx
✅ Fix API 500 on POST /api/orders
✅ Fix modal stuck loading after error
✅ Fix search filter not updating results
```

### REVIEW Template (avg 10-20 tokens)
```
Review [PR#/branch/file] for [focus area]

Examples:
✅ Review PR #42 for security issues
✅ Review src/api/payments.js for error handling
✅ Review current branch for accessibility
✅ Review EmployeeForm.jsx for validation coverage
```

### TEST Template (avg 10-18 tokens)
```
Write tests for [file/feature] covering [scenarios]

Examples:
✅ Write tests for src/utils/pricing.js covering edge cases
✅ Write integration tests for /api/auth endpoints
✅ Add tests for EmployeeForm: validation, submission, error states
✅ Write E2E test for checkout flow
```

### REFACTOR Template (avg 12-20 tokens)
```
Refactor [file/area] to [goal]

Examples:
✅ Refactor src/hooks/useEmployees.js to reduce duplication
✅ Refactor EmployeeList.jsx to extract reusable components
✅ Refactor API error handling to use consistent format
✅ Extract validation logic from components into schemas
```

## ─────────────────────────────────────────────────────────
## TOKEN BUDGET GUIDE (by task type)
## ─────────────────────────────────────────────────────────

Recommended token counts for different tasks:

### Simple Tasks (10-30 tokens)
- Fix single bug
- Add small feature (button, field)
- Write single test
- Update styling

Examples:
✅ "Fix button hover color in Header.jsx" (6 tokens)
✅ "Add email validation to signup form" (6 tokens)
✅ "Write test for calculateTotal function" (5 tokens)

### Medium Tasks (30-80 tokens)
- Create full CRUD feature
- Fix complex bug with multiple causes
- Refactor component
- Add comprehensive tests

Examples:
✅ "Create employee CRUD with list, form, validation, tests" (9 tokens)
✅ "Fix pagination: offset calculation + useEffect deps + page reset on filter" (13 tokens)

### Large Tasks (80-150 tokens)
- Multi-file features with backend + frontend
- Architecture changes
- Migration tasks
- Full security review

Examples:
✅ "Create appointment booking system:
    Backend: model, validation, API, tests
    Frontend: calendar UI, time slot picker, confirmation flow
    Integration: email/SMS notifications" (24 tokens)

### When to Break Down (>150 tokens)
If your prompt exceeds 150 tokens, break into phases:
```
Phase 1: Create backend API for appointments
Phase 2: Build frontend booking calendar
Phase 3: Add notification system
```

## ─────────────────────────────────────────────────────────
## CONTEXT WINDOW HEALTH CHECK (--analyze flag)
## ─────────────────────────────────────────────────────────

Run `/optimize --analyze` to check:

### What gets analyzed:
1. **Current context usage** (estimated token count)
2. **CLAUDE.md size** (should be < 3000 tokens)
3. **.claude/rules/** total size (should be < 5000 tokens combined)
4. **Recent conversation depth** (how many turns)
5. **Repeated information** (same stack mentioned multiple times)

### Output format:
```
📊 Context Window Health Report
────────────────────────────────────────

Current conversation:  ~12,500 tokens
CLAUDE.md:             ~1,800 tokens   ✅ Healthy
.claude/rules/:        ~4,200 tokens   ✅ Healthy
Recent turns:          8 turns

🎯 Optimization opportunities:
  • Remove duplicated stack descriptions (save ~400 tokens)
  • Compress verbose prompts (save ~1,200 tokens)
  • Clear old debug output (save ~600 tokens)

💡 Recommendations:
  1. Use templates for next 5 prompts → save ~2,000 tokens
  2. Avoid repeating context already in CLAUDE.md
  3. Use file paths instead of describing locations

Estimated space after cleanup: ~19,000 tokens available
```

### Warning thresholds:
- **Yellow (70% full)**: Start using shorter prompts
- **Orange (85% full)**: Use templates only, no prose
- **Red (95% full)**: Clear conversation or finish task

## ─────────────────────────────────────────────────────────
## USING THIS COMMAND
## ─────────────────────────────────────────────────────────

### Mode 1: Optimize a given prompt
```
/optimize "Can you please help me add a search feature to the employee list?"

Output:
❌ BEFORE (12 tokens)
"Can you please help me add a search feature to the employee list?"

✅ AFTER (6 tokens)
"Add search to employee list"

💰 SAVED: 6 tokens (50% reduction)

🎯 Applied rules:
  • Removed filler words ("Can you please help me")
  • Changed request to command ("add" not "add a feature")
  • Kept specific location ("employee list")
```

### Mode 2: Show template
```
/optimize template fix

Output:
📋 FIX Template (8-15 tokens avg)
────────────────────────────────

Format:
  Fix [symptom] in [file/location]

Examples:
  ✅ Fix pagination offset in src/hooks/useEmployees.js
  ✅ Fix form not submitting in LoginForm.jsx
  ✅ Fix API 500 on POST /api/orders

Copy-paste ready:
  Fix [describe symptom] in [file path]
```

### Mode 3: Analyze context health
```
/optimize --analyze

[Shows full context health report as described above]
```

## ─────────────────────────────────────────────────────────
## BEFORE vs AFTER EXAMPLES
## ─────────────────────────────────────────────────────────

### Example 1: Feature Request
```
❌ BEFORE (87 tokens)
"Hi Claude! I'm working on a React application with TypeScript and I need to add
a new feature for managing employees. The feature should include a list view where
users can see all employees, and a form for adding or editing employee details.
It would be great if you could also add search and filter functionality. Please
make sure to follow the project's coding standards and add appropriate tests.
Thank you so much!"

✅ AFTER (10 tokens)
Create employee management with list, form, search, filter, tests

💰 SAVED: 77 tokens (89% reduction)
```

### Example 2: Bug Fix
```
❌ BEFORE (64 tokens)
"Hey, I'm experiencing an issue with the pagination on the appointments screen.
When I click on page 2, it shows the same data as page 1. I think there might
be something wrong with how we're calculating the offset or maybe the useEffect
dependencies aren't set up correctly. Could you investigate and fix this?"

✅ AFTER (11 tokens)
Fix pagination showing duplicate data in AppointmentList.jsx

💰 SAVED: 53 tokens (83% reduction)
```

### Example 3: Code Review
```
❌ BEFORE (72 tokens)
"I just finished working on the payment processing feature and created a pull
request. Before I merge it, I'd like you to review the code and check if there
are any security vulnerabilities, especially around handling sensitive card data
and API keys. Also, please verify that error handling is implemented properly
throughout the payment flow."

✅ AFTER (13 tokens)
Review payment PR for security: card data handling, secrets, error handling

💰 SAVED: 59 tokens (82% reduction)
```

### Example 4: Refactor
```
❌ BEFORE (58 tokens)
"The EmployeeList component has gotten quite large and complex. I think we should
refactor it to make it more maintainable. Maybe we could extract some of the logic
into smaller components or custom hooks? Let's try to improve the code organization
and reduce duplication if possible."

✅ AFTER (12 tokens)
Refactor EmployeeList.jsx: extract components, reduce duplication

💰 SAVED: 46 tokens (79% reduction)
```

### Example 5: Testing
```
❌ BEFORE (55 tokens)
"We need to add test coverage for the pricing calculator utility function.
It handles discount calculations, tax, and shipping costs. Please write
comprehensive tests that cover normal cases as well as edge cases like
zero quantities, negative discounts, and missing data."

✅ AFTER (14 tokens)
Write tests for pricing.js: discounts, tax, shipping, edge cases

💰 SAVED: 41 tokens (75% reduction)
```

## ─────────────────────────────────────────────────────────
## OPTIMIZATION PROCESS (how this command works)
## ─────────────────────────────────────────────────────────

When you run `/optimize` with a prompt:

**Step 1: Parse & Analyze**
- Count current tokens
- Identify filler words and phrases
- Detect redundant context (stack info, location descriptions)
- Find uncertain language ("maybe", "I think")

**Step 2: Apply Compression Rules**
- Remove filler words
- Convert requests to commands
- Strip redundant context
- Condense multi-sentence to bullet points
- Preserve critical specifics (file paths, requirements)

**Step 3: Validate**
- Ensure meaning preserved
- Check all requirements captured
- Verify specificity maintained
- Calculate token savings

**Step 4: Report**
```
❌ BEFORE (X tokens)
[original verbose prompt]

✅ AFTER (Y tokens)
[optimized command]

💰 SAVED: Z tokens (XX% reduction)

🎯 Applied rules:
  • [rule 1]
  • [rule 2]
  • [rule 3]

📋 Equivalent template: [template name]
```

## ─────────────────────────────────────────────────────────
## QUICK REFERENCE CARD
## ─────────────────────────────────────────────────────────

**Filler words to remove:**
please, kindly, can you, could you, would you, I would like,
I think, maybe, possibly, perhaps, if possible, thank you,
thanks, appreciate it, Hi, Hey

**Command starters (use these):**
Create, Build, Add, Fix, Debug, Update, Refactor, Review,
Write, Test, Extract, Optimize, Implement

**Stack info to skip (already in CLAUDE.md):**
"I'm using React", "The backend is Node.js", "We have MongoDB",
"The project uses Tailwind", "Testing with Jest"

**Be specific about:**
- File paths (src/components/File.jsx)
- Line numbers (line 42)
- Exact error messages
- Specific requirements
- Expected behavior

**Token budget targets:**
- Simple fix:      10-30 tokens
- Medium feature:  30-80 tokens
- Large feature:   80-150 tokens
- Complex system:  Break into phases

**Templates save time:**
- /optimize template [feature|fix|review|test|refactor]
- Copy, fill in blanks, paste
- Avg 70-85% token reduction
