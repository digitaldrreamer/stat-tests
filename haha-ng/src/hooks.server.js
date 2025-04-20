// src/hooks.server.js
import { dev } from '$app/environment';
/** @type {import('@sveltejs/kit').HandleFetch} */
export const handleFetch = async ({ request, fetch, event }) => {
  console.log('handleFetch', request);
  const url = new URL(request.url);
  console.log('url', url);
  // Define trusted API hostnames
  const trustedHosts = dev
    ? ['localhost', 'new-supreme-penguin.ngrok-free.app']
    : ['api.haha.ng'];
  console.log('trustedHosts', trustedHosts);
  console.log('hostname', url.hostname);
    
  // If request is to a trusted API domain
  if (trustedHosts.includes(url.hostname)) {
    console.log('trustedHosts.includes(url.hostname)', true);
    // Clone headers from original request
    const headers = new Headers(request.headers);
    console.log('headers', headers);
    
    // Get the sessionId cookie directly from event.cookies
    const sessionId = event.cookies.get('sessionId');
    console.log('sessionId', sessionId)
    console.log('event.cookies', event.cookies.getAll())
    
    if (sessionId) {
      console.log('sessionId', true);
      // Set the sessionId as a Bearer token in Authorization header
      headers.set('Authorization', `Bearer ${sessionId}`);
      console.log('headers', headers);
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
    console.log('modifiedRequest', modifiedRequest);
    
    return fetch(modifiedRequest);
  }
  
  return fetch(request);
};
