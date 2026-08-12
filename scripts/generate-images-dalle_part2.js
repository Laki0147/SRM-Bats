  } else if (response.error) {
            console.error(`   ❌ Error: ${response.error.message}`);
            reject(new Error(response.error.message));
          } else {
            reject(new Error('Unexpected response format'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`   ❌ Request failed: ${error.message}`);
      reject(error);
    });

    req.write(requestData);
    req.end();
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`   💾 Saved: ${filepath}`);
        resolve();
      });
    }).on('error', (error) => {
      fs.unlink(filepath, () => {});
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const imageId = args.find(arg => arg.startsWith('--image='))?.split('=')[1];
  const batchMode = args.includes('--batch');

  console.log('🎨 DALL-E Image Generation Script');
  console.log('==================================\n');

  let imagesToGenerate = imagePrompts;

  if (imageId) {
    imagesToGenerate = imagePrompts.filter(img => img.id === imageId);
    if (imagesToGenerate.length === 0) {
      console.error(`❌ Image ID "${imageId}" not found`);
      console.log('\nAvailable IDs:');
      imagePrompts.forEach(img => console.log(`  - ${img.id}`));
      process.exit(1);
    }
  }

  console.log(`Generating ${imagesToGenerate.length} image(s)...\n`);

  const baseDir = path.join(__dirname, '..', 'apps', 'web', 'public', 'images');
  let successCount = 0;
  let failCount = 0;

  for (const imageConfig of imagesToGenerate) {
    try {
      // Generate image
      const result = await generateImage(imageConfig);

      // Download image
      const dirPath = path.join(baseDir, result.dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const filepath = path.join(dirPath, result.filename);
      await downloadImage(result.url, filepath);

      successCount++;

      // Rate limiting: wait 1 second between requests
      if (batchMode && imagesToGenerate.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Failed to generate ${imageConfig.id}:`, error.message);
      failCount++;
    }
  }

  console.log('\n==================================');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('\n📋 Next steps:');
  console.log('1. Review generated images');
  console.log('2. Run: node scripts/integrate-images.js');
  console.log('3. Run: pnpm dev');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { imagePrompts, generateImage, downloadImage };
