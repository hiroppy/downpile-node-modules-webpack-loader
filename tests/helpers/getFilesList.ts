'use strict';

import { readdirSync } from 'fs';
import { join } from 'path';

export function getFilesList(baseDir: string) {
  // check caches
  const dirList: {
    [key in string]: string[];
  } = {};

  for (const dir of readdirSync(baseDir)) {
    dirList[dir] = [];

    for (const file of readdirSync(join(baseDir, dir))) {
      dirList[dir].push(file);
    }
  }

  return dirList;
}
