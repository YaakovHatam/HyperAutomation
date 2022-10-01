import { join, resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const createDirectoryRecursively = (path) => {
   if (existsSync(path)) {
      return;
   }
   createDirectoryRecursively(join(path, '..'));
   mkdirSync(path);
}


function saveFile(path, filename, data) {
   const dir = join('./../../', 'storage', path);
   createDirectoryRecursively(resolve(dir));
   writeFileSync(join(dir, filename), data);
}

export { saveFile }