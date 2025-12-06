/**
 * Image Placeholder Generator
 * Creates simple placeholder images for development
 */

// Generate a placeholder image data URI
function generatePlaceholder(width, height, text) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = '#666';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  // Dimensions
  ctx.font = '16px Arial';
  ctx.fillText(`${width}x${height}`, width / 2, height / 2 + 30);
  
  return canvas.toDataURL('image/png');
}

// Placeholder image mappings
const placeholderImages = {
  'assets/images/product-main.jpg': { width: 1200, height: 1600, text: 'Product Main' },
  'assets/images/product-side.jpg': { width: 1200, height: 1600, text: 'Product Side' },
  'assets/images/product-back.jpg': { width: 1200, height: 1600, text: 'Product Back' },
  'assets/images/product-detail.jpg': { width: 1200, height: 1600, text: 'Product Detail' },
  'assets/images/customer-1.jpg': { width: 800, height: 1000, text: 'Customer 1' },
  'assets/images/customer-2.jpg': { width: 800, height: 1000, text: 'Customer 2' },
  'assets/images/customer-3.jpg': { width: 800, height: 1000, text: 'Customer 3' },
  'assets/images/customer-4.jpg': { width: 800, height: 1000, text: 'Customer 4' },
  'assets/images/customer-5.jpg': { width: 800, height: 1000, text: 'Customer 5' },
  'assets/images/customer-6.jpg': { width: 800, height: 1000, text: 'Customer 6' },
  'assets/images/review-photo-1.jpg': { width: 400, height: 400, text: 'Review 1' },
  'assets/images/review-photo-2.jpg': { width: 400, height: 400, text: 'Review 2' },
  'assets/images/review-photo-3.jpg': { width: 400, height: 400, text: 'Review 3' },
  'assets/images/review-photo-4.jpg': { width: 400, height: 400, text: 'Review 4' }
};

// Helper to determine placeholder size from image element
function getPlaceholderSize(img) {
  // Try to get dimensions from the image element
  const width = img.naturalWidth || img.width || 800;
  const height = img.naturalHeight || img.height || 600;
  return { width, height };
}

// Replace broken images with placeholders on page load
function initPlaceholders() {
  document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      const src = img.getAttribute('src');
      
      // Immediately replace local asset paths with placeholders
      if (src && src.startsWith('assets/images/')) {
        if (placeholderImages[src]) {
          const { width, height, text } = placeholderImages[src];
          img.src = generatePlaceholder(width, height, text);
        } else {
          // Generic placeholder for unknown assets
          img.src = generatePlaceholder(800, 600, 'Image Not Found');
        }
      }
      
      // Also handle image load errors for other cases
      img.addEventListener('error', function() {
        const errorSrc = this.getAttribute('src');
        if (placeholderImages[errorSrc]) {
          const { width, height, text } = placeholderImages[errorSrc];
          this.src = generatePlaceholder(width, height, text);
        } else if (!errorSrc.startsWith('data:')) {
          // Generic placeholder (avoid replacing data URIs)
          const { width, height } = getPlaceholderSize(this);
          const text = this.alt || 'Image Not Found';
          this.src = generatePlaceholder(width, height, text);
        }
      });
      
      // Set a timeout to check if external images loaded
      if (src && (src.startsWith('http://') || src.startsWith('https://'))) {
        setTimeout(() => {
          if (!img.complete || img.naturalWidth === 0) {
            const { width, height } = getPlaceholderSize(img);
            const text = img.alt || 'Loading...';
            img.src = generatePlaceholder(width, height, text);
          }
        }, 5000); // 5 second timeout for external images
      }
    });
  });
}

// Initialize if in browser
if (typeof window !== 'undefined') {
  initPlaceholders();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generatePlaceholder,
    placeholderImages
  };
}
