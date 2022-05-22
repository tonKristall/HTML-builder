const path = require('path');
const { readdir, promises, createReadStream } = require('fs');

const stylesDirName = 'styles';
const extStyles = '.css';
const bundleDirName = 'project-dist';
const bundleStyleName = 'bundle.css';

const pathStylesDir = path.join(__dirname, stylesDirName);
const pathBundleStyle = path.join(__dirname, bundleDirName, bundleStyleName);

const copyStyle = async (fullName) => {
  const extName = path.extname(fullName);
  if (extName === extStyles) {
    const pathFile = path.join(pathStylesDir, fullName);
    const fd = createReadStream(pathFile, 'utf-8');
    fd.on('data', async (chunk) => {
      await promises.appendFile(pathBundleStyle, chunk);
    });
  }
};

const mergeStyle = async () => {
  await promises.rm(pathBundleStyle, { recursive: true, force: true });
  await promises.writeFile(pathBundleStyle, '');
  readdir(pathStylesDir, { withFileTypes: true }, (err, dirents) => {
    if (err) {
      return;
    }
    dirents.forEach(async (dirent) => {
      if (dirent.isFile()) {
        await copyStyle(dirent.name);
      }
    });
  });
};

mergeStyle();
