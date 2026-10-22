import type { Config } from '@react-router/dev/config';

export default {
  ssr: false,
  prerender: ['/', '/landwhale', '/image-display'],
} satisfies Config;
