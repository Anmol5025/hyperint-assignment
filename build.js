/**
 * Build Script for Product Page WOM
 * Minifies CSS and JavaScript files for production deployment
 */

import { readFile, writeFile, readdir, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple CSS minifier
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace
    .replace(/\s+/g, ' ')
    // Remove spaces around special characters
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove trailing semicolons
    .replace(/;}/g, '}')
    .trim();
}

// Simple JS minifier (basic - for production use terser)
function minifyJS(js) {
  return js
    // Remove single-line comments
    .replace(/\/\/.*$/gm, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove whitespace around operators
    .replace(/\s*([=+\-*/<>!&|,;{}()[\]])\s*/g, '$1')
    .trim();
}

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function minifyCSSFiles() {
  console.log('🎨 Minifying CSS files...\n');
  
  const cssDir = join(__dirname, 'css');
  const outputDir = join(__dirname, 'dist', 'css');
  await ensureDir(outputDir);
  
  const files = await readdir(cssDir);
  let totalSaved = 0;
  
  for (const file of files) {
    if (!file.endsWith('.css') || file.endsWith('.min.css')) continue;
    
    const inputPath = join(cssDir, file);
    const input = await readFile(inputPath, 'utf8');
    const output = minifyCSS(input);
    
    const minFile = file.replace('.css', '.min.css');
    const outputPath = join(outputDir, minFile);
    await writeFile(outputPath, output);
    
    const saved = input.length - output.length;
    totalSaved += saved;
    const percent = ((saved / input.length) * 100).toFixed(1);
    
    console.log(`✓ ${file} → ${minFile}`);
    console.log(`  ${input.length} bytes → ${output.length} bytes (${percent}% reduction)\n`);
  }
  
  return totalSaved;
}

async function minifyJSFiles() {
  console.log('📦 Minifying JavaScript files...\n');
  
  const jsDir = join(__dirname, 'js');
  const outputDir = join(__dirname, 'dist', 'js');
  await ensureDir(outputDir);
  
  const files = await readdir(jsDir);
  let totalSaved = 0;
  
  for (const file of files) {
    // Skip test files and already minified files
    if (!file.endsWith('.js') || file.endsWith('.min.js') || file.endsWith('.test.js')) {
      continue;
    }
    
    const inputPath = join(jsDir, file);
    const input = await readFile(inputPath, 'utf8');
    const output = minifyJS(input);
    
    const minFile = file.replace('.js', '.min.js');
    const outputPath = join(outputDir, minFile);
    await writeFile(outputPath, output);
    
    const saved = input.length - output.length;
    totalSaved += saved;
    const percent = ((saved / input.length) * 100).toFixed(1);
    
    console.log(`✓ ${file} → ${minFile}`);
    console.log(`  ${input.length} bytes → ${output.length} bytes (${percent}% reduction)\n`);
  }
  
  return totalSaved;
}

async function copyHTMLFiles() {
  console.log('📄 Copying HTML files...\n');
  
  const outputDir = join(__dirname, 'dist');
  await ensureDir(outputDir);
  
  const htmlFiles = ['index.html', 'variation-1.html', 'variation-2.html', 'variation-3.html'];
  
  for (const file of htmlFiles) {
    const input = await readFile(join(__dirname, file), 'utf8');
    
    // Update references to use minified files
    const output = input
      .replace(/href="css\/([^"]+)\.css"/g, 'href="css/$1.min.css"')
      .replace(/src="js\/([^"]+)\.js"/g, 'src="js/$1.min.js"');
    
    await writeFile(join(outputDir, file), output);
    console.log(`✓ Copied ${file} (updated references to minified files)`);
  }
  
  console.log('');
}

async function generateReport(cssSaved, jsSaved) {
  const totalSaved = cssSaved + jsSaved;
  const totalKB = (totalSaved / 1024).toFixed(2);
  
  console.log('═══════════════════════════════════════════════════');
  console.log('📊 Build Summary');
  console.log('═══════════════════════════════════════════════════');
  console.log(`CSS saved: ${(cssSaved / 1024).toFixed(2)} KB`);
  console.log(`JS saved:  ${(jsSaved / 1024).toFixed(2)} KB`);
  console.log(`Total saved: ${totalKB} KB`);
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  console.log('✅ Build complete! Production files are in ./dist/');
  console.log('');
  console.log('📝 Note: This is a basic minifier. For production, consider:');
  console.log('   - Using terser for JavaScript minification');
  console.log('   - Using cssnano for CSS minification');
  console.log('   - Enabling gzip compression on your server');
  console.log('');
}

async function build() {
  console.log('');
  console.log('🔨 Building optimized assets for production...');
  console.log('');
  
  try {
    const cssSaved = await minifyCSSFiles();
    const jsSaved = await minifyJSFiles();
    await copyHTMLFiles();
    await generateReport(cssSaved, jsSaved);
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run build
build();
