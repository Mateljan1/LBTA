#!/bin/bash
# Quick helper to copy email HTML to clipboard for pasting into ActiveCampaign
# Usage: ./scripts/copy-email-html.sh [path]  # defaults to LBTA_Spring2026_Schedule_SEND_READY.html

FILE="${1:-assets/emails/spring-2026/prospects/LBTA_Spring2026_Schedule_SEND_READY.html}"

if [ ! -f "$FILE" ]; then
  echo "❌ File not found: $FILE"
  exit 1
fi

# Copy to clipboard (macOS)
if command -v pbcopy > /dev/null; then
  cat "$FILE" | pbcopy
  echo "✅ HTML copied to clipboard!"
  echo "   File: $FILE"
  echo "   Length: $(wc -c < "$FILE" | xargs) characters"
  echo ""
  echo "📋 Next steps:"
  echo "   1. Open your campaign in ActiveCampaign"
  echo "   2. Click 'Continue' or 'Edit'"
  echo "   3. Switch to HTML/code view (</> icon)"
  echo "   4. Select all (Cmd+A) and paste (Cmd+V)"
  echo "   5. Save"
elif command -v xclip > /dev/null; then
  cat "$FILE" | xclip -selection clipboard
  echo "✅ HTML copied to clipboard (Linux)!"
else
  echo "⚠️  Clipboard not available. Displaying first 500 chars:"
  head -c 500 "$FILE"
  echo ""
  echo "   Full file: $FILE"
fi
