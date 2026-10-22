import { readFile, readdir, stat } from 'node:fs/promises';

const landwhale = [
  'base',
  'backpack',
  'gold-flipper',
  'scanner',
  'spikes',
  'spine-eyes',
];
const required = landwhale.map((name) => `public/assets/landwhale/${name}.png`);
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

try {
  const images = (await readdir('public/assets/images', { recursive: true }))
    .filter((name) => name.endsWith('.png'))
    .map((name) => `public/assets/images/${name}`);
  if (images.length === 0) throw new Error('No image-display PNGs found');
  for (const path of [...required, ...images]) {
    if ((await stat(path)).size > 25 * 1024 * 1024) {
      throw new Error(`Asset exceeds Cloudflare Pages 25 MiB limit: ${path}`);
    }
    if (!(await readFile(path)).subarray(0, 8).equals(pngSignature)) {
      throw new Error(`Not a PNG file: ${path}`);
    }
  }
  console.log(`Validated ${required.length + images.length} public images.`);
} catch (error) {
  console.error(
    'Required public images are missing or invalid. See README.md: Images.',
  );
  console.error(error.message);
  process.exitCode = 1;
}
