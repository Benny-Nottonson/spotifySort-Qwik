import type { RequestHandler } from "@builder.io/qwik-city";
import { isDev } from "@builder.io/qwik/build";
 
export const onRequest: RequestHandler = event => {
  if (isDev) return;
  const nonce = Date.now().toString(36);
  event.sharedMap.set("@nonce", nonce);
  const csp = [
    `default-src 'self' 'unsafe-inline'`,
    `font-src 'self'`,
    `img-src 'self' 'unsafe-inline' data:`,
    `style-src 'self' 'unsafe-inline'`,
    `frame-src 'self' 'nonce-${nonce}'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    'vitals.vercel-insights.com',
    'api.spotify.com'
  ];
 
  event.headers.set("Content-Security-Policy", csp.join("; "));
};