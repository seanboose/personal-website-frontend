import { getIsServer } from '~/shared/renderEnvironment';

export function getRequiredClientEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required client env var: ${key}`);
  }
  return value;
}

export function getRequiredServerEnv(key: string): string {
  if (!getIsServer()) {
    throw new Error('Forbidden attempt to access server env in client context');
  }
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required server env var: ${key}`);
  }
  return value;
}
