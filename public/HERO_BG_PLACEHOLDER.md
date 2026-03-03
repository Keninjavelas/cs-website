# Hero Background Image Guide

## 📸 Required Background Image

## Required File
**Filename**: `hero-bg.jpg`
**Location**: `/public/hero-bg.jpg`

## Specifications
- **Dimensions**: Minimum 1920×1080px (Full HD), ideally 2560×1440px
- **Aspect Ratio**: 16:9 (landscape)
- **Format**: JPEG (optimized for web) or WebP for better compression
- **File Size**: < 300KB (compressed and optimized)
- **Theme**: Professional tech/institutional imagery
- **Style**: Subtle, not overpowering (will have dark overlay)

## 🎨 Design Guidelines

### Recommended Themes:
1. **Circuit boards** - Close-up, blue/teal tones
2. **Data visualization** - Abstract networks, connections
3. **Abstract technology** - Geometric patterns, digital grids
4. **Computing environments** - Modern data centers, minimalist tech
5. **Neural networks** - AI/ML themed visuals
6. **Code/terminal** - Blurred code backgrounds

### Color Preferences:
- **Primary**: Dark blues, navy, teals
- **Accents**: Subtle oranges, cyans, purples
- **Avoid**: Bright colors (will be overlayed), busy patterns

### Composition:
- Center-focused or evenly distributed
- No text or logos in the image
- Subtle, professional tone
- Good for institutional/academic setting

## How to Add
1. Download a high-quality tech-themed image from Unsplash, Pexels, or Pixabay
2. Resize if needed to 1920×1080px or 2560×1440px
3. Compress the image to < 300KB using:
	- [TinyPNG](https://tinypng.com)
	- [Squoosh](https://squoosh.app)
	- [ImageOptim](https://imageoptim.com) (Mac)
4. Rename to `hero-bg.jpg`
5. Place directly in `/public/` directory (not in a subdirectory)
6. Refresh the homepage to see the result

## 🔍 Free Image Sources

### Unsplash (Free, High Quality):
- [Technology Photos](https://unsplash.com/s/photos/technology)
- [Circuit Board](https://unsplash.com/s/photos/circuit-board)
- [Data Network](https://unsplash.com/s/photos/data-network)
- [Abstract Tech](https://unsplash.com/s/photos/abstract-technology)

### Pexels (Free, Commercial Use):
- [Technology](https://www.pexels.com/search/technology/)
- [Circuit](https://www.pexels.com/search/circuit/)
- [Digital](https://www.pexels.com/search/digital/)

### Pixabay (Free, No Attribution):
- [Tech Background](https://pixabay.com/images/search/technology%20background/)

## 📝 Search Keywords:
- "motherboard close up"
- "blue technology"
- "data center"
- "neural network visualization"
- "digital grid"
- "technological innovation"

## 🎯 What's Already Implemented

The hero section includes:
- ✅ Fixed background attachment (parallax effect on desktop)
- ✅ Multi-layer professional overlay system
- ✅ Dark navy gradient for institutional feel
- ✅ Glass morphism container for content
- ✅ Optimized for mobile (no fixed attachment on mobile for performance)
- ✅ Subtle noise texture for depth
- ✅ No layout shift or CLS issues

## ⚡ Performance Tips

### Compression Settings:
- **JPEG Quality**: 75-85%
- **WebP Quality**: 80-85%
- **Progressive JPEG**: Yes (for faster perceived load)

### Before Upload:
1. **Resize** to exact dimensions (don't rely on CSS)
2. **Compress** using tools above
3. **Test** file size (should be 200-300KB max)
4. **Preview** with overlay to ensure it looks good darkened

## 🚫 Fallback Behavior

If `hero-bg.jpg` is not present:
- Hero section will display with gradient backgrounds only
- No broken images or errors
- Still looks professional (designed as fallback)
- Adding the image enhances visual depth


**Need Help?** See detailed documentation: `/docs/BRANDING_UPDATE.md`

**Last Updated**: March 3, 2026
