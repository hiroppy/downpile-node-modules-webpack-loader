import { join } from 'path';
import { loader } from 'webpack';
import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
// const exitHook = require('exit-hook');
import { loaderName, defaultVersion } from './constants';
import { defaultOptions } from './defaultOptions';
import { Modules } from './Modules';
import { Cache } from './Cache';
import { downpileCode } from './downpileCode';
import schema from './options.json';

let initialFlag = false;
const lockFile = require(join(process.cwd(), 'package-lock.json'));
const modules = new Modules(lockFile);
const cache = new Cache();

// TODO: if build finishes, we need to output moduleList
// TODO: emitError
export default async function downpileLoader(this: loader.LoaderContext, src: string) {
  const custom = getOptions(this);
  const options: NonNullable<typeof defaultOptions> = <const>{
    ...defaultOptions,
    ...custom,
  };
  const cb = this.async()!;

  if (!initialFlag) {
    // TODO: need to check the type
    validateOptions(schema as any, options, {
      name: loaderName,
    });
    await cache.createCacheDir();

    // read modulesList from cache
    // versionが違ったら更新する、Modulesの初期化
    initialFlag = true;
  }

  const fileName = cache.createFilename(this._module.rawRequest);
  const data = modules.getModuleInfoFromContext(this._module.context);

  if (data === null) {
    cb(null, src);
    return;
  }

  const moduleFromCache = modules.getModuleFromCache(data.dirName);
  let resSrc = '';

  if (!moduleFromCache) {
    const { src: moduleCode, isScopedVersion } = await downpileCode(src, defaultVersion, options);

    if (data.version !== undefined) {
      if (isScopedVersion === 'no') {
        await cache.createModuleDir(data.dirName);
        await cache.writeData(data.dirName, fileName, moduleCode);
      }
      modules.pushToCache(data.dirName, { isScopedVersion });
    }

    resSrc = moduleCode;
  } else {
    // return src that is via webpack
    if (moduleFromCache.isScopedVersion === 'yes') {
      resSrc = src;
    } else {
      try {
        resSrc = await cache.readData(data.dirName, fileName);
      } catch (e) {
        // this loader has already known the module which should be downgraded but its file in the module doesn't exist at .cache.
        const { src: moduleCode } = await downpileCode(src, defaultVersion, options);

        await cache.writeData(data.dirName, fileName, moduleCode);
        resSrc = moduleCode;
      }
    }
  }

  cb(null, resSrc);
}

// TODO: write modulesList
// exitHook(() => {
//   console.log('Exiting');
// });
