<script>
    import AuthForm from './auth-form.svelte';

    let {
        error = "",
        success = "",
        isLoading = false,
        token = null,
        onreset
    } = $props();


    // Fields for requesting password reset
    const requestResetFields = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'Enter your email',
            required: true
        }
    ];

    // Fields for setting new password (when token is provided)
    const resetPasswordFields = [
        {
            name: 'password',
            label: 'New Password',
            type: 'password',
            placeholder: 'Enter new password',
            required: true,
            helpText: 'Password must be at least 8 characters long'
        },
        {
            name: 'confirmPassword',
            label: 'Confirm New Password',
            type: 'password',
            placeholder: 'Confirm new password',
            required: true
        }
    ];

    function handleReset(event) {
        const formData = event.detail;

        // If resetting password, check if passwords match
        if (token && formData.password !== formData.confirmPassword) {
            error = "Passwords do not match";
            return;
        }

        // Add token to form data if available
        if (token) {
            formData.token = token;
        }


        if (onreset) {
            onreset(formData);
        }
    }
</script>

<AuthForm
        title={token ? "Reset Your Password" : "Forgot Password"}
        submitText={token ? "Reset Password" : "Send Reset Link"}
        {error}
        {success}
        {isLoading}
        fields={token ? resetPasswordFields : requestResetFields}
        onsubmit={handleReset}
>
    <svelte:fragment slot="footer">
        <div class="mt-4 text-center text-sm">
            <p class="text-neutral-600 dark:text-neutral-400">
                Remember your password?
                <a href="/auth/login" class="text-primary hover:underline">Sign in</a>
            </p>
        </div>
    </svelte:fragment>
</AuthForm>