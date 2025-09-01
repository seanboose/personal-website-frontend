export interface Config {
  apiUrl: string;
}

export const config: Config = {
  apiUrl: getRequiredEnv('VITE_API_URL'),
};

function getRequiredEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}
