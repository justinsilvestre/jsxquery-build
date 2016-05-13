import { join, basename } from 'path';
import escapeStringRegexp from 'escape-string-regexp';

function padRight(string, totalLength) {
  const paddingLength = totalLength - string.length < 0 ? 0 : totalLength - string.length;
  return string + ' '.repeat(paddingLength);
}

export function jsp(elementName) {
  return `<%--- This file was automatically generated from this ---%>
<%--- jsxQuery element: ${padRight(`<${elementName}>`, 29)} ---%>
<%--- Please make any edits in the appropriate .js(x) ---%>
<%--- files so they don't end up getting overwritten. ---%>\n\n`;
}

export function js(elementName) {
  return `// This file was automatially generated from this
// jsxQuery element: <${elementName}>
// Please make any edits in the appropriate .jsx(x)
// files so they don't end up getting overwritten.\n\n`;
}

export function regexFor(stampFunction) {
  const delimiter = '!@#$%^&*()(*&^%$#@!'
  const splitRegex = new RegExp('\\s+\<' + escapeStringRegexp(delimiter) + '\>\\s+');
  const [begin, end] = stampFunction(delimiter).split(splitRegex).map(escapeStringRegexp)
  return new RegExp(`${begin}.+${end}`);
}

export const jspRegex = regexFor(jsp);
export const jsRegex = regexFor(js);

'(.*)<%--- This file was automatically generated from this ---%>\n<%--- jsxQuery element:.*---%>\n<%--- Please make any edits in the appropriate \\.js\\(x\\) ---%>\n<%--- files so they don\'t end up getting overwritten\\. ---%>\n\nThis content should get overwritten\\.'


'This content should be preserved.\n<%--- This file was automatically generated from this ---%>\n<%--- jsxQuery element: <elementOrComponentName>      ---%>\n<%--- Please make any edits in the appropriate .js(x) ---%>\n<%--- files so they don\'t end up getting overwritten. ---%>\n\nThis content should get overwritten.'

'(.*[]<%--- This file was automatically generated from this ---%>\n<%---.+---%>\n<%--- Please make any edits in the appropriate \\.js\\(x\\) ---%>\n<%--- files so they don\'t end up getting overwritten\\. ---%>\n\nThis content should get overwritten\\.'

