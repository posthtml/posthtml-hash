import fs from 'fs';
import path from 'path';
import { createHash, hashFileName, processFile } from '../utils';

describe('createHash', () => {
  test('hash length – 20 (default)', () => {
    const file = path.join(__dirname, '__fixtures__/original', 'bundle.min.js');
    const buffer = fs.readFileSync(file);
    const hash = createHash(buffer);

    expect(hash).toEqual(expect.any(String));
    expect(hash.length).toEqual(20);
  });

  test('hash length – 10', () => {
    const file = path.join(__dirname, '__fixtures__/original', 'bundle.min.js');
    const buffer = fs.readFileSync(file);
    const hash = createHash(buffer, 10);

    expect(hash).toEqual(expect.any(String));
    expect(hash.length).toEqual(10);
  });

  test('hash length has to be greater than 1', () => {
    const file = path.join(__dirname, '__fixtures__/original', 'bundle.min.js');
    const buffer = fs.readFileSync(file);

    expect(() => {
      createHash(buffer, 0);
    }).toThrowError('Hash length must be greater than 1');
  });
});

describe('hashFileName', () => {
  test('filename – "bundle.js"', () => {
    const hashedFileName = hashFileName('bundle.js', 'hash');
    expect(hashedFileName).toEqual('bundle.hash.js');
  });

  test('filename – "bundle.min.js"', () => {
    const hashedFileName = hashFileName('bundle.min.js', 'hash');
    expect(hashedFileName).toEqual('bundle.min.hash.js');
  });

  test('filename – ".js"', () => {
    const hashedFileName = hashFileName('.js', 'hash');
    expect(hashedFileName).toEqual('.hash.js');
  });
});

describe('processFile', () => {
  it('throws an error if the file does not exist', () => {
    const fileName = path.join(__dirname, '__fixtures__/original', 'bundle.js');
    expect(() => {
      processFile(fileName, () => true);
    }).toThrowError(`Could not find file at "${fileName}"`);
  });

  it('invokes the callback if the file exists', () => {
    const cb = jest.fn();
    const fileName = path.join(
      __dirname,
      '__fixtures__/original',
      'bundle.min.js'
    );
    processFile(fileName, cb);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});