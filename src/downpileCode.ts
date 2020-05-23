import * as acorn from 'acorn';
import { transformAsync } from '@babel/core';
import presetEnv from '@babel/preset-env';

export async function downpileCode(
  src: string,
  version = 5,
  options: {
    polyfill?: boolean;
  } = {}
): Promise<{
  src: string;
  isScopedVersion: 'yes' | 'no';
}> {
  try {
    acorn.parse(src, { ecmaVersion: version as acorn.Options['ecmaVersion'] });

    return {
      src,
      isScopedVersion: 'yes',
    };
  } catch (err) {
    // @ts-ignore
    const { code } = await transformAsync(src, {
      presets: [
        [
          presetEnv,
          {
            modules: false,
            useBuiltIns: options.polyfill ? 'usage' : false,
          },
        ],
      ],
    });

    return {
      src: code,
      isScopedVersion: 'no',
    };
  }
}
