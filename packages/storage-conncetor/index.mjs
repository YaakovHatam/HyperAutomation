import { join, resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

const createDirectoryRecursively = (path) => {
   if (existsSync(path)) {
      return;
   }
   createDirectoryRecursively(join(path, '..'));
   mkdirSync(path);
}

async function getFile(path, filename) {
   return resolve(join('./../../', 'storage', path, filename));
}

function getFileContent(path, filename) {
   return readFile(join('./../../', 'storage', path, filename), 'utf-8');
}

function saveFile(path, filename, data) {
   const dir = join('./../../', 'storage', path);
   createDirectoryRecursively(resolve(dir));
   return writeFile(join(dir, filename), data);
}

export { saveFile, getFile, getFileContent }