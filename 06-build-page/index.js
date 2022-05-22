const path = require('path');
const { readdir, promises, createReadStream } = require('fs');

const PROJECT_DIR_NAME = 'project-dist';
const STYLES_DIR_NAME = 'styles';
const EXT_STYLES = '.css';
const BUNDLE_STYLE_NAME = 'style.css';
const ASSETS_DIR_NAME = 'assets';
const COMPONENTS_DIR = 'components';
const TEMPLATE_FILE_NAME = 'template.html';
const BUNDLE_HTML_NAME = 'index.html';
const EXT_COMPONENT_FILE = '.html';

const pathProject = path.join(__dirname, PROJECT_DIR_NAME);
const pathStylesDir = path.join(__dirname, STYLES_DIR_NAME);
const pathBundleStyle = path.join(pathProject, BUNDLE_STYLE_NAME);
const pathAssetsDir = path.join(__dirname, ASSETS_DIR_NAME);
const pathBundleAssets = path.join(pathProject, ASSETS_DIR_NAME);
const pathComponentsDir = path.join(__dirname, COMPONENTS_DIR);
const pathTemplate = path.join(__dirname, TEMPLATE_FILE_NAME);
const pathBundleHtml = path.join(pathProject, BUNDLE_HTML_NAME);


const readFile = async (pathFile) => {
  let content = '';
  const fd = createReadStream(pathFile, 'utf-8');
  fd.on('data', (chunk) => {
    content += chunk;
  });
  return new Promise((res) => {
    fd.on('end', () => res(content));
  });
};

const readComponents = async (pathDir) => {
  const files = await promises.readdir(pathDir, { withFileTypes: true });
  const numberFiles = files.length;
  return new Promise((res) => {
    const components = [];
    files.forEach(async (dirent, index) => {
      const fullNameFile = dirent.name;
      const extFile = path.extname(fullNameFile);
      const pathComponentFile = path.join(pathDir, fullNameFile);
      if (dirent.isFile() && extFile === EXT_COMPONENT_FILE) {
        const nameFile = path.basename(fullNameFile, extFile);
        components.push({ [nameFile]: await readFile(pathComponentFile) });
      } else if (dirent.isDirectory()) {
        components.push(...(await readComponents(pathComponentFile)));
      }
      if (index === numberFiles - 1) {
        res(components);
      }
    });
  });
};

const mergeStyle = async () => {
  await promises.rm(pathBundleStyle, { recursive: true, force: true });
  await promises.writeFile(pathBundleStyle, '');
  readdir(pathStylesDir, { withFileTypes: true }, (err, dirents) => {
    if (err) {
      return;
    }
    dirents.forEach(async (dirent) => {
      const fullName = dirent.name;
      const extName = path.extname(fullName);
      if (extName === EXT_STYLES) {
        const pathFile = path.join(pathStylesDir, fullName);
        const styles = await readFile(pathFile);
        promises.appendFile(pathBundleStyle, styles);
      }
    });
  });
};

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

const bunleHtml = async () => {
  const components = await readComponents(pathComponentsDir);
  let templateContent = await readFile(pathTemplate);
  components.forEach((component) => {
    const nameFile = Object.keys(component)[0];
    templateContent = templateContent.replace(`{{${nameFile}}}`, component[nameFile]);
  });
  await promises.rm(pathBundleHtml, { recursive: true, force: true });
  await promises.writeFile(pathBundleHtml, templateContent);
};

const bundleProject = async () => {
  await promises.rm(pathProject, { recursive: true, force: true });
  await promises.mkdir(pathProject, { recursive: true });
  copyDir(pathAssetsDir, pathBundleAssets);
  mergeStyle();
  bunleHtml();
};

bundleProject();
