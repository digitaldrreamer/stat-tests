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
 * @return {Promise<Response>} The response.
 */
export async function fetchWithAuth(url, options = {}) {
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
    if (processedBody && typeof processedBody === 'object' && !(processedBody instanceof FormData) && 
        !(processedBody instanceof URLSearchParams) && !(processedBody instanceof Blob)) {
      processedBody = JSON.stringify(processedBody);
    }
    
    return fetch(url, {
      method: options.method || 'GET',
      headers,
      body: processedBody,
      credentials: options.credentials || 'include',
      mode: options.mode || 'cors',
      cache: options.cache || 'default',
      redirect: options.redirect || 'follow',
      referrer: options.referrer || 'client',
      referrerPolicy: options.referrerPolicy || 'no-referrer-when-downgrade',
      integrity: options.integrity,
      keepalive: options.keepalive,
      signal: options.signal
    });
  }
