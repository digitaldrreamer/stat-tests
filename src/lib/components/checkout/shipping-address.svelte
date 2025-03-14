<script>
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import * as Input from '$lib/components/ui/input';
    import * as Button from '$lib/components/ui/button';
    import * as Select from '$lib/components/ui/select';

    let { fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        onSubmit,
        onBack
     } = $props()

    let fullName = $state(initialData.fullName);
    let address = $state(initialData.address);
    let city = $state(initialData.city);
    let state = $state(initialData.state);
    let zipCode = $state(initialData.zipCode);
    let country = $state(initialData.country || 'United States');
    let errors = $state({});

    const countries = [
        'United States',
        'Canada',
        'United Kingdom',
        'Australia',
        'Germany',
        'France',
        'Japan'
    ];

    const states = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
        'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
        'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
        'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
        'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
        'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
        'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    function validate() {
        errors = {};

        if (!fullName) errors.fullName = 'Full name is required';
        if (!address) errors.address = 'Address is required';
        if (!city) errors.city = 'City is required';
        if (!state && country === 'United States') errors.state = 'State is required';
        if (!zipCode) errors.zipCode = 'ZIP/Postal code is required';
        if (!country) errors.country = 'Country is required';

        return Object.keys(errors).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (validate()) {
            onSubmit({ fullName, address, city, state, zipCode, country });
        }
    }
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Shipping Address</Card.Title>
        <Card.Description>
            Where should we send your order?
        </Card.Description>
    </Card.Header>

    <Card.Content>
        <form onsubmit={handleSubmit} class="space-y-4">
            <div class="space-y-2">
                <label for="fullName" class="text-sm font-medium">Full Name</label>
                <Input.Root
                        id="fullName"
                        type="text"
                        bind:value={fullName}
                        placeholder="John Doe"
                        class={errors.fullName ? 'border-destructive' : ''}
                />
                {#if errors.fullName}
                    <p class="text-xs text-destructive">{errors.fullName}</p>
                {/if}
            </div>

            <div class="space-y-2">
                <label for="address" class="text-sm font-medium">Street Address</label>
                <Input.Root
                        id="address"
                        type="text"
                        bind:value={address}
                        placeholder="123 Main St, Apt 4B"
                        class={errors.address ? 'border-destructive' : ''}
                />
                {#if errors.address}
                    <p class="text-xs text-destructive">{errors.address}</p>
                {/if}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label for="city" class="text-sm font-medium">City</label>
                    <Input.Root
                            id="city"
                            type="text"
                            bind:value={city}
                            placeholder="New York"
                            class={errors.city ? 'border-destructive' : ''}
                    />
                    {#if errors.city}
                        <p class="text-xs text-destructive">{errors.city}</p>
                    {/if}
                </div>

                <div class="space-y-2">
                    <label for="country" class="text-sm font-medium">Country</label>
                    <select
                            id="country"
                            bind:value={country}
                            class="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                        {#each countries as countryOption}
                            <option value={countryOption}>{countryOption}</option>
                        {/each}
                    </select>
                    {#if errors.country}
                        <p class="text-xs text-destructive">{errors.country}</p>
                    {/if}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#if country === 'United States'}
                    <div class="space-y-2">
                        <label for="state" class="text-sm font-medium">State</label>
                        <select
                                id="state"
                                bind:value={state}
                                class="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                            <option value="">Select a state</option>
                            {#each states as stateOption}
                                <option value={stateOption}>{stateOption}</option>
                            {/each}
                        </select>
                        {#if errors.state}
                            <p class="text-xs text-destructive">{errors.state}</p>
                        {/if}
                    </div>
                {:else}
                    <div class="space-y-2">
                        <label for="state" class="text-sm font-medium">State/Province</label>
                        <Input.Root
                                id="state"
                                type="text"
                                bind:value={state}
                                placeholder="State or Province"
                                class={errors.state ? 'border-destructive' : ''}
                        />
                        {#if errors.state}
                            <p class="text-xs text-destructive">{errors.state}</p>
                        {/if}
                    </div>
                {/if}

                <div class="space-y-2">
                    <label for="zipCode" class="text-sm font-medium">ZIP/Postal Code</label>
                    <Input.Root
                            id="zipCode"
                            type="text"
                            bind:value={zipCode}
                            placeholder="10001"
                            class={errors.zipCode ? 'border-destructive' : ''}
                    />
                    {#if errors.zipCode}
                        <p class="text-xs text-destructive">{errors.zipCode}</p>
                    {/if}
                </div>
            </div>
        </form>
    </Card.Content>

    <Card.Footer class="flex justify-between">
        <Button.Root variant="outline" onclick={onBack}>
            Back
        </Button.Root>
        <Button.Root onclick={handleSubmit}>
            Continue to Payment
        </Button.Root>
    </Card.Footer>
</Card.Root>