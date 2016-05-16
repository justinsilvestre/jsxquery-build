import path, { dirname, basename, extname } from 'path';
import * as autogenerationStamps from './autogenerationStamps';
import { mkdirp, writeFile, getCurrentContents } from './ioUtils'
import print from './print'

function buildScriptsFile(el, pathMaybeWithoutExtension, forceOverwrite) {
  const fullPath = path.join(dirname(pathMaybeWithoutExtension), basename(pathMaybeWithoutExtension) + '.js');

  if (el.component && el.component.mutableProps.length === 0
      && Object.keys(el.component.propMethodStrings()).length === 0
      )
  return;

  const directoryName = dirname(fullPath)
  const fileName = basename(fullPath);

  return mkdirp(directoryName)
    .then(() => getCurrentContents(fullPath))
    .then(({ currentContents, message }) => {
      const stampRegex = autogenerationStamps.jsRegex;
      const stamped = currentContents && currentContents.match(stampRegex);
      const preservedContents = stamped ? currentContents.split(stampRegex)[0] : '';

      if (!forceOverwrite && currentContents && !stamped) {
        print(
          `You attempted to overwrite this file: ${fullPath}\n`
          + `But it's missing the stamp of an automatically generated file.\n`
          + `Run again with forceOverwrite: true if you'd like to overwrite this file anyway.\n`);
        throw new Error(`Cannot overwrite existing file without stamp unless forceOverwrite is set to true: ${fullPath}`)
      }

      print(message, fullPath);
      const stamp = autogenerationStamps.js(el.component ? el.component.namespaceName() : el.tagName);
      const pre = preservedContents + stamp;
      const newContents = el.component && el.component.jQuery();
      return writeFile(fullPath, pre + newContents);
    })
}

module.exports = buildScriptsFile;