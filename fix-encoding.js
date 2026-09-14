const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git') && !file.includes('.next')) { 
      results = results.concat(walk(file));
    } else if (stat.isFile() && !file.includes('node_modules') && !file.includes('.git') && !file.includes('.next') && !file.endsWith('.ico') && !file.endsWith('.png') && !file.endsWith('.sql')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('.');
files.forEach(file => {
  try {
    let buf = fs.readFileSync(file);
    let hasBOM = buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
    let text = buf.toString('utf8');
    if (hasBOM) { text = text.slice(1); }
    let changed = hasBOM;
    
    if (text.includes('—')) { text = text.replace(/—/g, '—'); changed = true; }
    if (text.includes('·')) { text = text.replace(/·/g, '·'); changed = true; }
    if (text.includes('──')) { text = text.replace(/──/g, '──'); changed = true; }
    
    if (changed) {
      fs.writeFileSync(file, text, 'utf8');
      console.log('Fixed:', file);
    }
  } catch (e) {}
});
