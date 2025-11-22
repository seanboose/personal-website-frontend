import { type ClientConfig, clientConfig } from '~/shared/clientConfig';

import { getIsServer } from './renderEnvironment';

export interface ServerConfig extends ClientConfig {
  authRequestKey: string;
}

export const serverConfig: ServerConfig = {
  ...clientConfig,
  authRequestKey: getRequiredServerEnv('AUTH_REQUEST_KEY'),
};

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
