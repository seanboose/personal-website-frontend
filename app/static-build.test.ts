import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

const output = resolve('build/client');

function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

describe('production static output', () => {
  test.each([
    ['index.html', 'Who am I?'],
    ['landwhale/index.html', 'equip the landwhale'],
  ])('%s contains prerendered page content', (path, content) => {
    const html = readFileSync(resolve(output, path), 'utf8');
    expect(html).toContain(content);
    expect(html).toContain('<title>');
  });

  test('has a static 404 and no retired pages, demo assets or runtime server', () => {
    expect(readFileSync(resolve(output, '404.html'), 'utf8')).toContain(
      'Page not found',
    );
    expect(existsSync(resolve(output, 'login/index.html'))).toBe(false);
    expect(existsSync(resolve(output, 'image-display'))).toBe(false);
    expect(existsSync(resolve(output, 'assets/images'))).toBe(false);
    expect(existsSync(resolve('build/server'))).toBe(false);
  });

  test('client output contains no obsolete credentials or service references', () => {
    for (const path of files(output).filter((path) =>
      /\.(html|js|json|data|css)$/.test(path),
    )) {
      const content = readFileSync(path, 'utf8');
      // Values from local secret files must never be printed, including on failure.
      const forbidden =
        /AUTH_REQUEST_KEY|JWT_KEY|AWS_SECRET_ACCESS_KEY|GH_PACKAGES_PAT|internal-auth-key|up\.railway\.app|X-Amz-Signature|\b(?:AKIA|ASIA)[A-Z0-9]{16}\b|\bgh[pousr]_[A-Za-z0-9_]{20,}|github_pat_/;
      expect(
        forbidden.test(content),
        `Unexpected sensitive/service marker in ${path}`,
      ).toBe(false);
    }
  });
});
