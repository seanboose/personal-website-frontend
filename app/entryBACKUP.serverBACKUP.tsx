export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: unknown,
) {
  const url = new URL(request.url);

  // Block scanner traffic immediately - no SSR
  if (
    url.pathname.includes('.php') ||
    url.pathname.includes('wp-') ||
    url.pathname.includes('.env')
  ) {
    return new Response('Not Found', { status: 404 });
  }

  // Use default SSR for everything else
  return null; // Falls back to React Router's default handling
}
