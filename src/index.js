import path, { dirname, basename, extname } from 'path';
import requireJsxQuery from './requireJsxQuery';
import flattenSchema from './flattenSchema'
import print from './print'
import buildMarkupFile from './buildMarkupFile';
import maybeBuildScriptFile from './buildScriptsFile';

const jspPath = (dir, fileName) => path.join(dir, fileName + '.jsp');
const jsPath = (dir, fileName) => path.join(dir, fileName + '.js');

function jsxQueryBuild(schemaLocation, options = {}) {
  let { markupOutputDirectory, scriptsOutputDirectory, babelOptions, forceOverwrite } = options;
  markupOutputDirectory = markupOutputDirectory || dirname(schemaLocation);
  scriptsOutputDirectory = scriptsOutputDirectory || dirname(schemaLocation);
  print('Generating markup files in', markupOutputDirectory);
  print('Generating script files in', scriptsOutputDirectory);

  const schema = requireJsxQuery(schemaLocation, babelOptions || {});
  const flattenedSchema = flattenSchema(schema);

  Promise.all([
    ...Object.keys(flattenedSchema).map(filePath =>
      buildMarkupFile(flattenedSchema[filePath], path.join(markupOutputDirectory, filePath), forceOverwrite)
    ),
    ...Object.keys(flattenedSchema).map(filePath =>
      maybeBuildScriptFile(flattenedSchema[filePath], path.join(scriptsOutputDirectory, filePath), forceOverwrite)
    )
  ])
  .then(arr => options.success && options.success(arr))
  .catch(err => (options.error || console.error)(err))

  return flattenedSchema;
}

module.exports = Object.assign(jsxQueryBuild, { markup: buildMarkupFile, requireJsxQuery } );
