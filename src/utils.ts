import fs from 'fs';
import hasha from 'hasha';
import { DEFAULT_HASH_LENGTH } from './plugin';

function createHash(buffer: Buffer, hashLength: number = DEFAULT_HASH_LENGTH) {
  if (hashLength <= 1) {
    throw new Error('Hash length must be greater than 1');
  }

  return hasha(buffer).slice(0, hashLength);
}

function hashFileName(fileName: string, hash: string) {
  return fileName
    .split('.')
    .map((item, idx, arr) =>
      idx === arr.length - 1 ? [hash, item].join('.') : item
    )
    .join('.');
}

function processFile(file: string, cb: () => void) {
  if (fs.existsSync(file)) {
    cb.call([]);
  }
}

export { createHash, hashFileName, processFile };
