<script>
	import { goto } from "$app/navigation";
    import {LoginForm} from "$lib/components/auth/index.js";
	import { fetchWithProxy } from "$lib/utils/fetch";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { number } from "zod";
    import { page } from '$app/state'
    import {
    loading
} from '$lib/stores/loading.js';

    let redirectTo = $state('/')
    onMount(() => {
        redirectTo = page.url.searchParams.get('redirect') || page.url.searchParams.get('redirectTo') || '/'
    })

    const logUserIn = async (e) => {
        $loading = true;
        isLoading = true
        const req = await fetchWithProxy('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: e.email,
                password: e.password
            })
        })
/**
 * @typedef {Object} LoginResponse
 * @property {boolean} status - Indicates if the login was successful
 * @property {number} code - HTTP status code
 * @property {string | null} message - Response message
 * @property {Object} data - User login data
 * @property {string} data.sessionToken - User session token
 * @property {string} data.userId - User's unique identifier
 * @property {string} data.role - User's role
 * @property {string[]} data.permissions - List of user permissions
 */

/** @type {LoginResponse} */
        const res = await req.json()
        $loading = false
        isLoading = false
        if (!res.status || !req.ok) {
            toast.error(res?.message, {
                duration: number.POSITIVE_INFINITY
            })
            error = res.message
            return;
        }

        toast.success(res.message, {
            duration: number.POSITIVE_INFINITY
        })
        setTimeout(() => {
            goto(redirectTo)
        }, 3000);
    }

    let error = $state('')
    let isLoading = $state(false)
</script>
<div class="container mx-auto px-4 py-12">
    <div class="max-w-md mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">Welcome Back</h1>
        <LoginForm onlogin={logUserIn} {error} {redirectTo} {isLoading}/>
    </div>
</div>