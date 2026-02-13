const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\PROGETTI IT CONSULTING\\FDD-sito';
const replacements = [
    { old: /img\/bg-img\/3\.jpg/g, new: 'img/footer/footer-bg.jpg' },
    { old: /img\/core-img\/logo\.png/g, new: 'img/footer/logo.png' },
    { old: /img\/bg-img\/4\.jpg/g, new: 'img/footer/best-seller-1.jpg' },
    { old: /img\/bg-img\/5\.jpg/g, new: 'img/footer/best-seller-2.jpg' }
];

const extensions = ['.html', '.css', '.scss', '.js'];

function getAllFiles(dir, allFiles = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (!['.git', 'node_modules'].some(skip => filePath.includes(skip))) {
                getAllFiles(filePath, allFiles);
            }
        } else {
            if (extensions.some(ext => filePath.toLowerCase().endsWith(ext))) {
                allFiles.push(filePath);
            }
        }
    });
    return allFiles;
}

const filesToProcess = getAllFiles(baseDir);

filesToProcess.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        replacements.forEach(rep => {
            if (rep.old.test(content)) {
                content = content.replace(rep.old, rep.new);
                modified = true;
            }
        });
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated: ${file}`);
        }
    } catch (e) {
        console.error(`Error processing ${file}: ${e.message}`);
    }
});

console.log('Update complete.');
