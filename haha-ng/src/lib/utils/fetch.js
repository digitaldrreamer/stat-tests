import { dev } from "$app/environment";
import { PUBLIC_API_URL_DEV, PUBLIC_API_URL_PROD } from "$env/static/public";

/**
 * Makes a fetch request with an Authorization header set to the value of the
 * sessionId cookie.
 * @param {string} url The URL to fetch.
 * @param {object} [options] Options for the fetch request.
 * @param {string} [options.method] The HTTP method to use.
 * @param {HeadersInit} [options.headers] Headers to include in the request.
 * @param {*} [options.body] The request body.
 * @param {RequestCache} [options.cache] The cache mode.
 * @param {RequestCredentials} [options.credentials] The credentials mode.
 * @param {RequestMode} [options.mode] The request mode.
 * @param {RequestRedirect} [options.redirect] The redirect mode.
 * @param {string} [options.referrer] The referrer.
 * @param {ReferrerPolicy} [options.referrerPolicy] The referrer policy.
 * @param {string} [options.integrity] The integrity.
 * @param {AbortSignal} [options.signal] The signal to abort the request with.
 * @param {boolean} [options.keepalive] The keepalive option.
 * @param {number} [options.timeout] Timeout in milliseconds.
 * @param {('json'|'text'|'blob'|'arrayBuffer'|'formData')} [options.responseType] Expected response type.
 * @return {Promise<any>} The processed response.
 */
export async function fetchWithAuth(url, options = {}) {
  try {
    const headers = new Headers(options.headers || {});
    
    // Get the sessionId cookie
    const cookies = document.cookie.split(';');
    const sessionIdCookie = cookies.find(c => c.trim().startsWith('sessionId='));
    const sessionId = sessionIdCookie ? sessionIdCookie.split('=')[1].trim() : null;
    
    if (sessionId) {
      headers.set('Authorization', `Bearer ${sessionId}`);
    }
    
    // If content-type isn't set and there's a body that's an object, set it to application/json
    if (!headers.has('content-type') && options.body && typeof options.body === 'object') {
      headers.set('content-type', 'application/json');
    }
    
    // Process the body if it's an object and not already a string/FormData/etc
    let processedBody = options.body;
    if (processedBody && typeof processedBody === 'object' && 
        !(processedBody instanceof FormData) && 
        !(processedBody instanceof URLSearchParams) && 
        !(processedBody instanceof Blob)) {
      processedBody = JSON.stringify(processedBody);
    }
    
    // Process URL - use environment variables for API base URLs
    let processedUrl = url;
    
    // If URL starts with a slash, prepend the appropriate API base URL
    if (url.startsWith('/')) {
      const apiBaseUrl = dev 
        ? (PUBLIC_API_URL_DEV || 'http://localhost:5173/api/v1') 
        : (PUBLIC_API_URL_PROD || 'https://api.haha.ng/api/v1');
      
      // Ensure the API base URL doesn't end with a slash to avoid double slashes
      const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
      processedUrl = `${baseUrl}${url}`;
    } else if (!url.match(/^https?:\/\//)) {
      // If URL doesn't start with http(s)://, assume it's a relative path
      processedUrl = new URL(url, window.location.origin).toString();
    }
    
    // Create AbortController for timeout
    const timeoutMs = options.timeout || 30000; // Default 30 seconds
    const controller = options.signal ? null : new AbortController();
    const signal = options.signal || controller?.signal;
    
    let timer;
    if (controller) {
      timer = setTimeout(() => {
        controller.abort();
      }, timeoutMs);
    }
    
    // For debugging
    if (dev) {
      console.log(`Fetching: ${processedUrl}`);
    }
    
    // Make the fetch request
    const response = await fetch(processedUrl, {
      method: options.method || 'GET',
      headers,
      body: processedBody,
      credentials: options.credentials || 'same-origin', // Changed default from 'include'
      mode: options.mode || 'cors',
      cache: options.cache || 'default',
      redirect: options.redirect || 'follow',
      referrer: options.referrer || 'client',
      referrerPolicy: options.referrerPolicy || 'no-referrer-when-downgrade',
      integrity: options.integrity,
      keepalive: options.keepalive,
      signal,
    });
    
    // Clear timeout if we got a response
    if (timer) {
      clearTimeout(timer);
    }
    
    // We're not automatically throwing on non-200 responses
    // This allows the caller to handle error status codes with error messages from the API

    // If original function behavior is expected (returning Response object), 
    // return the response directly when responseType is not specified
    if (!options.responseType) {
      return response;
    }
    
    // Process the response based on the responseType option
    const responseType = options.responseType || 'json';
    switch (responseType) {
      case 'json':
        return await response.json();
      case 'text':
        return await response.text();
      case 'blob':
        return await response.blob();
      case 'arrayBuffer':
        return await response.arrayBuffer();
      case 'formData':
        return await response.formData();
      default:
        return response;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${options.timeout || 30000}ms`);
    }
    throw error;
  }
}