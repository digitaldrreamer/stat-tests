import { dev } from "$app/environment";

// src/hooks.client.js
export const handleFetch = async ({ request, fetch }) => {
  console.log('handleFetch called with request:', request);
  const url = new URL(request.url);
  console.log('Parsed URL:', url);

  const trustedHosts = dev
    ? ['localhost', 'new-supreme-penguin.ngrok-free.app']
    : ['api.haha.ng'];
  console.log('Trusted hosts:', trustedHosts);

  if (trustedHosts.includes(url.hostname)) {
    console.log('Request is to a trusted host:', url.hostname);

    const headers = new Headers(request.headers);
    console.log('Original headers:', headers);

    const cookies = document.cookie.split(';');
    console.log('Cookies:', cookies);
    const sessionTokenCookie = cookies.find(c => c.trim().startsWith('sessionToken='));
    const sessionToken = sessionTokenCookie ? sessionTokenCookie.split('=')[1].trim() : null;
    console.log('Extracted sessionToken:', sessionToken);

    if (sessionToken) {
      headers.set('Authorization', `Bearer ${sessionToken}`);
      console.log('Updated headers with Authorization:', headers);
    }

    const modifiedRequest = new Request(request, {
      headers,
      credentials: 'include',
      method: request.method,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      mode: request.mode,
      cache: request.cache,
      integrity: request.integrity,
      keepalive: request.keepalive,
      signal: request.signal
    });
    console.log('Modified request:', modifiedRequest);

    return fetch(modifiedRequest);
  }

  console.log('Request is to an untrusted host, proceeding normally.');
  return fetch(request);
};
