import { clientConfig } from '~/shared/clientConfig';

export function getS3Url(path: string) {
  const cleaned = path.startsWith('/') ? path.substring(1) : path;
  return `${clientConfig.s3BaseUrl}/${cleaned}`;
}
