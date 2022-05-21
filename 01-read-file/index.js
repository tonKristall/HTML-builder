const fs = require('fs');
const path = require('path');
const pathFile = path.join(__dirname, 'text.txt');
const fd = fs.createReadStream(pathFile, 'utf-8');
fd.on('data', chunk => console.log(chunk));