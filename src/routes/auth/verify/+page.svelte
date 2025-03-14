<script>
    import {VerificationForm} from "$lib/components/auth/index.js";
    import {page} from '$app/state'

    let email = page.url.searchParams.get('email') ?? ''
    let success = $state('')
    let error = $state('')
    let isLoading = $state(false)
    let code = $state(page.url.searchParams.get('code') ?? '')

    const verifyCode = async (e) => {
    }
    const resendVerificationCode = async (e) => {
    }
</script>
<svelte:head>
    <title>Verify Email | FashionHub</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
    <div class="max-w-md mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">Verify Your Email</h1>
        <VerificationForm {email} {code} onverify={verifyCode} onresend={resendVerificationCode}/>
    </div>
</div>