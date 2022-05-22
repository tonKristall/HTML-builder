const path = require('path');
const { readdir, promises } = require('fs');

const copyDirName = 'files';
const newDirName = 'files-copy';
const pathCopyDir = path.join(__dirname, copyDirName);
const pathNewDir = path.join(__dirname, newDirName);

const copyDir = async (pathCopyDir, pathNewDir) => {
  await promises.rm(pathNewDir, { recursive: true, force: true });
  await promises.mkdir(pathNewDir, { recursive: true });
  readdir(pathCopyDir, { withFileTypes: true }, (err, dirents) => {
    if (err) {
      return;
    }
    dirents.forEach(async (dirent) => {
      const pathCopyFile = path.join(pathCopyDir, dirent.name);
      const pathNewFile = path.join(pathNewDir, dirent.name);
      if (dirent.isFile()) {
        await promises.copyFile(pathCopyFile, pathNewFile);
      } else {
        copyDir(pathCopyFile, pathNewFile);
      }
    });
  });
};

copyDir(pathCopyDir, pathNewDir);
