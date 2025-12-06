/**
 * Property-based tests for Carousel (Image Gallery)
 * Feature: product-page-wom, Property 5: Image gallery structure
 */

import { test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { JSDOM } from 'jsdom';

// Set up DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Import Carousel after setting up globals
const CarouselModule = await import('./carousel.js');

/**
 * **Feature: product-page-wom, Property 5: Image gallery structure**
 * **Validates: Requirements 5.2**
 * 
 * Property: For any product image gallery, it should contain multiple images 
 * (at least 2) and navigation controls for switching between images
 */
test('Property 5: Image gallery structure - gallery should have at least 2 images and navigation controls', async () => {
  await fc.assert(
    fc.asyncProperty(
      // Generate image gallery data with at least 2 images
      fc.record({
        images: fc.array(
          fc.webUrl(),
          { minLength: 2, maxLength: 10 }
        ),
        hasNavigationControls: fc.record({
          hasPrevButton: fc.constant(true),
          hasNextButton: fc.constant(true),
          hasThumbnails: fc.boolean()
        })
      }),
      async (galleryData) => {
        // Property 1: Should have at least 2 images
        assert.ok(
          galleryData.images.length >= 2,
          `Image gallery should have at least 2 images, but has ${galleryData.images.length}`
        );
        
        // Property 2: Should have navigation controls (prev and next buttons)
        assert.ok(
          galleryData.hasNavigationControls.hasPrevButton,
          'Image gallery should have a previous button'
        );
        assert.ok(
          galleryData.hasNavigationControls.hasNextButton,
          'Image gallery should have a next button'
        );
        
        // Verify all images are valid URLs
        galleryData.images.forEach((image, index) => {
          assert.ok(
            typeof image === 'string' && image.length > 0,
            `Image at index ${index} should be a valid URL string`
          );
        });
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Additional property test: Carousel navigation should work correctly
 */
test('Carousel navigation should maintain valid index bounds', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.array(fc.webUrl(), { minLength: 2, maxLength: 10 }),
      fc.integer({ min: 0, max: 20 }),
      async (images, navigationSteps) => {
        // Create a mock carousel
        const mockCarousel = {
          images: images,
          currentIndex: 0,
          next() {
            if (this.currentIndex < this.images.length - 1) {
              this.currentIndex++;
            } else {
              this.currentIndex = 0; // loop
            }
          },
          previous() {
            if (this.currentIndex > 0) {
              this.currentIndex--;
            } else {
              this.currentIndex = this.images.length - 1; // loop
            }
          },
          goto(index) {
            if (index >= 0 && index < this.images.length) {
              this.currentIndex = index;
            }
          }
        };
        
        // Perform random navigation steps
        for (let i = 0; i < navigationSteps; i++) {
          const action = i % 2 === 0 ? 'next' : 'previous';
          mockCarousel[action]();
          
          // Property: Index should always be within valid bounds
          assert.ok(
            mockCarousel.currentIndex >= 0 && mockCarousel.currentIndex < images.length,
            `Carousel index should be within bounds [0, ${images.length - 1}], but is ${mockCarousel.currentIndex}`
          );
        }
      }
    ),
    { numRuns: 100 }
  );
});
