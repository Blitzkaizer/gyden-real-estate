const fs = require('fs');
const path = require('path');

const database = JSON.parse(fs.readFileSync('src/data/properties_data.json', 'utf8'));
const filesOnDisk = new Set(fs.readdirSync('public/property-images'));
const caseMismatches = [];

database.forEach(p => {
  if (p.image) {
    const dbBasename = path.basename(p.image);
    if (dbBasename && !filesOnDisk.has(dbBasename)) {
      // Find if it exists with a different casing
      const found = [...filesOnDisk].find(f => f.toLowerCase() === dbBasename.toLowerCase());
      if (found) {
        caseMismatches.push({
          id: p.id,
          title: p.title,
          dbName: dbBasename,
          diskName: found
        });
      }
    }
  }
});

console.log('Case mismatches found:', caseMismatches.length);
if (caseMismatches.length > 0) {
  console.log('Mismatches:', JSON.stringify(caseMismatches, null, 2));
}
