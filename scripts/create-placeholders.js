/**
 * Create Placeholder Images Script
 * Generates SVG placeholders for development until real images are ready
 */

const fs = require('fs');
const path = require('path');

function createSVGPlaceholder(width, height, text, bgColor = '#22c55e', textColor = '#ffffff') {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <text
    x="50%"
    y="50%"
    font-family="Arial, sans-serif"
    font-size="24"
    font-weight="bold"
    fill="${textColor}"
    text-anchor="middle"
    dominant-baseline="middle"
  >${text}</text>
</svg>`;
}

const placeholders = [
  // Hero images
  { dir: 'hero', name: 'hero-stadium.svg', width: 1920, height: 1080, text: 'Cricket Stadium' },
  { dir: 'hero', name: 'hero-craftsmanship.svg', width: 1920, height: 900, text: 'Craftsmanship' },
  { dir: 'hero', name: 'hero-action.svg', width: 1920, height: 700, text: 'Action Shot' },

  // Product images
  { dir: 'products', name: 'product-hero-bat.svg', width: 1000, height: 1200, text: 'Premium Bat', bgColor: '#8B4513' },
  { dir: 'products', name: 'product-wood-grain.svg', width: 800, height: 800, text: 'Wood Grain', bgColor: '#eab308' },
  { dir: 'products', name: 'product-collection.svg', width: 1400, height: 900, text: 'Collection', bgColor: '#22c55e' },
  { dir: 'products', name: 'product-lifestyle.svg', width: 1200, height: 1400, text: 'Lifestyle', bgColor: '#4C6E42' },
  { dir: 'products', name: 'product-workshop.svg', width: 1200, height: 800, text: 'Workshop', bgColor: '#8B7355' },
  { dir: 'products', name: 'product-bat-ball.svg', width: 1000, height: 1000, text: 'Bat & Ball', bgColor: '#ef4444' },

  // Textures
  { dir: 'textures', name: 'texture-pitch.svg', width: 2048, height: 2048, text: 'Pitch Texture', bgColor: '#22c55e' },
  { dir: 'textures', name: 'texture-willow.svg', width: 2048, height: 2048, text: 'Willow Texture', bgColor: '#eab308' },
  { dir: 'textures', name: 'texture-leather.svg', width: 2048, height: 2048, text: 'Leather Texture', bgColor: '#8B4513' },

  // Accents
  { dir: 'accents', name: 'accent-ball-seam.svg', width: 800, height: 600, text: 'Ball Seam', bgColor: '#ef4444' },
  { dir: 'accents', name: 'accent-pitch-lines.svg', width: 1200, height: 400, text: 'Pitch Lines', bgColor: '#22c55e' },
  { dir: 'accents', name: 'accent-tools.svg', width: 800, height: 800, text: 'Tools', bgColor: '#8B7355' },
];

function main() {
  console.log('🎨 Creating placeholder images...\n');

  const baseDir = path.join(__dirname, '..', 'apps', 'web', 'public', 'images');
  let created = 0;

  placeholders.forEach(({ dir, name, width, height, text, bgColor, textColor }) => {
    const dirPath = path.join(baseDir, dir);
    const filePath = path.join(dirPath, name);

    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Create SVG placeholder
    const svg = createSVGPlaceholder(width, height, text, bgColor, textColor);
    fs.writeFileSync(filePath, svg, 'utf8');

    console.log(`✅ Created: ${dir}/${name}`);
    created++;
  });

  console.log(`\n✨ Created ${created} placeholder images!`);
  console.log('\n📋 These are temporary placeholders.');
  console.log('Replace them with real images generated from IMAGE_GENERATION_GUIDE.md');
}

if (require.main === module) {
  main();
}

module.exports = { createSVGPlaceholder, placeholders };
