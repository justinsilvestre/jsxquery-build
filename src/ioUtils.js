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
    fs.readFile(fullPath, 'utf8', (err, data) => {
      if (!err) {
        print('Overwriting file', fullPath);
        resolve(data);
      } else if (err.code === 'ENOENT') {
        print('Creating file', fullPath)
        resolve('');
      } else {
        reject(err);
      }
    })
  })
}
