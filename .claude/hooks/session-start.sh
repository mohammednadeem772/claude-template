#!/bin/bash
# .claude/hooks/session-start.sh
# Runs every time Claude Code session starts
# Shows project context at a glance

echo ""
echo "╔══════════════════════════════════════╗"
echo "║         Claude Code Session          ║"
echo "╚══════════════════════════════════════╝"
echo "  Project : $(basename $(pwd))"
echo "  Branch  : $(git branch --show-current 2>/dev/null || echo 'not a git repo')"
echo "  Date    : $(date '+%d %b %Y  %H:%M')"
echo ""

# Show last 5 commits
echo "── Recent Commits ──────────────────────"
git log --oneline -5 2>/dev/null || echo "  (no git history)"
echo ""

# Warn about uncommitted changes
CHANGES=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
if [ "$CHANGES" -gt "0" ]; then
  echo "  ⚠  $CHANGES uncommitted change(s)"
  git status --short 2>/dev/null
  echo ""
fi

# Show test status if package.json exists
if [ -f "package.json" ]; then
  echo "── Stack ────────────────────────────────"
  echo "  Node: $(node --version 2>/dev/null || echo 'not found')"
  echo "  npm:  $(npm --version 2>/dev/null || echo 'not found')"
fi

if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
  echo "── Stack ────────────────────────────────"
  echo "  Python: $(python --version 2>/dev/null || echo 'not found')"
fi

echo "────────────────────────────────────────"
echo ""
