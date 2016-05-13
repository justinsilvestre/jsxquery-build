import path, { dirname, basename, extname } from 'path';
import * as autogenerationStamps from './autogenerationStamps';
import { mkdirp, writeFile, getCurrentContents } from './ioUtils'
import print from './print'

function buildMarkupFile(el, fullPath, forceOverwrite) {
  const directoryName = dirname(fullPath)
  const fileName = basename(fullPath);

  return mkdirp(directoryName)
    .then(() => getCurrentContents(fullPath))
    .then(({ currentContents, message }) => {
      const stampRegex = autogenerationStamps.jspRegex;
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
      const stamp = autogenerationStamps.jsp(el.component ? el.component.namespaceName() : el.tagName);
      const pre = preservedContents + stamp;
      const newContents = el.markup();
      return writeFile(fullPath, pre + newContents);
    })
}

module.exports = buildMarkupFile;