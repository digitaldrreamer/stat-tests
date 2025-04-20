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
    const sessionIdCookie = cookies.find(c => c.trim().startsWith('sessionId='));
    const sessionId = sessionIdCookie ? sessionIdCookie.split('=')[1].trim() : null;
    console.log('Extracted sessionId:', sessionId);

    if (sessionId) {
      headers.set('Authorization', `Bearer ${sessionId}`);
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
