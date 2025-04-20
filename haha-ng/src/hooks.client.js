import { dev } from "$app/environment";

// src/hooks.client.js
export const handleFetch = async ({ request, fetch }) => {
  const url = new URL(request.url);
  
  // Check if the request is going to your API domain
  if ((dev ? ['localhost:5173', 'new-supreme-penguin.ngrok-free.app'] : ['api.haha.ng']).includes(url.hostname)) {
    // Clone the headers
    const headers = new Headers(request.headers);
    
    // Extract sessionId from document.cookie
    const cookies = document.cookie.split(';');
    const sessionIdCookie = cookies.find(c => c.trim().startsWith('sessionId='));
    const sessionId = sessionIdCookie ? sessionIdCookie.split('=')[1].trim() : null;
    
    if (sessionId) {
      // Set the sessionId as a Bearer token
      headers.set('Authorization', `Bearer ${sessionId}`);
    }
    
    // Create modified request with the updated headers
    const modifiedRequest = new Request(request, {
      headers,
      credentials: 'include', // Still include credentials for other cookies
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
  
  // For all other requests, proceed normally
  return fetch(request);
};