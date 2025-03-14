<script>
    import AuthForm from './auth-form.svelte';

    let {
        error = "",
        isLoading = false,
        onregister
    } = $props();


    const registerFields = [
        {
            name: 'name',
            label: 'Full Name',
            type: 'text',
            placeholder: 'Enter your full name',
            required: true
        },
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
            placeholder: 'Create a password',
            required: true,
            helpText: 'Password must be at least 8 characters long'
        },
        {
            name: 'confirmPassword',
            label: 'Confirm Password',
            type: 'password',
            placeholder: 'Confirm your password',
            required: true
        }
    ];

    function handleRegister(event) {
        const formData = event.detail;

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            error = "Passwords do not match";
            return;
        }


        if (onregister) {
            onregister(formData);
        }
    }
</script>

<AuthForm
        title="Create an account"
        submitText="Sign Up"
        {error}
        {isLoading}
        fields={registerFields}
        onsubmit={handleRegister}
>
    <svelte:fragment slot="footer">
        <div class="mt-4 text-center text-sm">
            <p class="text-neutral-600 dark:text-neutral-400">
                Already have an account?
                <a href="/auth/login" class="text-primary hover:underline">Sign in</a>
            </p>
            <p class="mt-2 text-xs text-neutral-500">
                By signing up, you agree to our
                <a href="/legal/terms" class="text-primary hover:underline">Terms of Service</a> and
                <a href="/legal/privacy" class="text-primary hover:underline">Privacy Policy</a>.
            </p>
        </div>
    </svelte:fragment>
</AuthForm>