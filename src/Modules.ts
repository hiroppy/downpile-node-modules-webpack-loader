import { sep } from 'path';
import { Options } from 'acorn';
import { flattenPackageLockDeps, PackageLock } from 'flatten-package-lock-deps';

export class Modules {
  modulesMap: ReturnType<typeof flattenPackageLockDeps>;
  cacheList: {
    targetVersion: number;
    modules: {
      [key in string]?: {
        isScopedVersion: 'yes' | 'no';
      };
    };
  };

  constructor(lockFile: PackageLock, version: Options['ecmaVersion'] = 5) {
    this.modulesMap = flattenPackageLockDeps(lockFile, { ignoreDev: true });
    // readFile cache
    this.cacheList = {
      targetVersion: version,
      modules: {},
    };
  }

  // node_modules/<target>
  // node_modules/yyyy/node_modules/<target>
  parseModuleInfoFromContext(context: string) {
    const modulePathArr = context.split(sep);
    let parent = '';
    let name = '';

    // depth === the number of node_modules
    let depth = -1;

    for (let i = 0; i < modulePathArr.length; i++) {
      const p = modulePathArr[i];

      if (p === 'node_modules') {
        ++depth;

        if (depth >= 1) {
          parent = name;
        }

        name = modulePathArr[i + 1];
      }
    }

    return {
      parent,
      name,
      depth,
    };
  }

  getModuleInfoFromContext(context: string) {
    const { name, depth, parent } = this.parseModuleInfoFromContext(context);
    const { integrity, version } =
      Object.values(this.modulesMap).find((m) => {
        if (m.name === name) {
          // node_modules/xxx, it means this module is written in package.json
          if (depth === 0 && m.depth === 0) {
            return true;
          }
          // node_modules/xxx/node_modules/yyy
          if (m.parents.includes(parent)) {
            return true;
          }
        }
        return false;
      }) || {};

    if (!integrity) {
      return null;
    }

    return {
      dirName: `${name}-${version}`,
      name,
      depth,
      version,
      integrity,
    };
  }

  getModuleCache() {
    return this.cacheList;
  }

  getModuleFromCache(moduleName: string) {
    return this.cacheList.modules[moduleName];
  }

  pushToCache(name: string, data: { isScopedVersion: 'yes' | 'no' }) {
    this.cacheList.modules[name] = data;
  }
}
