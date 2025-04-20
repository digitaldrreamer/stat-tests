import { dev } from "$app/environment";

// src/hooks.client.js
export const handleFetch = async ({ request, fetch }) => {
    const url = new URL(request.url);
    
    // Check if the request is going to your API domain
    if ((dev ? ['localhost:5173', 'new-supreme-penguin.ngrok-free.app'] : ['api.haha.ng']).includes(url.hostname)) {
      // Create a new request with the same properties but add credentials
      const modifiedRequest = new Request(request, {
        credentials: 'include'
      });
      
      return fetch(modifiedRequest);
    }
    
    // For all other requests, proceed normally
    return fetch(request);
  };