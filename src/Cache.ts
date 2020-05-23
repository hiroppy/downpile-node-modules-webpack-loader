import { promises } from 'fs';
import { join } from 'path';
import del from 'del';
import findCacheDir from 'find-cache-dir';
import { loaderName } from './constants';

const { readFile, writeFile, mkdir } = promises;

export class Cache {
  name: string;
  cacheDirPath: string;

  constructor() {
    this.name = loaderName;
    this.cacheDirPath = this.getCacheDirPath();
  }

  getCacheDirPath() {
    return findCacheDir({ name: this.name }) as string;
  }

  createFilename(internalPath: string) {
    if (!internalPath.startsWith('.')) {
      return internalPath;
    }

    const fileName = internalPath.replace(/\./g, '_').replace(/\//g, '.');

    return fileName;
  }

  getFilePath(moduleName: string, fileName: string) {
    return join(this.cacheDirPath, moduleName, fileName);
  }

  async createCacheDir() {
    await mkdir(this.cacheDirPath, { recursive: true });
  }

  async deleteCacheDir() {
    await del(this.cacheDirPath);
  }

  async createModuleDir(name: string) {
    await mkdir(join(this.cacheDirPath, name), { recursive: true });
  }

  async writeData(moduleName: string, fileName: string, content: string) {
    await writeFile(this.getFilePath(moduleName, fileName), content);
  }

  async readData(moduleName: string, fileName: string) {
    return await readFile(this.getFilePath(moduleName, fileName), 'utf-8');
  }
}
