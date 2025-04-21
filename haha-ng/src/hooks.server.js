/*************  ✨ Windsurf Command 🌟  *************/
import { dev } from '$app/environment';
import { setSessionCookie } from '$lib/utils/cookies';

/**
 * @type {import('@sveltejs/kit').HandleFetch}
 * Fetches user profile from the server
 */
export const handleFetch = async ({ request, fetch, event }) => {
  console.log('handleFetch called with request:', request);
  const url = new URL(request.url);
  console.log('Parsed URL:', url);

  // Define trusted API hostnames
  const trustedHosts = dev ? ['localhost', 'new-supreme-penguin.ngrok-free.app'] : ['api.haha.ng'];
  console.log('Trusted hosts:', trustedHosts);

  // If request is to a trusted API domain
  if (trustedHosts.includes(url.hostname)) {
    console.log('Request is to a trusted host:', url.hostname);

    // Clone headers from original request
    const headers = new Headers(request.headers);
    console.log('Original headers:', headers);

    // Get the sessionToken cookie directly from event.cookies
    const sessionToken = event.cookies.get('sessionToken');
    console.log('Extracted sessionToken:', sessionToken);

    if (sessionToken) {
      console.log('sessionToken', true);
      // Set the sessionToken as a Bearer token in Authorization header
      headers.set('Authorization', `Bearer ${sessionToken}`);
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

    // Fetch with the modified request and check response
    const response = await fetch(modifiedRequest);
    console.log('Response received:', response);
    return response;
  }

  console.log('Request is to an untrusted host, proceeding normally.');
  return fetch(request);
};

/**
 * @type {import('@sveltejs/kit').Handle}
 */
export async function handle({ event, resolve }) {
  console.log('Handle called with event:', event);

  // Get the sessionToken cookie
  const sessionToken = event.cookies.get('sessionToken');
  console.log('Retrieved sessionToken:', sessionToken);

  // Initialize user data
  event.locals.user = null;

  if (sessionToken) {
    try {
      // Fetch user data
      const userData = await getUserProfile(sessionToken);
      event.locals.user = userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  return resolve(event);
}

/**
 * Retrieves user profile data
 * @returns {Promise<UserProfile>} The user's profile data
 */
async function getUserProfile(sessionToken) {
  const apiBaseUrl = dev ? 'http://localhost:5173/api/v1' : 'https://api.haha.ng/api/v1';
  const userApiUrl = `${apiBaseUrl}/users/me?settings=false`;
  console.log('User API URL:', userApiUrl);

  // Create headers with the Bearer token
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${sessionToken}`);
  console.log('Request headers:', headers);

  // Make the request to get user data
  const response = await fetch(userApiUrl, {
    headers,
    credentials: 'include'
  });
  // console.log('User data response:', response);

  // Check if the request was successful
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  // Parse the response as JSON
  const userData = await response.json();
  // console.log('Parsed user data:', userData);

  return userData;
}

export { getUserProfile };

