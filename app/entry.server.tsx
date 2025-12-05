export default function handleRequest(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  responseStatusCode: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  responseHeaders: Headers,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  routerContext: unknown,
) {
  const url = new URL(request.url);

  // block scanner traffic immediately (no SSR)
  if (
    url.pathname.includes('.php') ||
    url.pathname.includes('wp-') ||
    url.pathname.includes('.env')
  ) {
    return new Response('Not Found', { status: 404 });
  }

  return null; // f back to react router's default handling
}
