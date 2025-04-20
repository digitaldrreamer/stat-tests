import { dev } from '$app/environment';

// In hooks.server.js
export const handleFetch = async ({ request, fetch, event }) => {
    const url = new URL(request.url);
    
    if ((dev ? ['localhost:5173', 'new-supreme-penguin.ngrok-free.app'] : ['api.haha.ng']).includes(url.hostname)) {
      // Get the original request's cookies
      const cookieHeader = event.request.headers.get('cookie');
      
      // Create new headers
      const headers = new Headers(request.headers);
      if (cookieHeader) {
        headers.set('cookie', cookieHeader);
      }
      
      const modifiedRequest = new Request(request, {
        headers,
        credentials: 'include'
      });
      
      return fetch(modifiedRequest);
    }
    
    return fetch(request);
  };