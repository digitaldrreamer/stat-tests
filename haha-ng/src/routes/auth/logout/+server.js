import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { PUBLIC_API_URL_DEV, PUBLIC_API_URL_PROD } from "$env/static/public";
import { clearSessionCookie, getSessionToken } from '$lib/utils/cookies';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
  try {
    // Get the session ID from the cookie
    const sessionToken = getSessionToken(cookies);
    
    if (sessionToken) {
      // Determine the API URL based on environment
      const apiBaseUrl = dev 
        ? (PUBLIC_API_URL_DEV || 'http://localhost:5173/api/v1')
        : (PUBLIC_API_URL_PROD || 'https://api.haha.ng/api/v1');
      
      // Build the target URL
      const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
      const logoutUrl = `${baseUrl}/auth/logout`;
      
      // Notify the API about the logout (if your API requires this)
      try {
        await fetch(logoutUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (apiErr) {
        // If API logout fails, we still want to clear the cookie locally
        console.error('API logout error:', apiErr);
      }
    }
    
    // Always clear the cookie
    clearSessionCookie(cookies);
    
    return json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    
    // Still clear the cookie even if there's an error
    clearSessionCookie(cookies);
    
    return json({
      success: false,
      message: 'Logout failed due to server error, but session was cleared'
    }, { status: 500 });
  }
}