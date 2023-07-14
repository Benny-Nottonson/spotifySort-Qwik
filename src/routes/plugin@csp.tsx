import type { RequestHandler } from "@builder.io/qwik-city";
import { isDev } from "@builder.io/qwik/build";
 
export const onRequest: RequestHandler = event => {
  if (isDev) return;
  const nonce = Date.now().toString(36);
  event.sharedMap.set("@nonce", nonce);
  const csp = [
    `default-src 'self' 'unsafe-inline'`,
    `font-src 'self'`,
    `frame-src 'self' 'nonce-${nonce}'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `connect-src 'self' https://api.spotify.com`,
    `img-src 'self' https://i.scdn.co https://mosaic.scdn.co`,
  ];
 
  event.headers.set("Content-Security-Policy", csp.join("; "));
};