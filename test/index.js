import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from 'babel-core';
import plugin from '../src';

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('it', () => {

  const fixturesDir = path.join(__dirname, 'fixtures');

  it('should transform stateful functional component into ES2015 class', () => {
    const actualPath = path.join(fixturesDir, 'actual.js');
    const actual = transformFileSync(actualPath).code;

    const expected = fs.readFileSync(
        path.join(fixturesDir, 'expected.js')
    ).toString();

    assert.equal(trim(actual), trim(expected));
  });
});
