const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\PROGETTI IT CONSULTING\\FDD-sito';
const imgDir = path.join(baseDir, 'img');
const extensions = ['.html', '.css', '.scss', '.js'];
const imgExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.heic', '.JPG'];

function getAllFiles(dir, allFiles = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (!['.git', 'node_modules'].some(skip => filePath.includes(skip))) {
                getAllFiles(filePath, allFiles);
            }
        } else {
            allFiles.push(filePath);
        }
    });
    return allFiles;
}

const allFiles = getAllFiles(baseDir);
const imageFiles = allFiles
    .filter(f => imgExtensions.some(ext => f.toLowerCase().endsWith(ext.toLowerCase())))
    .map(f => path.relative(baseDir, f).replace(/\\/g, '/'));

console.log(`Total images found: ${imageFiles.length}`);

let references = new Set();
allFiles
    .filter(f => extensions.some(ext => f.toLowerCase().endsWith(ext.toLowerCase())))
    .forEach(f => {
        try {
            const content = fs.readFileSync(f, 'utf8');
            const matches = content.match(/img\/[^"' \s>)]+/g);
            if (matches) {
                matches.forEach(ref => references.add(ref.trim().replace(/\\/g, '/')));
            }
        } catch (e) {
            console.error(`Error reading ${f}: ${e.message}`);
        }
    });

const unusedImages = imageFiles.filter(img => !references.has(img));

console.log(`Unused images found: ${unusedImages.length}`);
fs.writeFileSync(path.join(baseDir, 'unused_report.txt'), unusedImages.join('\n'));
console.log('Report saved to unused_report.txt');
