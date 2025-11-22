export interface ClientConfig {
  apiUrl: string;
  s3BaseUrl: string;
}
export const clientConfig: ClientConfig = {
  apiUrl: getRequiredClientEnv('VITE_API_URL'),
  s3BaseUrl: getRequiredClientEnv('VITE_S3_BASE_URL'),
};
function getRequiredClientEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required client env var: ${key}`);
  }
  return value;
}
