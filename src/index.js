import path, { dirname } from 'path';
import escapeStringRegexp from 'escape-string-regexp'
import getSchema from './getSchema';
import flattenSchema from './flattenSchema'
import * as autogenerationStamps from './autogenerationStamps'
import { fileExists, mkdirp, writeFile, getCurrentContents } from './ioUtils'
import print from './print'

const jspPath = (dir, fileName) => path.join(dir, fileName + '.jsp');
const jsPath = (dir, fileName) => path.join(dir, fileName + '.js');

function jsxQueryBuild(schemaLocation, options = {}) {
  let { markupOutputDirectory, scriptsOutputDirectory, babelOptions, forceOverwrite } = options;
  markupOutputDirectory = markupOutputDirectory || dirname(schemaLocation);
  scriptsOutputDirectory = scriptsOutputDirectory || dirname(schemaLocation);
  print('Generating markup files in', markupOutputDirectory);
  print('Generating script files in', scriptsOutputDirectory);


  const schema = getSchema(schemaLocation, babelOptions || {});
  const flattenedSchema = flattenSchema(schema);

  const buildFile = (relativePath, ext) => {
    const dir = {
      jsp: markupOutputDirectory,
      js: scriptsOutputDirectory,
    }[ext];
    const fullPath = path.join(dir, relativePath + '.' + ext)
    return mkdirp(dirname(fullPath))
    .then(() => getCurrentContents(fullPath))
    .then((currentContents) => {
      const stamp = autogenerationStamps[ext](schemaLocation);
      const stampRegex = new RegExp('(.*)' + escapeStringRegexp(stamp) + '(.*)');
      const [stamped, preservedContents, replacedContents] = currentContents.match(stampRegex) || [];

      if (ext === 'js' && (flattenedSchema[relativePath].component.mutableProps.length === 0
        && Object.keys(flattenedSchema[relativePath].component.propMethodStrings()).length === 0
        ))
        return;

      if (!forceOverwrite && currentContents && !stamped) {
        print(
          `You attempted to overwrite this file: ${fullPath}\n`
          + `But it's missing the stamp of an automatically generated file.\n`
          + `Run again with forceOverwrite: true if you'd like to overwrite this file anyway.\n`);
        throw new Error(forceOverwrite + `Cannot overwrite existing file without stamp unless forceOverwrite is set to true: ${fullPath}`)
      }

      const pre = (preservedContents || '') + stamp;
      const newContents = {
        jsp: flattenedSchema[relativePath].markup(),
        js: flattenedSchema[relativePath].component.jQuery()
      }[ext];
      return writeFile(fullPath, pre + newContents)
    });
  }

  Promise.all([
    ...Object.keys(flattenedSchema).map(filePath =>
      buildFile(filePath, 'jsp')
    ),
    ...Object.keys(flattenedSchema).map(filePath =>
      buildFile(filePath, 'js')
    )
  ])
  .then(arr => options.success && options.success(arr))
  .catch(err => (options.error || console.error)(err))

  return flattenedSchema;
}

module.exports = jsxQueryBuild;
