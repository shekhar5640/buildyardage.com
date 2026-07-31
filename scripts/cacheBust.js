import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.html')) results.push(file);
    }
  });
  return results;
}

const htmlFiles = walk('./dist');
const cacheBuster = '?v=' + Date.now();

let count = 0;
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Replace all /_astro/SOMETHING.js with /_astro/SOMETHING.js?v=TIMESTAMP
  const original = content;
  content = content.replace(/\/_astro\/([^"']+)\.js/g, '/_astro/$1.js' + cacheBuster);
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
});
console.log(`Cache busted ${count} HTML files.`);
