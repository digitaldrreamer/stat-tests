<script>
    import * as Card from '$lib/components/ui/card';
    import * as Button from '$lib/components/ui/button';
    import * as Input from '$lib/components/ui/input';
    import * as Label from '$lib/components/ui/label';
    import * as Alert from '$lib/components/ui/alert';
    import { loading } from '$lib/stores/loading.js';


    let {
        title = "Authentication",
        submitText = "Submit",
        isLoading = false,
        error = "",
        success = "",
        fields = [],
        onsubmit,
        footer
    } = $props();


    let formData = $state({});

    // Initialize form data with empty values for each field
    $effect(() => {
        formData = fields.reduce((acc, field) => {
            acc[field.name] = field.value || '';
            return acc;
        }, {});
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (onsubmit) onsubmit(formData);
        console.log(formData)
    }
</script>

<Card.Root class="w-full max-w-md mx-auto">
    <Card.Header>
        <Card.Title>{title}</Card.Title>
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

        <form onsubmit={handleSubmit} class="space-y-4">
            {#each fields as field}
                <div class="space-y-2">
                    <Label.Root for={field.name}>{field.label}</Label.Root>
                    {#if field.type === 'password'}
                        <Input.Root
                                type="password"
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder || ''}
                                required={field.required !== false}
                                bind:value={formData[field.name]}
                                disabled={$loading || isLoading}
                        />
                    {:else if field.type === 'email'}
                        <Input.Root
                                type="email"
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder || ''}
                                required={field.required !== false}
                                bind:value={formData[field.name]}
                                disabled={$loading || isLoading}
                        />
                    {:else}
                        <Input.Root
                                type={field.type || 'text'}
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder || ''}
                                required={field.required !== false}
                                bind:value={formData[field.name]}
                                disabled={$loading || isLoading}
                        />
                    {/if}
                    {#if field.helpText}
                        <p class="text-sm text-neutral-500">{field.helpText}</p>
                    {/if}
                </div>
            {/each}

            <Button.Root type="submit" class="w-full" disabled={isLoading || $loading}>
                {#if (isLoading || $loading)}
                    <span class="mr-2">
                        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </span>
                    Processing...
                {:else}
                    {submitText}
                {/if}
            </Button.Root>

            {@render footer?.()}
        </form>
    </Card.Content>
</Card.Root>