const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../src/data/properties_data.json');
const imagesDir = path.join(__dirname, '../public/property-images');

console.log('Reading database from:', jsonPath);
const database = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('Reading files from:', imagesDir);
const filesOnDisk = new Set(fs.readdirSync(imagesDir));

let imageCorrected = 0;
let imagesFiltered = 0;
let totalSubImagesRemoved = 0;

const cleanedDatabase = database.map(p => {
  let mainImage = p.image;
  let subImages = p.images || [];

  // Helper to get filename from path
  const getBasename = (pth) => pth ? path.basename(pth) : '';

  // Clean sub-images: keep only those that exist on disk
  const beforeCount = subImages.length;
  const existingSubImages = subImages.filter(img => {
    const filename = getBasename(img);
    if (!filename) return false;
    
    if (filesOnDisk.has(filename)) {
      return true;
    }
    
    // Check if it exists with a different extension (e.g. .jpeg instead of .png)
    const base = path.basename(filename, path.extname(filename));
    const alternative = [...filesOnDisk].find(f => path.basename(f, path.extname(f)).toLowerCase() === base.toLowerCase());
    if (alternative) {
      return true;
    }
    return false;
  }).map(img => {
    const filename = getBasename(img);
    if (filesOnDisk.has(filename)) {
      return `/property-images/${filename}`;
    }
    const base = path.basename(filename, path.extname(filename));
    const alternative = [...filesOnDisk].find(f => path.basename(f, path.extname(f)).toLowerCase() === base.toLowerCase());
    imagesFiltered++;
    return `/property-images/${alternative}`;
  });

  totalSubImagesRemoved += (beforeCount - existingSubImages.length);

  // Clean main image
  const mainFilename = getBasename(mainImage);
  let finalMainImage = mainImage;
  if (!filesOnDisk.has(mainFilename)) {
    const base = path.basename(mainFilename, path.extname(mainFilename));
    const alternative = [...filesOnDisk].find(f => path.basename(f, path.extname(f)).toLowerCase() === base.toLowerCase());
    if (alternative) {
      finalMainImage = `/property-images/${alternative}`;
      imageCorrected++;
    } else if (existingSubImages.length > 0) {
      finalMainImage = existingSubImages[0];
      imageCorrected++;
    } else {
      finalMainImage = '/property-images/SA001_1.jpeg'; // fallback
      imageCorrected++;
    }
  }

  // If subImages list is empty after filtering, default to the main image
  const finalSubImages = existingSubImages.length > 0 ? existingSubImages : [finalMainImage];

  return {
    ...p,
    image: finalMainImage,
    images: finalSubImages
  };
});

fs.writeFileSync(jsonPath, JSON.stringify(cleanedDatabase, null, 2), 'utf8');
console.log('Done!');
console.log(`Main images corrected/updated: ${imageCorrected}`);
console.log(`Sub-images extension corrected: ${imagesFiltered}`);
console.log(`Non-existent sub-images removed: ${totalSubImagesRemoved}`);
