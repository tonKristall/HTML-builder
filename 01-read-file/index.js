const fs = require('fs');
const fd = fs.createReadStream('01-read-file/text.txt', 'utf-8')
fd.on('data', chunk => console.log(chunk))