<script>
	import { validateEmail, validateName, validatePassword } from 'multiform-validator';
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

    function handleRegister(formData) {

        const isNameValid = validateName(formData.name)
        if (isNameValid.isValid === false) {
            error = isNameValid.errorMsg;
            return
        }

        const isEmailValid = validateEmail(formData.email)
        if (isEmailValid.isValid === false) {
            error = isEmailValid.errorMsg;
            return
        }
        
    // Validate password
    if (formData.password !== formData.confirmPassword) {
        error = "Passwords do not match";
        return;
    }

    const isPasswordValid = validatePassword(formData.password, {
        minLength: 8,
        maxLength: 20,
        options: {
            requireNumber: true,
            requireUppercase: true,
            requireSpecialChar: true,
            requireString: true
        }
    });

    if (isPasswordValid.isValid === false) {
        error = isPasswordValid.errorMsg;
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
{#snippet footer()}
<div>
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
    </div>
    {/snippet}
</AuthForm>