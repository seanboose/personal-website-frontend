import { getIsServer } from './renderEnvironment';

export interface ClientConfig {
  apiUrl: string;
}

export interface ServerConfig extends ClientConfig {
  authRequestKey: string;
}

export const clientConfig: ClientConfig = {
  apiUrl: getRequiredClientEnv('VITE_API_URL'),
};

export const serverConfig: ServerConfig = {
  ...clientConfig,
  authRequestKey: getRequiredServerEnv('AUTH_REQUEST_KEY'),
};

function getRequiredClientEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required client env var: ${key}`);
  }
  return value;
}

function getRequiredServerEnv(key: string): string {
  if (!getIsServer()) {
    throw new Error('Forbidden attempt to access server env in client context');
  }
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required server env var: ${key}`);
  }
  return value;
}
