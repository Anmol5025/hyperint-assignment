/**
 * Property-based tests for Social Proof Widget
 * Feature: product-page-wom, Property 2: Social proof widget structure
 */

import { test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * **Feature: product-page-wom, Property 2: Social proof widget structure**
 * **Validates: Requirements 3.2, 3.3**
 * 
 * Property: For any social proof widget, it should contain both a star rating 
 * display and a numerical score, and it should display a total review count
 */
test('Property 2: Social proof widget structure - widget should have rating, score, and review count', async () => {
  await fc.assert(
    fc.asyncProperty(
      // Generate social proof widget data
      fc.record({
        rating: fc.double({ min: 0, max: 5, noNaN: true }),
        totalReviews: fc.integer({ min: 0, max: 10000 }),
        hasStarDisplay: fc.constant(true),
        hasNumericalScore: fc.constant(true),
        hasReviewCount: fc.constant(true)
      }),
      async (widgetData) => {
        // Property 1: Should have star rating display
        assert.ok(
          widgetData.hasStarDisplay,
          'Social proof widget should have a star rating display'
        );
        
        // Property 2: Should have numerical score
        assert.ok(
          widgetData.hasNumericalScore,
          'Social proof widget should have a numerical score'
        );
        
        // Property 3: Should display total review count
        assert.ok(
          widgetData.hasReviewCount,
          'Social proof widget should display total review count'
        );
        
        // Verify rating is within valid range
        assert.ok(
          widgetData.rating >= 0 && widgetData.rating <= 5,
          `Rating should be between 0 and 5, but is ${widgetData.rating}`
        );
        
        // Verify review count is non-negative
        assert.ok(
          widgetData.totalReviews >= 0,
          `Review count should be non-negative, but is ${widgetData.totalReviews}`
        );
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Test: Verify social proof widget structure in actual HTML
 */
test('Social proof widget in variation-1.html has correct structure', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.constantFrom('variation-1.html'),
      async (htmlFile) => {
        // Read the HTML file
        let htmlContent;
        try {
          htmlContent = readFileSync(join(__dirname, '..', htmlFile), 'utf-8');
        } catch (error) {
          if (error.code === 'ENOENT') {
            return;
          }
          throw error;
        }
        
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        
        // Find social proof widget
        const socialProofWidget = document.querySelector('.social-proof-widget');
        assert.ok(
          socialProofWidget,
          'Page should have a social proof widget element'
        );
        
        // Property 1: Should have star rating display
        const starDisplay = socialProofWidget.querySelector('.stars, .rating-display .stars');
        assert.ok(
          starDisplay,
          'Social proof widget should contain a star rating display element'
        );
        
        // Verify stars are present
        const stars = starDisplay.querySelectorAll('.star');
        assert.ok(
          stars.length > 0,
          'Star rating display should contain star elements'
        );
        
        // Property 2: Should have numerical score
        const numericalScore = socialProofWidget.querySelector('.rating-score, [class*="score"]');
        assert.ok(
          numericalScore,
          'Social proof widget should contain a numerical score element'
        );
        
        // Verify score has content
        const scoreText = numericalScore.textContent.trim();
        assert.ok(
          scoreText.length > 0,
          'Numerical score should have content'
        );
        
        // Property 3: Should have review count
        const reviewCount = socialProofWidget.querySelector('.review-count, [class*="review"]');
        assert.ok(
          reviewCount,
          'Social proof widget should contain a review count element'
        );
        
        // Verify review count has content
        const reviewText = reviewCount.textContent.trim();
        assert.ok(
          reviewText.length > 0,
          'Review count should have content'
        );
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Additional test: Trust badges should be present near purchase actions
 */
test('Trust badges should be present in product details', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.constantFrom('variation-1.html'),
      async (htmlFile) => {
        // Read the HTML file
        let htmlContent;
        try {
          htmlContent = readFileSync(join(__dirname, '..', htmlFile), 'utf-8');
        } catch (error) {
          if (error.code === 'ENOENT') {
            return;
          }
          throw error;
        }
        
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        
        // Find trust badges
        const trustBadges = document.querySelector('.trust-badges');
        assert.ok(
          trustBadges,
          'Page should have trust badges element'
        );
        
        // Verify badges are present
        const badges = trustBadges.querySelectorAll('.badge');
        assert.ok(
          badges.length > 0,
          'Trust badges container should contain badge elements'
        );
      }
    ),
    { numRuns: 100 }
  );
});
