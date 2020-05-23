import { existsSync, promises } from 'fs';
import { join, relative, dirname } from 'path';
import rimraf from 'rimraf';

describe('Cache', () => {
  jest.doMock('find-cache-dir', () => ({ name }: { name: string }) =>
    join(__dirname, '.cache-test', name)
  );
  const { Cache } = require('../src/Cache');
  let cacheDir = '';

  afterEach(() => {
    rimraf.sync(dirname(cacheDir));
  });

  const cache = new Cache();

  it('should return the loader name', () => {
    expect(cache.name).toMatchSnapshot();
  });

  it('should return a cache dir', () => {
    cacheDir = cache.getCacheDirPath();
    expect(relative(__dirname, cacheDir)).toMatchSnapshot();
  });

  it('should return a file path', () => {
    const filePath = cache.getFilePath('mn', 'fn');

    expect(relative(__dirname, filePath)).toMatchSnapshot();
  });

  it('should create a directory', async () => {
    await cache.createCacheDir();

    expect(existsSync(cache.getCacheDirPath())).toBeTruthy();
  });

  it('should delete a directory', async () => {
    await cache.createCacheDir();
    await cache.deleteCacheDir();

    expect(existsSync(cache.getCacheDirPath())).toBeFalsy();
  });

  it('should create a module directory', async () => {
    const moduleName = 'foo';

    await cache.createCacheDir();
    await cache.createModuleDir(moduleName);

    expect(existsSync(join(cache.getCacheDirPath(), moduleName))).toBeTruthy();
  });

  it('should write/read data', async () => {
    const moduleName = 'foo';
    const fileName = 'testFile';
    const content = 'foo!';
    const p = join(cache.getCacheDirPath(), moduleName, fileName);

    await cache.createCacheDir();
    await cache.createModuleDir(moduleName);
    await cache.writeData(moduleName, fileName, content);

    expect(existsSync(p)).toBeTruthy();

    expect(await promises.readFile(p, 'utf-8')).toMatchSnapshot();
    expect(await cache.readData(moduleName, fileName)).toMatchSnapshot();
  });

  it('should create a filename', () => {
    expect(cache.createFilename('esprima')).toMatchSnapshot();
    expect(cache.createFilename('./lib/source-map-consumer')).toMatchSnapshot();
    expect(cache.createFilename('../lib/shared')).toMatchSnapshot();
    expect(cache.createFilename('./base64')).toMatchSnapshot();
    expect(cache.createFilename('../../../base64')).toMatchSnapshot();
  });
});
