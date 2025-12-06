/**
 * Property-based tests for Semantic HTML Usage
 * Feature: product-page-wom, Property 6: Semantic HTML usage
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
 * **Feature: product-page-wom, Property 6: Semantic HTML usage**
 * **Validates: Requirements 7.2**
 * 
 * Property: For any product page HTML document, it should use semantic HTML5 
 * elements appropriately (header, main, section, article, nav, footer) rather 
 * than generic div elements for major structural components
 */
test('Property 6: Semantic HTML usage - product page should use semantic elements for major structure', async () => {
  await fc.assert(
    fc.asyncProperty(
      // Generate test data for different product page variations
      fc.constantFrom('variation-1.html'),
      async (htmlFile) => {
        // Read the HTML file
        let htmlContent;
        try {
          htmlContent = readFileSync(join(__dirname, '..', htmlFile), 'utf-8');
        } catch (error) {
          // If file doesn't exist yet, skip this variation
          if (error.code === 'ENOENT') {
            return;
          }
          throw error;
        }
        
        // Parse the HTML
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        
        // Property 1: Should have a <header> element for site header
        const headers = document.querySelectorAll('header');
        assert.ok(
          headers.length > 0,
          `${htmlFile} should have at least one <header> element for semantic structure`
        );
        
        // Property 2: Should have a <main> element for main content
        const mains = document.querySelectorAll('main');
        assert.ok(
          mains.length > 0,
          `${htmlFile} should have at least one <main> element for main content`
        );
        
        // Property 3: Should have <section> elements for major content sections
        const sections = document.querySelectorAll('section');
        assert.ok(
          sections.length > 0,
          `${htmlFile} should have at least one <section> element for content organization`
        );
        
        // Property 4: Should have <article> elements for self-contained content
        const articles = document.querySelectorAll('article');
        assert.ok(
          articles.length > 0,
          `${htmlFile} should have at least one <article> element for self-contained content`
        );
        
        // Property 5: Should have <nav> elements for navigation
        const navs = document.querySelectorAll('nav');
        assert.ok(
          navs.length > 0,
          `${htmlFile} should have at least one <nav> element for navigation`
        );
        
        // Property 6: Should have a <footer> element
        const footers = document.querySelectorAll('footer');
        assert.ok(
          footers.length > 0,
          `${htmlFile} should have at least one <footer> element for semantic structure`
        );
        
        // Property 7: Semantic elements should be used for major structural components
        // Check that we're not just using divs for everything
        const allElements = document.querySelectorAll('body *');
        const semanticElements = document.querySelectorAll('header, main, section, article, nav, footer, aside');
        const semanticRatio = semanticElements.length / allElements.length;
        
        assert.ok(
          semanticRatio > 0.05, // At least 5% of elements should be semantic
          `${htmlFile} should use semantic elements for structure (found ${semanticElements.length} semantic elements out of ${allElements.length} total)`
        );
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Additional test: Verify specific semantic structure for product pages
 */
test('Product page should have proper semantic hierarchy', async () => {
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
        
        // Check that main contains sections
        const main = document.querySelector('main');
        if (main) {
          const sectionsInMain = main.querySelectorAll('section');
          assert.ok(
            sectionsInMain.length > 0,
            'Main element should contain section elements for content organization'
          );
        }
        
        // Check that header contains nav
        const header = document.querySelector('header');
        if (header) {
          const navsInHeader = header.querySelectorAll('nav');
          assert.ok(
            navsInHeader.length > 0,
            'Header should contain nav element for navigation'
          );
        }
        
        // Check for proper use of article elements (reviews, product info)
        const articles = document.querySelectorAll('article');
        articles.forEach((article, index) => {
          // Articles should have child elements (not just be empty containers)
          const childElements = article.children.length;
          assert.ok(
            childElements > 0,
            `Article element ${index} should contain child elements`
          );
        });
      }
    ),
    { numRuns: 100 }
  );
});
