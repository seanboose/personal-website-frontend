import { mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const bucket = process.argv.slice(2).find((arg) => arg !== '--');
if (!bucket || !/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(bucket)) {
  console.error('Usage: pnpm run import:images -- <production-bucket-name>');
  process.exit(1);
}

// AWS CLI uses the owner's existing profile/environment. Never store keys here.
for (const [prefix, destination, include] of [
  ['assets/landwhale/', 'public/assets/landwhale', '*.png'],
  ['', 'public/assets/images', 'auth-image*.png'],
]) {
  await mkdir(destination, { recursive: true });
  const result = spawnSync(
    'aws',
    [
      's3',
      'sync',
      `s3://${bucket}/${prefix}`,
      destination,
      '--exclude',
      '*',
      '--include',
      include,
      '--no-progress',
    ],
    { stdio: 'inherit' },
  );
  if (result.error) {
    console.error(
      'Unable to run AWS CLI. Install it and configure an authorized read-only profile.',
    );
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}
