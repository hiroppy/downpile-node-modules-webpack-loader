import { Modules } from '../src/Modules';

describe('Modules', () => {
  describe('simple', () => {
    async function getLockFile() {
      const { default: lockFile } = await import('./fixtures/simple/package-lock.json');

      return lockFile;
    }

    it('should return module cache', async () => {
      const modules = new Modules(await getLockFile(), 5);

      expect(modules.getModuleCache()).toMatchSnapshot();
    });

    it('should push data to module cache', async () => {
      const modules = new Modules(await getLockFile(), 5);

      modules.pushToCache('foo', { isScopedVersion: 'no' });
      expect(modules.getModuleCache()).toMatchSnapshot();
    });

    it('should get data from module cache', async () => {
      const modules = new Modules(await getLockFile(), 5);

      modules.pushToCache('foo', { isScopedVersion: 'no' });
      expect(modules.getModuleFromCache('foo')).toMatchSnapshot();
    });

    it('should convert module info from context', async () => {
      const modules = new Modules(await getLockFile(), 5);

      expect(
        modules.parseModuleInfoFromContext('/fixtures/node_modules/foo/bar')
      ).toMatchSnapshot();
      expect(
        modules.parseModuleInfoFromContext('/fixtures/node_modules/foo/node_modules/bar')
      ).toMatchSnapshot();
      expect(
        modules.parseModuleInfoFromContext(
          '/fixtures/node_modules/foo/node_modules/bar/node_modules/baz'
        )
      ).toMatchSnapshot();
    });

    it('should return hit module', async () => {
      const modules = new Modules(await getLockFile(), 5);

      expect(
        modules.getModuleInfoFromContext('./node_modules/react/node_modules/object-assign')
      ).toMatchSnapshot();
      expect(modules.getModuleInfoFromContext('./node_modules/object-assign')).toMatchSnapshot();
      expect(modules.getModuleInfoFromContext('./node_modules/chalk')).toMatchSnapshot();
    });
  });

  describe('nested', () => {
    async function getLockFile() {
      const { default: lockFile } = await import('./fixtures/nested/package-lock.json');

      return lockFile;
    }

    it('should return hit module', async () => {
      const modules = new Modules(await getLockFile(), 5);

      // v4
      expect(
        modules.getModuleInfoFromContext('./node_modules/react/node_modules/object-assign')
      ).toMatchSnapshot();
      expect(
        modules.getModuleInfoFromContext('./node_modules/react-dom/node_modules/object-assign')
      ).toMatchSnapshot();
      // v3
      expect(modules.getModuleInfoFromContext('./node_modules/object-assign')).toMatchSnapshot();
      // expect(
      //   modules.getModuleInfoFromContext('./node_modules/gulp-help', 'foo')
      // ).toMatchSnapshot();
      // v2
      expect(
        modules.getModuleInfoFromContext('./node_modules/jstransform/node_modules/object-assign')
      ).toMatchSnapshot();
      // N/A
      expect(
        modules.getModuleInfoFromContext('./node_modules/xxxxx/node_modules/object-assign')
      ).toMatchSnapshot();
    });
  });
});
