import { afterEach, describe, expect, test, vi } from 'vitest';

import { getRequiredClientEnv, getRequiredServerEnv } from './util';

const key = 'TEST_KEY';
const value = 'TEST_VALUE';

describe('getRequiredClientEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('returns defined values', () => {
    vi.stubEnv(key, value);
    expect(getRequiredClientEnv(key)).toEqual(value);
  });

  test('throws on missing values', () => {
    expect(() => getRequiredClientEnv(key)).toThrowError('Missing');
  });
});

describe('getRequiredServerEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  test('throws in client context', () => {
    vi.stubGlobal('window', 'not undefined');
    vi.stubEnv(key, value);
    expect(() => getRequiredServerEnv(key)).toThrowError('Forbidden');
  });

  test('throws on missing values', () => {
    vi.stubGlobal('window', undefined);
    expect(() => getRequiredServerEnv(key)).toThrowError('Missing');
  });

  test('returns defined values in server context', () => {
    vi.stubGlobal('window', undefined);
    vi.stubEnv(key, value);
    expect(getRequiredClientEnv(key)).toEqual(value);
  });
});
