const path = require('path');
const { readdir, promises } = require('fs');

const NAME_DIR = 'secret-folder';

const pathDir = path.join(__dirname, NAME_DIR);

const genStringAboutFile = async (fullName) => {
  const pathFile = path.join(pathDir, fullName);
  const fd = await promises.open(pathFile);
  const extFile = path.extname(fullName);
  const nameFile = path.basename(fullName, extFile);
  const statFile = await fd.stat()
  console.log(nameFile + ' - ' + extFile.slice(1) + ' - ' + statFile.size);
};

readdir(pathDir, { withFileTypes: true }, (err, dirents) => {
  if (err) {
    return;
  }
  dirents.forEach(async (dirent) => {
    if (dirent.isFile()) {
      genStringAboutFile(dirent.name);

    }
  });

});