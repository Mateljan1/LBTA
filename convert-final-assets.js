const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = './public/photos/LBTA FINAL PHOTOS';
const targetBaseDir = './public/images';

// Asset mapping according to production spec
const assetMap = {
  // Founder scene
  'andrew-portrait (1).jpg': 'founder/andrew-portrait.webp',
  
  // Results scene
  'karue-training.jpg': 'results/karue-training.webp',
  
  // Philosophy scene (3 pillars)
  'movement-1.jpg': 'philosophy/movement.webp',
  'discipline-1.jpg': 'philosophy/discipline.webp',
  'belonging-4.png': 'philosophy/belonging.webp',
  
  // Programs scene
  'programs-juniors.jpg': 'programs/juniors.webp',
  'programs-adults.jpg': 'programs/adults.webp',
  'programs-private_lessons 2.jpg': 'programs/private-lessons.webp',
  
  // Destination scene
  'laguna-horizon.jpg': 'hero/laguna-horizon.webp',
  
  // Community scene
  'community 1.jpg': 'community/community-1.webp',
  'community 2.jpg': 'community/community-2.webp',
  'community 3.jpg': 'community/community-3.webp',
  'community 4.jpg': 'community/community-4.webp',
  'community 5.jpg': 'community/community-5.webp',
  'community 6.jpg': 'community/community-6.webp',
  'belonging-3.png': 'community/community-7.webp',
  
  // CTA scene
  'cta.jpg': 'cta/cta-background.webp',
};

async function convertImage(sourcePath, targetPath, maxWidth = 1920) {
  try {
    const inputStats = fs.statSync(sourcePath);
    const inputSize = inputStats.size;

    // Ensure target directory exists
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    await sharp(sourcePath)
      .resize(maxWidth, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 75 })
      .toFile(targetPath);

    const outputStats = fs.statSync(targetPath);
    const outputSize = outputStats.size;
    const saved = inputSize - outputSize;
    const percent = ((saved / inputSize) * 100).toFixed(1);

    console.log(`✅ ${path.basename(sourcePath)}`);
    console.log(`   ${(inputSize / 1024 / 1024).toFixed(1)}MB → ${(outputSize / 1024 / 1024).toFixed(2)}MB (${percent}% reduction)`);
    
    return { success: true, saved };
  } catch (error) {
    console.error(`❌ Error processing ${sourcePath}:`, error.message);
    return { success: false, saved: 0 };
  }
}

(async () => {
  console.log('🎨 Converting LBTA Final Photos to WebP...\n');
  
  let totalSaved = 0;
  let successCount = 0;
  const entries = Object.entries(assetMap);

  for (const [sourceFile, targetFile] of entries) {
    const sourcePath = path.join(sourceDir, sourceFile);
    const targetPath = path.join(targetBaseDir, targetFile);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  Skipping ${sourceFile} (not found)`);
      continue;
    }

    const result = await convertImage(sourcePath, targetPath);
    if (result.success) {
      totalSaved += result.saved;
      successCount++;
    }
  }

  console.log('\n==============================================');
  console.log(`✅ Conversion complete!`);
  console.log(`📊 Processed: ${successCount}/${entries.length} images`);
  console.log(`💾 Total space saved: ${(totalSaved / 1024 / 1024).toFixed(1)}MB`);
  console.log('==============================================');
})();
