<script>
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import * as Input from '$lib/components/ui/input';
    import * as Select from '$lib/components/ui/select';
    import * as Button from '$lib/components/ui/button';

    let {
        initialData = {
            fullName: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US'
        },
        onSubmit, onBack
    } = $props()

    let fullName = $state(initialData.fullName);
    let address = $state(initialData.address);
    let city = $state(initialData.city);
    let state = $state(initialData.state);
    let zipCode = $state(initialData.zipCode);
    let country = $state(initialData.country);
    let errors = $state({});

    const countries = [
        {value: 'US', label: 'United States'},
        {value: 'CA', label: 'Canada'},
        {value: 'UK', label: 'United Kingdom'},
        {value: 'AU', label: 'Australia'},
        {value: 'DE', label: 'Germany'},
        {value: 'FR', label: 'France'}
    ];

    function validate() {
        errors = {};

        if (!fullName) {
            errors.fullName = 'Full name is required';
        }

        if (!address) {
            errors.address = 'Address is required';
        }

        if (!city) {
            errors.city = 'City is required';
        }

        if (!state) {
            errors.state = 'State/Province is required';
        }

        if (!zipCode) {
            errors.zipCode = 'ZIP/Postal code is required';
        }

        if (!country) {
            errors.country = 'Country is required';
        }

        return Object.keys(errors).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            onSubmit({fullName, address, city, state, zipCode, country});
        }
    }
</script>

<Card.Root class="border-none sm:border shadow-none sm:shadow">
    <Card.Header class="px-0 sm:px-6">
        <Card.Title class="text-xl mx-4">Shipping Address</Card.Title>
        <Card.Description class="mx-4">
            Where should we send your order?
        </Card.Description>
    </Card.Header>

    <Card.Content class="px-0 sm:px-6">
        <form onsubmit={handleSubmit} class="space-y-5 mx-4">
            <div class="space-y-2">
                <label for="fullName" class="text-sm font-medium">
                    Full Name
                </label>
                <Input.Root
                        id="fullName"
                        type="text"
                        bind:value={fullName}
                        placeholder="John Doe"
                        class={errors.fullName ? 'border-destructive' : ''}
                />
                {#if errors.fullName}
                    <p class="text-xs text-destructive mt-1">{errors.fullName}</p>
                {/if}
            </div>

            <div class="space-y-2">
                <label for="address" class="text-sm font-medium">
                    Street Address
                </label>
                <Input.Root
                        id="address"
                        type="text"
                        bind:value={address}
                        placeholder="123 Main St, Apt 4B"
                        class={errors.address ? 'border-destructive' : ''}
                />
                {#if errors.address}
                    <p class="text-xs text-destructive mt-1">{errors.address}</p>
                {/if}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label for="city" class="text-sm font-medium">
                        City
                    </label>
                    <Input.Root
                            id="city"
                            type="text"
                            bind:value={city}
                            placeholder="New York"
                            class={errors.city ? 'border-destructive' : ''}
                    />
                    {#if errors.city}
                        <p class="text-xs text-destructive mt-1">{errors.city}</p>
                    {/if}
                </div>

                <div class="space-y-2">
                    <label for="state" class="text-sm font-medium">
                        State / Province
                    </label>
                    <Input.Root
                            id="state"
                            type="text"
                            bind:value={state}
                            placeholder="NY"
                            class={errors.state ? 'border-destructive' : ''}
                    />
                    {#if errors.state}
                        <p class="text-xs text-destructive mt-1">{errors.state}</p>
                    {/if}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label for="zipCode" class="text-sm font-medium">
                        ZIP / Postal Code
                    </label>
                    <Input.Root
                            id="zipCode"
                            type="text"
                            bind:value={zipCode}
                            placeholder="10001"
                            class={errors.zipCode ? 'border-destructive' : ''}
                    />
                    {#if errors.zipCode}
                        <p class="text-xs text-destructive mt-1">{errors.zipCode}</p>
                    {/if}
                </div>

                <div class="space-y-2">
                    <label for="country" class="text-sm font-medium">
                        Country
                    </label>
                    <Select.Root type="single" value={country} onValueChange={(value) => country = value}>
                        <Select.Trigger id="country" class={errors.country ? 'border-destructive' : ''}>
                            {country ? countries.find(c => c.value === country)?.label : "Select a country"}
                        </Select.Trigger>
                        <Select.Content>
                            {#each countries as countryOption}
                                <Select.Item value={countryOption.value}>
                                    {countryOption.label}
                                </Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Root>
                    {#if errors.country}
                        <p class="text-xs text-destructive mt-1">{errors.country}</p>
                    {/if}
                </div>
            </div>
        </form>
    </Card.Content>

    <Card.Footer class="px-0 sm:px-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button.Root variant="outline" onclick={onBack} class="mx-4 order-2 sm:order-1 w-full sm:w-auto">
            Back
        </Button.Root>

        <Button.Root onclick={handleSubmit} class="mx-4 order-1 sm:order-2 w-full sm:w-auto">
            Continue to Payment
        </Button.Root>
    </Card.Footer>
</Card.Root>