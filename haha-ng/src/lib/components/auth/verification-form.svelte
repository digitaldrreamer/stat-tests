<script>

    let {
        email = "",
        error = "",
        success = "",
        isLoading = false,
        code = null,
        onverify,
        onresend
    } = $props();


    let verificationCode = $state(code);

    function handleVerify(e) {
        e.preventDefault();
        if (onverify) onverify({code: verificationCode});
    }

    function handleResend() {
        if (onresend) onresend({email});
    }
</script>

<Card.Root class="w-full max-w-md mx-auto">
    <Card.Header>
        <Card.Title>Verify Your Email</Card.Title>
        <Card.Description>
            We've sent a verification code to {email || 'your email'}.
            Please enter the code below to verify your account.
        </Card.Description>
    </Card.Header>
    <Card.Content>
        {#if error}
            <Alert.Root variant="destructive" class="mb-4">
                <Alert.Title>Error</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
            </Alert.Root>
        {/if}

        {#if success}
            <Alert.Root variant="default" class="mb-4 bg-green-50 text-green-800 border-green-200">
                <Alert.Title>Success</Alert.Title>
                <Alert.Description>{success}</Alert.Description>
            </Alert.Root>
        {/if}

        <form onsubmit={handleVerify} class="space-y-4">
            <div class="space-y-2">
                <div class="flex justify-center">
                    <Input.Root
                            type="text"
                            placeholder="Enter verification code"
                            class="text-center text-lg tracking-widest max-w-full"
                            bind:value={verificationCode}
                            required
                    />
                </div>
            </div>

            <Button.Root type="submit" class="w-full" disabled={isLoading}>
                {#if isLoading}
                    <span class="mr-2">
                        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </span>
                    Verifying...
                {:else}
                    Verify Email
                {/if}
            </Button.Root>

            <div class="text-center mt-4">
                <p class="text-sm text-neutral-600 dark:text-neutral-400">
                    Didn't receive a code?
                </p>
                <Button.Root
                        variant="link"
                        onclick={handleResend}
                        disabled={isLoading}
                        class="mt-1 text-primary"
                >
                    Resend verification code
                </Button.Root>
            </div>
        </form>
    </Card.Content>
</Card.Root>