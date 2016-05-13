import fs from 'fs'
import mkdirpOriginal from 'mkdirp';
import print from './print';

export function mkdirp(dir, opts) {
  return new Promise((resolve, reject) =>
    mkdirpOriginal(dir, opts,
      (err, made) => err === null ? resolve(made) : reject(err)
    )
  );
}

export function writeFile(fullPath, newContents) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fullPath, newContents, 'utf8', err => {
      err ? reject(err) : resolve(newContents)
    })
  });
}

export function getCurrentContents(fullPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(fullPath, 'utf8', (err, currentContents) => {
      if (!err) {
        resolve({ currentContents, message: 'Overwriting file' });
      } else if (err.code === 'ENOENT') {
        resolve({ currentContents: '', message: 'Creating file' });
      } else {
        reject(err);
      }
    })
  })
}
