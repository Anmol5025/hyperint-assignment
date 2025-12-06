# Product Page WOM Variations

A showcase of three distinct design approaches for integrating Word of Mouth (WOM) social proof elements into e-commerce product pages. Built with vanilla HTML, CSS, and JavaScript, featuring comprehensive property-based testing and WCAG 2.1 Level AA accessibility compliance.

## Project Overview

This project demonstrates different layout philosophies for presenting product information, customer reviews, live engagement metrics, and social proof elements. Each variation maintains core e-commerce functionality while exploring unique visual and interaction patterns.

## Design Variations

### Variation 1: Classic E-commerce Layout
Traditional left-image, right-details layout with sticky WOM sidebar and below-fold review grid.

### Variation 2: Modern Split-Screen Layout
Full-height image gallery (50%) with scrollable product details, floating social proof cards, and integrated review carousel.

### Variation 3: Magazine-Style Layout
Hero product image with overlay details, horizontal scrolling customer photos, and card-based review system.

## Quick Start

### View Locally
1. Clone or download the repository
2. Open `index.html` in a web browser
3. Navigate to any variation from the landing page

No build process or server required for basic viewing.

### Run Tests
```bash
npm install
npm test
```

### Build for Production
```bash
npm run build
```
Output will be in `./dist/` directory with minified CSS (33% smaller) and JavaScript (35% smaller).

## Project Structure

```
product-page-wom/
├── index.html                 # Landing page
├── variation-1.html           # Classic layout
├── variation-2.html           # Split-screen layout
├── variation-3.html           # Magazine layout
├── build.js                   # Production build script
├── package.json               # Dependencies and scripts
├── README.md                  # This file
├── css/
│   ├── common.css            # Shared styles, reset, utilities
│   ├── variation-1.css       # Classic layout styles
│   ├── variation-2.css       # Split-screen styles
│   └── variation-3.css       # Magazine styles
└── js/
    ├── carousel.js           # Image carousel functionality
    ├── carousel.test.js      # Carousel tests
    ├── live-counter.js       # Counter animations
    ├── live-counter.test.js  # Counter tests
    ├── reviews.js            # Review interactions
    ├── reviews.test.js       # Review tests
    ├── animations.js         # Scroll animations
    ├── mock-data.js          # Centralized mock data
    ├── image-placeholders.js # Placeholder generation
    ├── semantic-html.test.js # HTML structure tests
    └── social-proof.test.js  # Social proof tests
```

## Features

### Core Features
- Three distinct layout variations
- Live engagement metrics (views, purchases, cart additions)
- Social proof widgets (ratings, reviews, trust badges)
- Customer review sections with photos
- Product image galleries with navigation
- Interactive product options (size, color, quantity)
- Responsive design principles

### Technical Features
- Semantic HTML5 markup
- CSS Grid and Flexbox layouts
- Vanilla JavaScript (no frameworks)
- Smooth animations and transitions
- Keyboard navigation support
- WCAG 2.1 Level AA accessibility
- Property-based testing with fast-check
- Automated build system

## Testing

### Property-Based Tests (6 properties)
1. **Live counter completeness** - Validates 2+ metric types
2. **Social proof widget structure** - Validates rating, score, and review count
3. **Review card completeness** - Validates name, rating, date, and comment
4. **Review section minimum count** - Validates 3+ reviews
5. **Image gallery structure** - Validates 2+ images and navigation
6. **Semantic HTML usage** - Validates proper HTML5 elements

### Unit Tests
- Carousel navigation
- Counter animations
- Review interactions
- DOM manipulation

All tests run with 100 iterations each for comprehensive coverage.

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## Accessibility (WCAG 2.1 Level AA)

### Keyboard Navigation
- **Tab/Shift+Tab**: Navigate interactive elements
- **Enter/Space**: Activate buttons and links
- **Arrow Keys**: Navigate carousels and selectors
- **Escape**: Close modals

### Color Contrast
- Primary text: 15.8:1 (AAA level)
- Secondary text: 5.7:1 (AA level)
- Interactive elements: 5.9:1 minimum
- All text meets 4.5:1 minimum requirement

### Features
- Semantic HTML5 structure
- ARIA labels on icon-only buttons
- Visible focus indicators (2px outline)
- Screen reader compatible
- Keyboard-accessible interactive elements

## Build & Optimization

### Production Build
```bash
npm run build
```

**Optimizations:**
- CSS minification (32-34% reduction)
- JavaScript minification (25-43% reduction)
- Total savings: 50.56 KB
- Output: Production-ready files in `./dist/`

### Already Optimized
- SEO-friendly meta tags
- SVG emoji favicons
- Native lazy loading on images
- Semantic HTML structure
- Efficient event delegation

### Performance Targets
- Lighthouse score: 90+
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Total image weight: < 2MB per page

## Mock Data

### Product Information
- Premium Cotton Formal Trousers by StyleCraft
- Pricing: ₹1,299 (35% off from ₹1,999)
- 7 sizes (30-42), 4 colors
- 8 detailed features
- 45 units in stock

### Customer Reviews
- 11 unique reviews across all variations
- 4.7 average rating (342 total reviews)
- Realistic Indian names and feedback
- Mix of detailed and brief reviews

### Live Metrics
- 1,247 current viewers
- 89 sold today
- 34 items in carts
- Recent purchases with locations

### Images
- Uses Unsplash URLs for product images
- JavaScript-generated placeholders for missing images
- Lazy loading enabled on all images

## Design System

### Color Palette
- Primary: `#2563eb` (Blue)
- Secondary: `#7c3aed` (Purple)
- Accent: `#f59e0b` (Orange)
- Text Primary: `#1f2937`
- Text Secondary: `#6b7280`

### Typography
- Font: System font stack
- Base size: 16px
- Line height: 1.6

### Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64px

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox
- **JavaScript**: ES6+ vanilla JavaScript
- **Testing**: Node.js test runner, fast-check (PBT)
- **Build**: Custom build script (no bundler required)

## Browser Support

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Metrics

### Development
- CSS: 93.2 KB (unminified)
- JS: 59.4 KB (unminified)
- HTML: ~45 KB total

### Production (Minified)
- CSS: 63.6 KB (32% reduction)
- JS: 38.4 KB (35% reduction)
- Total savings: 50.56 KB

### With Gzip
- CSS: ~18 KB
- JS: ~14 KB
- HTML: ~12 KB
- Total: ~44 KB (excluding images)

## Production Deployment

1. **Build assets**
   ```bash
   npm run build
   ```

2. **Deploy from dist/ directory**
   - All references automatically updated
   - Minified CSS and JavaScript

3. **Server configuration**
   - Enable Gzip compression
   - Set cache headers for static assets
   - Serve over HTTPS

4. **Verify**
   - Run Lighthouse audit (target: 90+)
   - Test on multiple devices
   - Verify all functionality

## Use Cases

- **Designers**: Exploring layout approaches for product pages
- **Developers**: Learning modern CSS layout techniques
- **Product Teams**: Evaluating WOM element placement
- **Students**: Studying e-commerce UI/UX patterns
- **Prototyping**: Quick mockups for presentations


