#!/bin/bash
# .claude/hooks/post-tool.sh
# Runs after every file write/edit by Claude
# Auto-formats code based on file type

FILE="$TOOL_INPUT_PATH"

case "$TOOL_NAME" in
  Write|Edit|MultiEdit)

    if [ -z "$FILE" ]; then
      exit 0
    fi

    EXT="${FILE##*.}"

    case "$EXT" in
      js|jsx|ts|tsx|css|html|json|md)
        if command -v prettier &>/dev/null; then
          prettier --write "$FILE" 2>/dev/null
        fi
        ;;
      py)
        if command -v black &>/dev/null; then
          black "$FILE" 2>/dev/null
        fi
        if command -v isort &>/dev/null; then
          isort "$FILE" 2>/dev/null
        fi
        ;;
      go)
        if command -v gofmt &>/dev/null; then
          gofmt -w "$FILE" 2>/dev/null
        fi
        ;;
      php)
        if command -v php-cs-fixer &>/dev/null; then
          php-cs-fixer fix "$FILE" 2>/dev/null
        fi
        ;;
      rb)
        if command -v rubocop &>/dev/null; then
          rubocop --autocorrect "$FILE" 2>/dev/null
        fi
        ;;
    esac

    # Line count warning
    if [ -f "$FILE" ]; then
      LINES=$(wc -l < "$FILE" | tr -d ' ')
      LIMIT=200

      case "$EXT" in
        ts|tsx|js|jsx) LIMIT=200 ;;
        sh) LIMIT=60 ;;
        md) LIMIT=300 ;;
      esac

      if [ "$LINES" -gt "$LIMIT" ]; then
        echo ""
        echo "  ⚠  LINE LIMIT WARNING"
        echo "  File : $FILE"
        echo "  Lines: $LINES (limit: $LIMIT)"
        echo "  → Consider splitting this file"
        echo ""
      fi
    fi
    ;;

  Bash)
    # Log all bash commands to session log
    mkdir -p .claude
    echo "[$(date '+%H:%M:%S')] $TOOL_INPUT_COMMAND" >> .claude/session.log
    ;;
esac
