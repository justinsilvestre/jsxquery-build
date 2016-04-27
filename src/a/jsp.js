import { join, basename } from 'path';

export default function jspMessage (schemaFilename) {
  const cutoffSchema = join(basename(schemaFilename));
  return `<%----This is an automatically generated .jsp file---%>
<%----You must make edits in the appropriate .js(x)--%>
<%----files, or they will probably get overwritten.--%>
<%----Look in '${cutoffSchema}' to find those files.---%>\n\n`;
}
