const path = require('path');
const { readdir, promises } = require('fs');

const NAME_DIR = 'secret-folder';

const pathDir = path.join(__dirname, NAME_DIR);

const genStringAboutFile = async (fullName) => {
  const pathFile = path.join(pathDir, fullName);
  const fd = await promises.open(pathFile);
  const statFile = await fd.stat()
  const splitName = fullName.split('.');
  const extName = splitName[splitName.length - 1];
  splitName.pop();
  const name = splitName.join('.');
  console.log(name + ' - ' + extName + ' - ' + statFile.size);
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