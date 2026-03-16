const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'src'); // Adjust to point back to ELI5/src

function stripComments(contents) {
    // Regex that skips strings safely
    return contents.replace(/("([^\\\"]|\\.)*")|('([^\\\']|\\.)*')|(`([^\\\`]|\\.)*`)|(\/\*[\s\S]*?\*\/)|(\/\/.*)/g, (match, dquot, d1, squot, s1, bquot, b1, blockComment, lineComment) => {
        if (blockComment || lineComment) {
            return ""; 
        }
        return match;
    });
}

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(filePath));
        } else { 
            if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const files = walkDir(targetDir);
let count = 0;

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const cleaned = stripComments(content);
        if (content !== cleaned) {
            fs.writeFileSync(file, cleaned, 'utf8');
            count++;
            console.log(`Cleaned: ${file}`);
        }
    } catch (e) {
        console.error(`Error cleaning ${file}:`, e.message);
    }
});

console.log(`Done! Cleaned comments in ${count} files.`);
