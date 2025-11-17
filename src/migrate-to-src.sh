#!/bin/bash

# Vinyl$ Project Migration Script
# This script moves files from Figma Make structure to standard npm structure

echo "🎵 Vinyl\$ Project Migration Script"
echo "===================================="
echo ""

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/components/ui
mkdir -p src/components/figma
mkdir -p src/utils
mkdir -p src/styles
mkdir -p public

# Copy components (excluding ui folder)
echo "📦 Copying components..."
if [ -d "components" ]; then
  for file in components/*.tsx; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      echo "  - $filename"
      cp "$file" "src/components/"
    fi
  done
fi

# Copy UI components
echo "📦 Copying UI components..."
if [ -d "components/ui" ]; then
  cp components/ui/*.tsx src/components/ui/ 2>/dev/null || true
  cp components/ui/*.ts src/components/ui/ 2>/dev/null || true
  echo "  - Copied all UI components"
fi

# Copy figma components
echo "📦 Copying Figma components..."
if [ -d "components/figma" ]; then
  cp components/figma/*.tsx src/components/figma/ 2>/dev/null || true
  echo "  - Copied Figma components"
fi

# Copy utils
echo "📦 Copying utils..."
if [ -d "utils" ]; then
  cp utils/api.ts src/utils/ 2>/dev/null || true
  echo "  - api.ts"
fi

# Copy styles
echo "📦 Copying styles..."
if [ -d "styles" ]; then
  cp styles/globals.css src/styles/ 2>/dev/null || true
  echo "  - globals.css"
fi

echo ""
echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:5173"
echo ""
echo "Happy collecting! 🎵"
