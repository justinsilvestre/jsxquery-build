import { Element } from 'jsxquery';
import path from 'path';

export default function flattenSchema(schemaObj, ...pathChain) {
  return Object.keys(schemaObj).reduce((hash, pathLink) => 
    Object.assign(hash,
      Element.isElement(schemaObj[pathLink])
      ? { [path.join(...pathChain, pathLink)]: schemaObj[pathLink] }
      : flattenSchema(schemaObj[pathLink], ...pathChain, pathLink)
    )
  , {});
}