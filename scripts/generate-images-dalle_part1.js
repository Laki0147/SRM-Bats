/**
 * DALL-E Image Generation Script
 * Requires OpenAI API key: set OPENAI_API_KEY environment variable
 *
 * Usage:
 *   node scripts/generate-images-dalle.js
 *   node scripts/generate-images-dalle.js --image hero-stadium
 *   node scripts/generate-images-dalle.js --batch all
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Image prompts from IMAGE_GENERATION_GUIDE.md
const imagePrompts = [
  {
    id: 'hero-stadium',
    filename: 'hero-stadium.jpg',
    dir: 'hero',
    size: '1792x1024', // DALL-E 3 closest to 1920x1080
    prompt: 'Cinematic wide shot of a professional cricket stadium at golden hour, dramatic lighting with sun rays breaking through clouds, lush green cricket pitch in sharp focus, blurred crowd in background, premium sports photography aesthetic, deep greens and warm golden tones, high-end Nike campaign style, 8K ultra-detailed, photorealistic, shallow depth of field creating premium atmosphere'
  },
  {
    id: 'hero-craftsmanship',
    filename: 'hero-craftsmanship.jpg',
    dir: 'hero',
    size: '1792x1024',
    prompt: 'Artisan craftsman hands carefully shaping a cricket bat from English willow wood in a traditional workshop, dramatic side lighting highlighting wood grain texture, wood shavings and traditional tools in soft focus background, warm amber workshop lighting, premium craftsmanship photography, rustic yet refined aesthetic, high-end artisan brand style, photorealistic detail, 8K quality'
  },
  {
    id: 'hero-action',
    filename: 'hero-action.jpg',
    dir: 'hero',
    size: '1792x1024',
    prompt: 'Professional cricket batsman in perfect cover drive stance, motion blur on bat showing powerful shot, cricket ball just leaving bat with slight motion trail, stadium lights creating dramatic rim lighting, deep green pitch, cricket whites with subtle red accent from ball, premium sports action photography, Nike/Adidas campaign style, high shutter speed capture, 8K photorealistic'
  },
  {
    id: 'product-hero-bat',
    filename: 'product-hero-bat.jpg',
    dir: 'products',
    size: '1024x1024',
    prompt: 'Professional studio shot of handmade English willow cricket bat standing vertically against seamless dark green gradient background, dramatic three-point lighting creating highlights on willow grain, leather grip detail visible, bat face showing beautiful wood grain patterns, premium product photography, commercial quality, sharp focus on bat with subtle shadow, high-end sports equipment aesthetic, 8K detail'
  },
  {
    id: 'product-wood-grain',
    filename: 'product-wood-grain.jpg',
    dir: 'products',
    size: '1024x1024',
    prompt: 'Extreme macro close-up of English willow cricket bat face showing intricate wood grain patterns, beautiful natural texture, subtle oil finish creating slight sheen, professional product detail photography, shallow depth of field, warm natural lighting, premium craftsmanship aesthetic, photorealistic wood texture, 8K ultra-detailed'
  },
  {
    id: 'product-collection',
    filename: 'product-collection.jpg',
    dir: 'products',
    size: '1792x1024',
    prompt: 'Five premium cricket bats arranged in elegant fan formation on dark green velvet surface, each bat showing different willow grades, dramatic overhead lighting creating long shadows, professional commercial photography, luxury retail display aesthetic, high contrast, premium sports equipment showcase, 8K photorealistic, commercial quality'
  },
  {
    id: 'product-lifestyle',
    filename: 'product-lifestyle.jpg',
    dir: 'products',
    size: '1024x1024',
    prompt: 'Professional cricket player in cricket whites holding custom handmade bat in elegant portrait stance on pristine green cricket pitch, natural outdoor lighting, shallow depth of field with blurred stadium background, aspirational lifestyle photography, premium sports brand campaign style, authentic cricket atmosphere, photorealistic, 8K quality'
  },
  {
    id: 'product-workshop',
    filename: 'product-workshop.jpg',
    dir: 'products',
    size: '1792x1024',
    prompt: 'Authentic cricket bat workshop scene showing partially shaped willow bat on craftsman workbench, traditional hand tools arranged artfully, wood shavings scattered naturally, warm workshop lighting from vintage industrial lamps, documentary-style craftsmanship photography, rustic yet premium aesthetic, depth and texture, photorealistic detail, high-end artisan brand style'
  },
  {
    id: 'product-bat-ball',
    filename: 'product-bat-ball.jpg',
    dir: 'products',
    size: '1024x1024',
    prompt: 'Artistic product composition with premium cricket bat leaning at 45-degree angle next to traditional red leather cricket ball on dark green surface, dramatic side lighting creating strong shadows and highlights, professional still life photography, premium sports equipment aesthetic, high contrast, commercial quality, 8K photorealistic'
  },
  {
    id: 'texture-pitch',
    filename: 'texture-pitch.jpg',
    dir: 'textures',
    size: '1024x1024',
    prompt: 'Seamless tileable texture of professional cricket pitch grass, deep green natural turf, subtle variations in grass blade direction, professional sports field photography, high resolution texture, even lighting, realistic grass detail, premium sports surface aesthetic, 4K seamless pattern'
  },
  {
    id: 'texture-willow',
    filename: 'texture-willow.jpg',
    dir: 'textures',
    size: '1024x1024',
    prompt: 'Seamless tileable pattern of English willow wood grain texture, beautiful natural blonde wood with subtle grain lines, light and airy feel, professional wood texture photography, even diffused lighting, premium natural material aesthetic, high resolution, subtle and elegant pattern'
  },
  {
    id: 'texture-leather',
    filename: 'texture-leather.jpg',
    dir: 'textures',
    size: '1024x1024',
    prompt: 'Seamless tileable texture of premium cricket bat leather grip, dark brown leather with subtle texture and grip pattern, professional product texture photography, even lighting, rich leather material aesthetic, high resolution detail, premium sports equipment material'
  },
  {
    id: 'accent-ball-seam',
    filename: 'accent-ball-seam.jpg',
    dir: 'accents',
    size: '1024x1024',
    prompt: 'Artistic close-up of red leather cricket ball showing prominent white stitched seam, dramatic lighting highlighting leather texture and seam detail, shallow depth of field, premium sports equipment photography, rich red leather with white thread contrast, photorealistic detail, high-end commercial quality'
  },
  {
    id: 'accent-pitch-lines',
    filename: 'accent-pitch-lines.jpg',
    dir: 'accents',
    size: '1792x1024',
    prompt: 'Aerial view of cricket pitch showing crisp white painted crease lines on deep green turf, geometric precision, professional sports field photography, clean lines and natural grass texture, premium sports aesthetic, high contrast between white lines and green pitch, photorealistic, commercial quality'
  },
  {
    id: 'accent-tools',
    filename: 'accent-tools.jpg',
    dir: 'accents',
    size: '1024x1024',
    prompt: 'Flat lay arrangement of traditional cricket bat making tools on rustic wooden workbench - wood plane, chisel, sandpaper, measuring tools - artfully arranged, warm workshop lighting, artisan craftsmanship aesthetic, overhead photography, premium handmade brand style, photorealistic detail'
  }
];

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY environment variable not set');
  console.log('\nSet your OpenAI API key:');
  console.log('  Windows: $env:OPENAI_API_KEY="sk-..."');
  console.log('  Linux/Mac: export OPENAI_API_KEY="sk-..."');
  process.exit(1);
}

async function generateImage(imageConfig) {
  console.log(`\n🎨 Generating: ${imageConfig.id}`);
  console.log(`   Size: ${imageConfig.size}`);
  console.log(`   Prompt: ${imageConfig.prompt.substring(0, 80)}...`);

  const requestData = JSON.stringify({
    model: 'dall-e-3',
    prompt: imageConfig.prompt,
    n: 1,
    size: imageConfig.size,
    quality: 'hd',
    style: 'natural'
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.data && response.data[0]) {
            const imageUrl = response.data[0].url;
            console.log(`   ✅ Generated: ${imageUrl}`);
            resolve({ ...imageConfig, url: imageUrl });
