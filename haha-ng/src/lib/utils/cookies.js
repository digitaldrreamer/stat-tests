import { dev } from '$app/environment';

/**
 * Sets an HTTP-only, secure session cookie during authentication
 * This should be used in a server-side endpoint after successful login
 * 
 * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit cookies object
 * @param {string} sessionToken - The session ID to store
 * @param {number} [maxAge=2*30*24*60*60] - Cookie max age in seconds (default: 60 days)
 */
export function setSessionCookie(cookies, sessionToken, maxAge = 7 * 24 * 60 * 60) {
    cookies.set('sessionToken', sessionToken, {
      httpOnly: true,        // Cannot be accessed by JavaScript
      secure: dev, // Use secure in production
      sameSite: 'strict',       // Allow cross-subdomain use while still providing CSRF protection
      path: '/',             // Available on all paths
      domain: dev ? 'localhost' : 'haha.ng', // Set for all subdomains of example.com
      maxAge,                // How long until the cookie expires (in seconds)
    });
  }
  
  /**
   * Clears the session cookie on logout
   * 
   * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit cookies object
   */
  export function clearSessionCookie(cookies) {
    cookies.delete('sessionToken', { 
      path: '/',
      domain: dev ? 'localhost' : 'haha.ng' // Make sure to clear with the same domain
    });
  }
  
  /**
   * Gets the session ID from the cookie
   * Can only be used server-side
   * 
   * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit cookies object
   * @returns {string|null} The session ID or null if not found
   */
  export function getSessionToken(cookies) {
    return cookies.get('sessionToken') || null;
  }