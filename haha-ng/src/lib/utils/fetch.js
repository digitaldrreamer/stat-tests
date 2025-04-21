import { dev } from "$app/environment";

/**
 * Makes a fetch request through the server-side proxy endpoint, which will
 * automatically add authentication from HTTP-only cookies.
 * @param {string} url The URL to fetch (relative to API base or absolute).
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
 * @param {AbortSignal} [options.signal] The signal to abort the request with.
 * @param {boolean} [options.keepalive] The keepalive option.
 * @param {number} [options.timeout] Timeout in milliseconds.
 * @param {('json'|'text'|'blob'|'arrayBuffer'|'formData')} [options.responseType] Expected response type.
 * @return {Promise<any>} The processed response.
 */
export async function fetchWithProxy(url, options = {}) {
  try {
    const headers = new Headers(options.headers || {});
    
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
    
    // Process URL to convert it to proxy format
    let processedUrl;
    
    // If the URL is already absolute, just use it directly with our API server
    if (url.match(/^https?:\/\//)) {
      throw new Error("Direct absolute URLs are not supported. Use relative URLs to your API instead.");
    } 
    // If URL starts with a slash, it's a direct API path
    else if (url.startsWith('/')) {
      // Remove the leading slash for our proxy path format
      const apiPath = url.startsWith('/') ? url.substring(1) : url;
      processedUrl = `/api/proxy/${apiPath}`;
    } 
    // Otherwise it's a relative path
    else {
      processedUrl = `/api/proxy/${url}`;
    }
    
    // Create AbortController for timeout
    const timeoutMs = options.timeout || 60000; // Default 30 seconds
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
      console.log(`Fetching via proxy: ${processedUrl}`);
    }
    
    // Make the fetch request to our proxy endpoint
    const response = await fetch(processedUrl, {
      method: options.method || 'GET',
      headers,
      body: processedBody,
      credentials: 'same-origin', // Always use same-origin for our proxy
      mode: 'same-origin', // Always use same-origin for our proxy
      cache: options.cache || 'default',
      redirect: options.redirect || 'follow',
      referrer: options.referrer || 'client',
      referrerPolicy: options.referrerPolicy || 'no-referrer-when-downgrade',
      keepalive: options.keepalive,
      signal,
    });
    
    // Clear timeout if we got a response
    if (timer) {
      clearTimeout(timer);
    }
    
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
    console.log('error', error)
    console.log('error.message', error?.message)
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${options.timeout || 30000}ms`);
    }
    throw error;
  }
}