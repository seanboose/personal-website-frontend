import { getRequiredClientEnv } from '~/shared/config/util';

export interface Client {
  apiUrl: string;
  s3BaseUrl: string;
}
export const clientConfig: Client = {
  apiUrl: getRequiredClientEnv('VITE_API_URL'),
  s3BaseUrl: getRequiredClientEnv('VITE_S3_BASE_URL'),
};
