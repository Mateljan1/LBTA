const sharp = require('sharp');
const path = require('path');

async function convertImage(inputPath, outputPath, maxWidth = 1920) {
  try {
    await sharp(inputPath)
      .resize(maxWidth, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 75 })
      .toFile(outputPath);
    
    console.log(`✅ Converted ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

(async () => {
  console.log('Converting private lesson photos...\n');
  
  await convertImage(
    './public/photos/LBTA FINAL PHOTOS/programs-private_lessons 1.jpg',
    './public/images/programs/private-lessons-hero.webp'
  );
  
  await convertImage(
    './public/photos/LBTA FINAL PHOTOS/programs-private_lessons 3.jpg',
    './public/images/programs/private-lessons-hp.webp'
  );
  
  console.log('\n✅ Conversion complete!');
})();
