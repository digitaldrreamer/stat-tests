// src/hooks.server.js
import { dev } from '$app/environment';
/** @type {import('@sveltejs/kit').HandleFetch} */
export const handleFetch = async ({ request, fetch, event }) => {
  const url = new URL(request.url);
  // Define trusted API hostnames
  const trustedHosts = dev
    ? ['localhost:5173', 'new-supreme-penguin.ngrok-free.app']
    : ['api.haha.ng'];
    
  // If request is to a trusted API domain
  if (trustedHosts.includes(url.hostname)) {
    // Clone headers from original request
    const headers = new Headers(request.headers);
    
    // Get the sessionId cookie directly from event.cookies
    const sessionId = event.cookies.get('sessionId');
    
    if (sessionId) {
      // Set the sessionId as a Bearer token in Authorization header
      headers.set('Authorization', `Bearer ${sessionId}`);
    }
    
    const modifiedRequest = new Request(request, {
      headers,
      credentials: 'include', // Keep this for other cookies if needed
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
    
    return fetch(modifiedRequest);
  }
  
  return fetch(request);
};