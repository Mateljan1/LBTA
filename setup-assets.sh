#!/bin/bash

echo "🎾 LBTA Asset Setup Script"
echo "=========================="
echo ""

# Create directories
echo "Creating directories..."
mkdir -p public/photos
mkdir -p public/logos

# Copy all LBTA Photos
echo "Copying LBTA Photos..."
cp "/Users/andrew-mac-studio/Library/Mobile Documents/com~apple~CloudDocs/Workspace/Manual Library/Brands/LBTA/Laguna_Beach_Tennis_Academy_CONSOLIDATED/Business_Documents/Content/Images/LBTA Photos"/*.jpg public/photos/

echo "✅ Copied $(ls public/photos/*.jpg | wc -l) photos"

# Copy logos from Brand Logos PNG folder
# Note: You'll need to identify which PNG file is which logo and rename accordingly

echo ""
echo "📂 Logo files are in: /Users/andrew-mac-studio/Downloads/laguna-beach-tennis-academy-base44/Brand Logos PNG/"
echo ""
echo "Please manually copy and rename logos to public/logos/ as:"
echo "  - fit4tennis.png"
echo "  - vylo.png"  
echo "  - racketrescue.png"
echo "  - racquetiq.png"
echo "  - gptca.png"
echo "  - toroline.png"
echo "  - tennisbeast.png"
echo "  - lbhs.png"
echo ""
echo "✅ Setup complete! Logos need manual rename."
echo "🚀 Refresh http://localhost:3002 to see changes"

