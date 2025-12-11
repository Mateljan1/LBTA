const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = './public/photos/LBTA FINAL PHOTOS';
const targetDir = './public/images/programs';

const conversions = [
  { source: 'programs-hero-1.jpg', target: 'hero.webp' },
  { source: 'youth-development.jpg', target: 'youth-dev-1.webp' },
  { source: 'youth-development-2.jpg', target: 'youth-dev-2.webp' },
  { source: 'high-performance (2).jpg', target: 'high-performance.webp' },
  { source: 'adult-beginner.jpg', target: 'adult-beginner.webp' },
  { source: 'adult-intermediate.jpg', target: 'adult-intermediate.webp' },
  { source: 'adult-advanced.jpg', target: 'adult-advanced.webp' },
  { source: 'fitness-community.jpg', target: 'fitness.webp' },
  { source: 'Private-Specialty training.jpg', target: 'private-specialty.webp' },
];

async function convertImage(sourcePath, targetPath) {
  try {
    const inputStats = fs.statSync(sourcePath);
    const inputSize = inputStats.size;

    await sharp(sourcePath)
      .resize(1920, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 75 })
      .toFile(targetPath);

    const outputStats = fs.statSync(targetPath);
    const outputSize = outputStats.size;
    const percent = ((inputSize - outputSize) / inputSize * 100).toFixed(1);

    console.log(`✅ ${path.basename(sourcePath)}`);
    console.log(`   ${(inputSize / 1024 / 1024).toFixed(1)}MB → ${(outputSize / 1024).toFixed(0)}KB (${percent}% reduction)\n`);
  } catch (error) {
    console.error(`❌ ${path.basename(sourcePath)}: ${error.message}`);
  }
}

(async () => {
  console.log('🎨 Converting Programs Page Final Photos to WebP...\n');
  
  for (const { source, target } of conversions) {
    const sourcePath = path.join(sourceDir, source);
    const targetPath = path.join(targetDir, target);
    await convertImage(sourcePath, targetPath);
  }
  
  console.log('==============================================');
  console.log('✅ All programs photos converted!');
  console.log('==============================================');
})();
