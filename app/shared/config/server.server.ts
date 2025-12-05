import { type Client, clientConfig } from '~/shared/config/client';
import { getRequiredServerEnv } from '~/shared/config/util';

export interface ServerConfig extends Client {
  authRequestKey: string;
}

export const serverConfig: ServerConfig = {
  ...clientConfig,
  authRequestKey: getRequiredServerEnv('AUTH_REQUEST_KEY'),
};
