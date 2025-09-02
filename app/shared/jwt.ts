// TODO need to lock this down to SSR only somehow
// i think it should throw an error already since it can't access process.env in CSR anyway
export const jwtSecret = getJwtSecret();

function getJwtSecret(): string {
  const secret = process.env.JWT_KEY;
  if (!secret) {
    throw new Error('Missing JWT_KEY env var');
  }
  return secret;
}
