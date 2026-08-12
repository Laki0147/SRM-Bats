/**
 * Image Integration Script
 * Automatically updates all components with generated images
 */

const fs = require('fs');
const path = require('path');

// Image mappings
const imageMap = {
  landing: {
    'HeroSection.tsx': [
      { placeholder: 'https://placehold.co', image: '/images/hero/hero-stadium.jpg', alt: 'Professional cricket stadium at golden hour' },
      { placeholder: 'cricket-bat-placeholder', image: '/images/products/product-hero-bat.jpg', alt: 'Premium handmade cricket bat' }
    ],
    'ProductShowcase.tsx': [
      { placeholder: 'product-1', image: '/images/products/product-hero-bat.jpg', alt: 'English Willow Premium Bat' },
      { placeholder: 'product-2', image: '/images/products/product-collection.jpg', alt: 'Kashmir Willow Professional Bat' },
      { placeholder: 'product-3', image: '/images/products/product-lifestyle.jpg', alt: 'Custom Handmade Cricket Bat' }
    ],
    'FeaturesSection.tsx': [
      { background: true, image: '/images/textures/texture-pitch.jpg' }
    ],
    'TestimonialsSection.tsx': [
      { background: true, image: '/images/textures/texture-willow.jpg' }
    ],
    'CTASection.tsx': [
      { placeholder: 'workshop', image: '/images/hero/hero-craftsmanship.jpg', alt: 'Cricket bat workshop craftsmanship' }
    ]
  },
  products: {
    'product-card.tsx': [
      { placeholder: 'product-image', image: '/images/products/product-hero-bat.jpg', alt: 'Premium cricket bat' }
    ],
    'product-quick-view.tsx': [
      { placeholder: 'quick-view-image', image: '/images/products/product-wood-grain.jpg', alt: 'Cricket bat detail' }
    ]
  }
};

function updateComponent(componentPath, replacements) {
  try {
    let content = fs.readFileSync(componentPath, 'utf8');
    let updated = false;

    replacements.forEach(({ placeholder, image, alt, background }) => {
      if (background) {
        // Update background images
        const bgRegex = /background-image:\s*url\(['"](.*?)['"]\)/g;
        if (content.match(bgRegex)) {
          content = content.replace(bgRegex, `background-image: url('${image}')`);
          updated = true;
        }
      } else {
        // Update img src attributes
        const srcRegex = new RegExp(`src=['"]([^'"]*${placeholder}[^'"]*)['"]`, 'g');
        if (content.match(srcRegex)) {
          content = content.replace(srcRegex, `src="${image}" alt="${alt}"`);
          updated = true;
        }

        // Update Image component src
        const imageRegex = new RegExp(`<Image[^>]*src=['"]([^'"]*${placeholder}[^'"]*)['"]`, 'g');
        if (content.match(imageRegex)) {
          content = content.replace(
            imageRegex,
            (match) => match.replace(/src=['"]([^'"]*)['"]/, `src="${image}" alt="${alt}"`)
          );
          updated = true;
        }
      }
    });

    if (updated) {
      fs.writeFileSync(componentPath, content, 'utf8');
      console.log(`✅ Updated: ${path.basename(componentPath)}`);
      return true;
    } else {
      console.log(`⏭️  Skipped: ${path.basename(componentPath)} (no placeholders found)`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${componentPath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🎨 Starting image integration...\n');

  const baseDir = path.join(__dirname, '..', 'apps', 'web', 'src', 'components');
  let totalUpdated = 0;

  // Update landing page components
  console.log('📄 Landing Page Components:');
  Object.entries(imageMap.landing).forEach(([component, replacements]) => {
    const componentPath = path.join(baseDir, 'landing', component);
    if (fs.existsSync(componentPath)) {
      if (updateComponent(componentPath, replacements)) {
        totalUpdated++;
      }
    } else {
      console.log(`⚠️  Not found: ${component}`);
    }
  });

  // Update products page components
  console.log('\n📦 Products Page Components:');
  Object.entries(imageMap.products).forEach(([component, replacements]) => {
    const componentPath = path.join(baseDir, 'products', component);
    if (fs.existsSync(componentPath)) {
      if (updateComponent(componentPath, replacements)) {
        totalUpdated++;
      }
    } else {
      console.log(`⚠️  Not found: ${component}`);
    }
  });

  console.log(`\n✨ Integration complete! Updated ${totalUpdated} components.`);
  console.log('\n📋 Next steps:');
  console.log('1. Generate all 16 images using IMAGE_GENERATION_GUIDE.md');
  console.log('2. Place images in the correct directories');
  console.log('3. Run: pnpm dev');
  console.log('4. Verify images load correctly');
}

if (require.main === module) {
  main();
}

module.exports = { updateComponent, imageMap };
