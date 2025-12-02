# PWA Icons - Generation Required

## Required Icon Sizes

The following icon sizes need to be generated from your logo for optimal iOS and Android support:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png (iOS)
- icon-192x192.png (Android)
- icon-384x384.png
- icon-512x512.png (High-res Android)

## Source File

Use one of these logos as the base:
- `/public/logos/VYLO Vertical_Icon_Word_Logo_Classic_Wht.png`
- Or create a simplified square icon version of the VYLO logo

## Generation Tools

**Option 1: Online Generator**
- https://www.pwabuilder.com/imageGenerator
- Upload your logo and it will generate all sizes

**Option 2: Manual with ImageMagick**
```bash
# Install ImageMagick
brew install imagemagick

# Generate all sizes
for size in 72 96 128 144 152 192 384 512; do
  convert your-logo.png -resize ${size}x${size} icon-${size}x${size}.png
done
```

## Notes

- Icons should be square (1:1 aspect ratio)
- Use PNG format with transparency
- Ensure good contrast for both light and dark themes
- Test on both iOS and Android devices
