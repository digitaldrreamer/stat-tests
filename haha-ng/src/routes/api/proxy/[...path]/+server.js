import { dev } from "$app/environment";
import { PUBLIC_API_URL_DEV, PUBLIC_API_URL_PROD } from "$env/static/public";
import { setSessionCookie } from "$lib/utils/cookies";
import { error, json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, cookies, params, url }) {
  return handleRequest(request, cookies, params, url, 'GET');
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, params, url }) {
  return handleRequest(request, cookies, params, url, 'POST');
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, cookies, params, url }) {
  return handleRequest(request, cookies, params, url, 'PUT');
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, cookies, params, url }) {
  return handleRequest(request, cookies, params, url, 'DELETE');
}

/** @type {import('./$types').RequestHandler} */
export async function OPTIONS({ request, cookies, params, url }) {
  return handleRequest(request, cookies, params, url, 'OPTIONS');
}

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ request, cookies, params, url }) {
  return handleRequest(request, cookies, params, url, 'PATCH');
}

/**
 * Handle all API proxy requests
 * @param {Request} request
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {object} params
 * @param {URL} url
 * @param {string} method
 */
async function handleRequest(request, cookies, params, url, method) {
  try {
    // Get the path from params
    const path = params.path || '';
    
    // Get the sessionToken from HTTP-only cookie (secure on server)
    const sessionToken = cookies.get('sessionToken');
    
    // Determine the base API URL - update to use your specific domains
    const apiBaseUrl = dev 
      ? (PUBLIC_API_URL_DEV || 'http://localhost:5173/api/v1') 
      : 'https://api.example.com/api/v1'; // Updated to use your domain
    
    // Build the target URL
    const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
    const targetUrl = `${baseUrl}/${path}`;
    
    // Get all search params from the original request
    const searchParams = new URLSearchParams();
    for (const [key, value] of url.searchParams) {
      searchParams.append(key, value);
    }
    
    // Append search params if they exist
    const finalUrl = searchParams.toString() 
      ? `${targetUrl}?${searchParams.toString()}` 
      : targetUrl;
    
    // Create headers for the proxy request
    const headers = new Headers();
    
    // Copy relevant headers from the original request
    for (const [key, value] of request.headers) {
      // Skip some headers that we'll set ourselves or that shouldn't be forwarded
      if (!['host', 'connection', 'cookie', 'content-length', 'authorization'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }
    
    // Add the auth token if available
    if (sessionToken) {
      headers.set('Authorization', `Bearer ${sessionToken}`);
    }
    
    // Prepare the request options
    const fetchOptions = {
      method,
      headers,
      redirect: 'follow',
    };
    
    // Add body for methods that support it
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      // Get content type to determine how to handle the body
      const contentType = request.headers.get('content-type');
      
      if (contentType) {
        if (contentType.includes('application/json')) {
          fetchOptions.body = JSON.stringify(await request.json());
        } else if (contentType.includes('multipart/form-data')) {
          fetchOptions.body = await request.formData();
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          fetchOptions.body = await request.formData();
        } else {
          fetchOptions.body = await request.text();
        }
      }
    }
    
    if (dev) {
      console.log(`Proxying ${method} request to: ${finalUrl}`);
    }
    
    // Make the request to the API
    const response = await fetch(finalUrl, fetchOptions);
    
    // Prepare to forward the response
    const responseHeaders = new Headers();
    
    // Copy relevant headers from the API response
    for (const [key, value] of response.headers) {
      // Don't copy set-cookie headers, let SvelteKit handle cookies
      if (key.toLowerCase() !== 'set-cookie') {
        responseHeaders.set(key, value);
      }
    }
    
    // Get the response body based on content type
    let responseBody;
    const responseType = response.headers.get('content-type');
    
    if (responseType && responseType.includes('application/json')) {
      responseBody = await response.json();
      if (responseBody?.data?.sessionToken) {
        setSessionCookie(cookies, responseBody?.data?.sessionToken, 60 * 60 * 24 * 30 * 2);
      }
      return json(responseBody, {
        status: response.status,
        headers: responseHeaders
      });
    } else {
      responseBody = await response.text();
      return new Response(responseBody, {
        status: response.status,
        headers: responseHeaders
      });
    }
  } catch (err) {
    console.error('Proxy error:', err);
    throw error(500, 'Error proxying request');
  }
}