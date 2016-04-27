import { join, basename } from 'path';

export function jsp(schemaFilename) {
  const cutoffSchema = join(basename(schemaFilename));
  return `<%----This is an automatically generated .jsp file---%>
<%----You must make edits in the appropriate .js(x)--%>
<%----files, or they will probably get overwritten.--%>
<%----Look in '${cutoffSchema}' to find those files.---%>\n\n`;
}

export function js(schemaFilename) {
  const cutoffSchema = join(basename(schemaFilename));
  return `// This is an automatically generated .js file.
// Anything below this comment block will likely get overwritten.
// Look in ${cutoffSchema} for info on the source files.\n\n`;
}
