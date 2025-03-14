<script>
    import {PasswordResetForm} from "$lib/components/auth/index.js";
    import {page} from "$app/state";

    let error = $state('');
    let success = $state('')
    let isLoading = $state(false)
    let token = $state(page.url.searchParams.get('token'))

    const sendPasswordReset = async ({email}) => {

    }
    const changePassword = async ({new_password, confirm_new_password, token}) => {

    }

    const onreset = async (e) => {
        // reset password
    }

</script>

<svelte:head>
    <title>{token ? 'Reset Password' : 'Forgot Password'} | Haha.ng</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
    <div class="max-w-md mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">
            {token ? 'Reset Your Password' : 'Forgot Your Password?'}
        </h1>
        <PasswordResetForm {error} {success} {isLoading} {token} {onreset}/>
    </div>
</div>