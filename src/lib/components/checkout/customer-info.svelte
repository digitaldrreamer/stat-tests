<script>
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import * as Input from '$lib/components/ui/input';
    import * as Button from '$lib/components/ui/button';


    let { initialData = {
        email: '',
        phone: ''
    }, onSubmit } = $props()

    let email = $state(initialData.email);
    let phone = $state(initialData.phone);
    let errors = $state({});

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

    function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            onSubmit({email, phone});
        }
    }
</script>

<Card.Root class="border-none sm:border shadow-none sm:shadow">
    <Card.Header class="px-0 sm:px-6">
        <Card.Title class="text-xl mx-4">Customer Information</Card.Title>
        <Card.Description class="mx-4">
            Please provide your contact information
        </Card.Description>
    </Card.Header>

    <Card.Content class="px-0 sm:px-6">
        <form onsubmit={handleSubmit} class="space-y-5 mx-4">
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
                    <p class="text-xs text-destructive mt-1">{errors.email}</p>
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
                    <p class="text-xs text-destructive mt-1">{errors.phone}</p>
                {/if}
            </div>
        </form>
    </Card.Content>

    <Card.Footer class="px-0 sm:px-6 flex justify-end">
        <Button.Root onclick={handleSubmit} class="mx-4 w-full sm:w-auto">
            Continue to Shipping
        </Button.Root>
    </Card.Footer>
</Card.Root>