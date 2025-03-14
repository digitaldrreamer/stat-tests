<script>
    import AuthForm from './auth-form.svelte';

    let {
        error = "",
        isLoading = false,
        redirectTo = "/",
        onlogin
    } = $props();


    const loginFields = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'Enter your email',
            required: true
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
            placeholder: 'Enter your password',
            required: true
        }
    ];

    function handleLogin(event) {
        event.preventDefault()
        const formData = event.detail;

        if (onlogin) {
            onlogin(formData);
        }
    }
</script>

<AuthForm
        title="Login to your account"
        submitText="Sign In"
        {error}
        {isLoading}
        fields={loginFields}
        onsubmit={handleLogin}
>
    <svelte:fragment slot="footer">
        <div class="mt-4 text-center text-sm">
            <p class="text-neutral-600 dark:text-neutral-400">
                Don't have an account?
                <a href="/auth/register" class="text-primary hover:underline">Sign up</a>
            </p>
            <p class="mt-2">
                <a href="/auth/reset-password" class="text-primary hover:underline text-sm">
                    Forgot your password?
                </a>
            </p>
        </div>
    </svelte:fragment>
</AuthForm>