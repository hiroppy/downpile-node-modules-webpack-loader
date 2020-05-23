import webpack from 'webpack';
import * as acorn from 'acorn';

export async function checkResult(config: any, version: acorn.Options['ecmaVersion']) {
  if (version === undefined) {
    throw new Error('version is undefined');
  }

  return new Promise((resolve, reject) => {
    const compiler = webpack(config);

    compiler.run((err, stats) => {
      if (err || stats.compilation.errors.length !== 0) {
        return reject(err || stats.compilation.errors);
      }

      const src = stats.compilation.assets['main.js']._value;

      try {
        acorn.parse(src, { ecmaVersion: version });
        resolve('ok');
      } catch (e) {
        reject(e.message);
      }
    });
  });
}
