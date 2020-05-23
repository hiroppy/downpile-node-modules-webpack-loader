import { join } from 'path';
import process from 'process';
import del from 'del';
import { checkResult } from './helpers/checkResult';
import { getFilesList } from './helpers/getFilesList';
import { loaderName } from '../src/constants';

describe('e2e', () => {
  describe('simple', () => {
    const { base, getLoader } = require('./fixtures/simple/webpack.config');
    const cacheDir = join(__dirname, `./fixtures/simple/node_modules/.cache/${loaderName}`);

    afterEach(async () => {
      await del(cacheDir);
    });

    beforeAll(() => {
      jest.spyOn(process, 'cwd').mockReturnValue(join(__dirname, './fixtures/simple'));
    });

    it('es5', async () => {
      // check es5 or not
      await expect(checkResult(base, 5)).rejects.toBe("The keyword 'const' is reserved (1:928)");
      // add this loader
      await expect(checkResult({ ...base, ...getLoader() }, 5)).resolves.toBe('ok');

      expect(getFilesList(cacheDir)).toMatchSnapshot();
    });
  });

  describe.skip('nested', () => {
    const { base, getLoader } = require('./fixtures/nested/webpack.config');
    const cacheDir = join(__dirname, `./fixtures/nested/node_modules/.cache/${loaderName}`);

    beforeAll(() => {
      jest.spyOn(process, 'cwd').mockReturnValue(join(__dirname, './fixtures/nested'));
    });

    afterEach(async () => {
      await del(cacheDir);
    });

    it('es5', async () => {
      // add this loader
      await expect(checkResult({ ...base, ...getLoader() }, 5)).resolves.toBe('ok');

      expect(getFilesList(cacheDir)).toMatchSnapshot();
    });
  });
});
