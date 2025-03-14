<script>
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import * as Input from '$lib/components/ui/input';
    import * as Button from '$lib/components/ui/button';

    export let initialData = {
        email: '',
        phone: ''
    };
    export let onSubmit = () => {};

    let email = initialData.email;
    let phone = initialData.phone;
    let errors = {};

    function validate() {
        errors = {};

        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!phone) {
            errors.phone = 'Phone number is required';
        }

        return Object.keys(errors).length === 0;
    }

    function handleSubmit() {
        if (validate()) {
            onSubmit({ email, phone });
        }
    }
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Customer Information</Card.Title>
        <Card.Description>
            Please provide your contact information
        </Card.Description>
    </Card.Header>

    <Card.Content>
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div class="space-y-2">
                <label for="email" class="text-sm font-medium">
                    Email Address
                </label>
                <Input.Root
                        id="email"
                        type="email"
                        bind:value={email}
                        placeholder="your@email.com"
                        class={errors.email ? 'border-destructive' : ''}
                />
                {#if errors.email}
                    <p class="text-xs text-destructive">{errors.email}</p>
                {/if}
            </div>

            <div class="space-y-2">
                <label for="phone" class="text-sm font-medium">
                    Phone Number
                </label>
                <Input.Root
                        id="phone"
                        type="tel"
                        bind:value={phone}
                        placeholder="Your phone number"
                        class={errors.phone ? 'border-destructive' : ''}
                />
                {#if errors.phone}
                    <p class="text-xs text-destructive">{errors.phone}</p>
                {/if}
            </div>
        </form>
    </Card.Content>

    <Card.Footer class="flex justify-end">
        <Button.Root onclick={handleSubmit}>
            Continue to Shipping
        </Button.Root>
    </Card.Footer>
</Card.Root>