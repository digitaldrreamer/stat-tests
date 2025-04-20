<script>
import {
    VerificationForm
} from "$lib/components/auth/index.js";
import {
    page
} from '$app/state'
import {
    loading
} from '$lib/stores/loading.js';
import {
    fetchWithAuth
} from "$lib/utils/fetch";
import {
    goto
} from "$app/navigation";
	import { toast } from "svelte-sonner";

let email = page.url.searchParams.get('email') ?? ''
let isLoading = $state(false)
let code = $state(page.url.searchParams.get('token') ?? '')

const verifyCode = async ({code}) => {
    try {
        $loading = true;

        const response = await fetchWithAuth(`/auth/verify-email/${code}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const data = await response.json();

        if (!data.status || !response.ok) {
            toast.error(data.message, {
                duration: 7000
            })
        } else {
            toast.success(data.message, {
                duration: 10000
            })
            setTimeout(() => {
                goto('/');
            }, 5000);
        }
    } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Verification failed');
    } finally {
        $loading = false;
    }
};

const resendVerificationCode = async () => {
    try {
        $loading = true;

        const response = await fetchWithAuth('/auth/verify-email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        });

        const data = await response.json();

        if (!data.status) {
            error = data.message;
        } else {
            success = 'Verification code resent successfully';
        }
    } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to resend verification code';
    } finally {
        $loading = false;
    }
};
</script>
<svelte:head>
    <title>Verify Email | Haha.ng</title>
    </svelte:head>

    <div class="container mx-auto px-4 py-12">
        <div class="max-w-md mx-auto">
            <h1 class="text-3xl font-bold text-center mb-8">Verify Your Email</h1>
            <VerificationForm {email} {code} onverify={verifyCode} onresend={resendVerificationCode}/>
                </div>
                </div>
