<script>
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import * as Input from '$lib/components/ui/input';
    import * as Select from '$lib/components/ui/select';
    import * as Button from '$lib/components/ui/button';
    import * as RadioGroup from '$lib/components/ui/radio-group';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as Sheet from '$lib/components/ui/sheet';
    import * as Badge from '$lib/components/ui/badge';
    import { Check, MapPin, Home, Store, ChevronRight, Plus, X } from 'lucide-svelte';
    import {onMount} from "svelte";

    let { initialData = {
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
        deliveryMethod: 'pickup-station',
        pickupStationId: ''
    },
        onSubmit, onBack } = $props()

    let fullName = $state(initialData.fullName);
    let address = $state(initialData.address);
    let city = $state(initialData.city);
    let state = $state(initialData.state);
    let zipCode = $state(initialData.zipCode);
    let country = $state(initialData.country);
    let deliveryMethod = $state(initialData.deliveryMethod || 'pickup-station');
    let pickupStationId = $state(initialData.pickupStationId || '');
    let errors = $state({});

    // Dialog/Sheet state
    let isPickupDialogOpen = $state(false);
    let isSavedAddressesOpen = $state(false);
    let isMobile = $state(window.innerWidth < 768);

    // Sample saved addresses
    const savedAddresses = [
        {
            id: 'addr1',
            name: 'Home',
            fullName: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'US',
            isDefault: true
        },
        {
            id: 'addr2',
            name: 'Work',
            fullName: 'John Doe',
            address: '456 Office Blvd',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            country: 'US',
            isDefault: false
        }
    ];

    // Sample pickup stations
    const pickupStations = [
        {
            id: 'ps1',
            name: 'Downtown Fashion Store',
            address: '789 Fashion Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10003',
            distance: '0.8 miles',
            hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM'
        },
        {
            id: 'ps2',
            name: 'Midtown Collection Point',
            address: '456 Fifth Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10018',
            distance: '1.2 miles',
            hours: 'Mon-Fri: 8AM-9PM, Sat-Sun: 10AM-7PM'
        },
        {
            id: 'ps3',
            name: 'Uptown Pickup Hub',
            address: '123 Upper East Side',
            city: 'New York',
            state: 'NY',
            zipCode: '10028',
            distance: '2.5 miles',
            hours: 'Mon-Sun: 9AM-9PM'
        },
        {
            id: 'ps4',
            name: 'Brooklyn Fashion Outlet',
            address: '987 Williamsburg St',
            city: 'Brooklyn',
            state: 'NY',
            zipCode: '11211',
            distance: '3.7 miles',
            hours: 'Mon-Sun: 10AM-8PM'
        }
    ];

    const countries = [
        { value: 'US', label: 'United States' },
        { value: 'CA', label: 'Canada' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'AU', label: 'Australia' },
        { value: 'DE', label: 'Germany' },
        { value: 'FR', label: 'France' }
    ];

    function getSelectedPickupStation() {
        return pickupStations.find(station => station.id === pickupStationId);
    }

    function selectSavedAddress(address) {
        fullName = address.fullName;
        address = address.address;
        city = address.city;
        state = address.state;
        zipCode = address.zipCode;
        country = address.country;
        isSavedAddressesOpen = false;
    }

    function selectPickupStation(station) {
        pickupStationId = station.id;
        isPickupDialogOpen = false;
    }

    function findNearestPickupStation() {
        // In a real app, this would use geolocation or address to find the nearest station
        // For demo purposes, we'll just select the first one
        pickupStationId = pickupStations[0].id;
        isPickupDialogOpen = false;
    }

    function validate() {
        errors = {};

        if (!fullName) {
            errors.fullName = 'Full name is required';
        }

        if (deliveryMethod === 'pickup-station' && !pickupStationId) {
            errors.pickupStationId = 'Please select a pickup station';
        }

        return Object.keys(errors).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            onSubmit({
                fullName,
                address,
                city,
                state,
                zipCode,
                country,
                deliveryMethod,
                pickupStationId
            });
        }
    }

    // Window resize listener for mobile detection
    function handleResize() {
        isMobile = window.innerWidth < 768;
    }

    onMount(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
</script>

<Card.Root class="border-none sm:border shadow-none sm:shadow">
    <Card.Header class="px-4 sm:px-6">
        <Card.Title class="text-xl">Shipping Information</Card.Title>
        <Card.Description>
            Choose where to pick up your order
        </Card.Description>
    </Card.Header>

    <Card.Content class="px-4 sm:px-6">
        <form onsubmit={handleSubmit} class="space-y-4">
            <!-- Saved Addresses -->
            <div class="space-y-2">
                <div class="flex justify-between items-center">
                    <label class="text-sm font-medium">Your Addresses</label>
                    <Button.Root
                            variant="ghost"
                            size="sm"
                            onclick={() => isSavedAddressesOpen = true}
                            class="text-xs h-8"
                    >
                        Select Saved Address
                        <ChevronRight class="h-4 w-4 ml-1" />
                    </Button.Root>
                </div>
            </div>

            <!-- Delivery Method Selection -->
            <div class="space-y-3">
                <label class="text-sm font-medium">Delivery Method</label>

                <RadioGroup.Root value={deliveryMethod} onValueChange={(value) => deliveryMethod = value}>
                    <div class="grid grid-cols-1 gap-3">
                        <!-- Pickup Station Option -->
                        <div class="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary
                                    {deliveryMethod === 'pickup-station' ? 'border-primary bg-primary/5' : ''}">
                            <RadioGroup.Item value="pickup-station" id="pickup-station" class="sr-only" />
                            <label for="pickup-station" class="flex items-start gap-3 cursor-pointer">
                                <Store class="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <div class="flex-grow">
                                    <div class="flex items-center justify-between">
                                        <span class="font-medium">Pickup Station</span>
                                        <Badge.Root variant="outline" class="bg-green-100 text-green-800 border-green-200 text-[10px] py-0 h-4">
                                            Free
                                        </Badge.Root>
                                    </div>
                                    <p class="text-xs text-muted-foreground mt-1">
                                        Collect your order from one of our pickup stations
                                    </p>
                                </div>
                            </label>
                        </div>

                        <!-- Home Delivery Option (Disabled) -->
                        <div class="border rounded-lg p-4 cursor-not-allowed bg-muted/30 opacity-70">
                            <RadioGroup.Item value="home-delivery" id="home-delivery" class="sr-only" disabled />
                            <label for="home-delivery" class="flex items-start gap-3">
                                <Home class="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <div class="flex-grow">
                                    <div class="flex items-center justify-between">
                                        <span class="font-medium">Home Delivery</span>
                                        <Badge.Root variant="outline" class="bg-amber-100 text-amber-800 border-amber-200 text-[10px] py-0 h-4">
                                            Currently Unavailable
                                        </Badge.Root>
                                    </div>
                                    <p class="text-xs text-muted-foreground mt-1">
                                        Delivered to your doorstep (service temporarily unavailable)
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                </RadioGroup.Root>
            </div>

            {#if deliveryMethod === 'pickup-station'}
                <!-- Pickup Station Selection -->
                <div class="space-y-2">
                    <label class="text-sm font-medium">Pickup Station</label>

                    {#if pickupStationId}
                        {@const station = getSelectedPickupStation()}
                        <div class="border rounded-lg p-4 relative">
                            <div class="flex justify-between">
                                <div class="flex items-start gap-3">
                                    <MapPin class="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 class="font-medium">{station.name}</h4>
                                        <p class="text-sm text-muted-foreground">{station.address}</p>
                                        <p class="text-sm text-muted-foreground">
                                            {station.city}, {station.state} {station.zipCode}
                                        </p>
                                        <div class="flex flex-wrap items-center gap-2 mt-1">
                                            <Badge.Root variant="outline" class="text-[10px] py-0 h-4">
                                                {station.distance}
                                            </Badge.Root>
                                            <span class="text-xs text-muted-foreground">{station.hours}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button.Root
                                        variant="ghost"
                                        size="icon"
                                        class="h-8 w-8 absolute top-2 right-2"
                                        onclick={() => isPickupDialogOpen = true}
                                >
                                    <ChevronRight class="h-4 w-4" />
                                </Button.Root>
                            </div>
                        </div>
                    {:else}
                        <Button.Root
                                variant="outline"
                                class="w-full justify-start h-auto py-3 px-4"
                                onclick={() => isPickupDialogOpen = true}
                        >
                            <Plus class="h-4 w-4 mr-2" />
                            Select a pickup station
                        </Button.Root>
                        {#if errors.pickupStationId}
                            <p class="text-xs text-destructive mt-1">{errors.pickupStationId}</p>
                        {/if}
                    {/if}
                </div>
            {/if}

            <!-- Contact Information -->
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

            <!-- Optional Address Fields (for reference) -->
            <div class="space-y-2">
                <label for="address" class="text-sm font-medium flex items-center">
                    <span>Address</span>
                    <span class="text-xs text-muted-foreground ml-2">(Optional for reference)</span>
                </label>
                <Input.Root
                        id="address"
                        type="text"
                        bind:value={address}
                        placeholder="123 Main St, Apt 4B"
                />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label for="city" class="text-sm font-medium flex items-center">
                        <span>City</span>
                        <span class="text-xs text-muted-foreground ml-2">(Optional)</span>
                    </label>
                    <Input.Root
                            id="city"
                            type="text"
                            bind:value={city}
                            placeholder="New York"
                    />
                </div>

                <div class="space-y-2">
                    <label for="state" class="text-sm font-medium flex items-center">
                        <span>State / Province</span>
                        <span class="text-xs text-muted-foreground ml-2">(Optional)</span>
                    </label>
                    <Input.Root
                            id="state"
                            type="text"
                            bind:value={state}
                            placeholder="NY"
                    />
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label for="zipCode" class="text-sm font-medium flex items-center">
                        <span>ZIP / Postal Code</span>
                        <span class="text-xs text-muted-foreground ml-2">(Optional)</span>
                    </label>
                    <Input.Root
                            id="zipCode"
                            type="text"
                            bind:value={zipCode}
                            placeholder="10001"
                    />
                </div>

                <div class="space-y-2">
                    <label for="country" class="text-sm font-medium flex items-center">
                        <span>Country</span>
                        <span class="text-xs text-muted-foreground ml-2">(Optional)</span>
                    </label>
                    <Select.Root type="single" value={country} onValueChange={(value) => country = value}>
                        <Select.Trigger id="country" class="w-full">
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
                </div>
            </div>
        </form>
    </Card.Content>

    <Card.Footer class="px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button.Root variant="outline" onclick={onBack} class="order-2 sm:order-1 w-full sm:w-auto">
            Back
        </Button.Root>

        <Button.Root onclick={handleSubmit} class="order-1 sm:order-2 w-full sm:w-auto">
            Continue to Payment
        </Button.Root>
    </Card.Footer>
</Card.Root>

<!-- Pickup Station Selection Dialog/Sheet -->
{#if isMobile}
    <Sheet.Root open={isPickupDialogOpen} onOpenChange={(open) => isPickupDialogOpen = open}>
        <Sheet.Content side="bottom" class="h-[80vh]">
            <Sheet.Header>
                <Sheet.Title>Select Pickup Station</Sheet.Title>
                <Sheet.Description>Choose where to collect your order</Sheet.Description>
            </Sheet.Header>

            <div class="py-4">
                <Button.Root
                        variant="outline"
                        class="w-full mb-4"
                        onclick={findNearestPickupStation}
                >
                    Find Nearest to My Address
                </Button.Root>

                <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {#each pickupStations as station}
                        <div
                                class="border rounded-lg p-3 cursor-pointer hover:border-primary transition-all
                                  {station.id === pickupStationId ? 'border-primary bg-primary/5' : ''}"
                                onclick={() => selectPickupStation(station)}
                        >
                            <div class="flex items-start gap-3">
                                <MapPin class="h-5 w-5 flex-shrink-0 mt-0.5 {station.id === pickupStationId ? 'text-primary' : ''}" />
                                <div class="flex-grow">
                                    <h4 class="font-medium">{station.name}</h4>
                                    <p class="text-sm text-muted-foreground">{station.address}</p>
                                    <p class="text-sm text-muted-foreground">
                                        {station.city}, {station.state} {station.zipCode}
                                    </p>
                                    <div class="flex items-center gap-2 mt-1">
                                        <Badge.Root variant="outline" class="text-[10px] py-0 h-4">
                                            {station.distance}
                                        </Badge.Root>
                                        <span class="text-xs text-muted-foreground">{station.hours}</span>
                                    </div>
                                </div>
                                {#if station.id === pickupStationId}
                                    <Check class="h-5 w-5 text-primary flex-shrink-0" />
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <Sheet.Footer>
                <Button.Root onclick={() => isPickupDialogOpen = false}>
                    Confirm Selection
                </Button.Root>
            </Sheet.Footer>
        </Sheet.Content>
    </Sheet.Root>
{:else}
    <Dialog.Root open={isPickupDialogOpen} onOpenChange={(open) => isPickupDialogOpen = open}>
        <Dialog.Content class="sm:max-w-[500px]">
            <Dialog.Header>
                <Dialog.Title>Select Pickup Station</Dialog.Title>
                <Dialog.Description>Choose where to collect your order</Dialog.Description>
            </Dialog.Header>

            <div class="py-4">
                <Button.Root
                        variant="outline"
                        class="w-full mb-4"
                        onclick={findNearestPickupStation}
                >
                    Find Nearest to My Address
                </Button.Root>

                <div class="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {#each pickupStations as station}
                        <div
                                class="border rounded-lg p-3 cursor-pointer hover:border-primary transition-all
                                  {station.id === pickupStationId ? 'border-primary bg-primary/5' : ''}"
                                onclick={() => selectPickupStation(station)}
                        >
                            <div class="flex items-start gap-3">
                                <MapPin class="h-5 w-5 flex-shrink-0 mt-0.5 {station.id === pickupStationId ? 'text-primary' : ''}" />
                                <div class="flex-grow">
                                    <h4 class="font-medium">{station.name}</h4>
                                    <p class="text-sm text-muted-foreground">{station.address}</p>
                                    <p class="text-sm text-muted-foreground">
                                        {station.city}, {station.state} {station.zipCode}
                                    </p>
                                    <div class="flex items-center gap-2 mt-1">
                                        <Badge.Root variant="outline" class="text-[10px] py-0 h-4">
                                            {station.distance}
                                        </Badge.Root>
                                        <span class="text-xs text-muted-foreground">{station.hours}</span>
                                    </div>
                                </div>
                                {#if station.id === pickupStationId}
                                    <Check class="h-5 w-5 text-primary flex-shrink-0" />
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <Dialog.Footer>
                <Button.Root onclick={() => isPickupDialogOpen = false}>
                    Confirm Selection
                </Button.Root>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
{/if}

<!-- Saved Addresses Dialog/Sheet -->
{#if isMobile}
    <Sheet.Root open={isSavedAddressesOpen} onOpenChange={(open) => isSavedAddressesOpen = open}>
        <Sheet.Content side="bottom" class="h-[60vh]">
            <Sheet.Header>
                <Sheet.Title>Saved Addresses</Sheet.Title>
                <Sheet.Description>Select from your saved addresses</Sheet.Description>
            </Sheet.Header>

            <div class="py-4 space-y-3">
                {#each savedAddresses as address}
                    <div
                            class="border rounded-lg p-3 cursor-pointer hover:border-primary transition-all"
                            onclick={() => selectSavedAddress(address)}
                    >
                        <div class="flex items-start gap-3">
                            <Home class="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div class="flex-grow">
                                <div class="flex items-center">
                                    <h4 class="font-medium">{address.name}</h4>
                                    {#if address.isDefault}
                                        <Badge.Root variant="outline" class="ml-2 text-[10px] py-0 h-4">
                                            Default
                                        </Badge.Root>
                                    {/if}
                                </div>
                                <p class="text-sm">{address.fullName}</p>
                                <p class="text-sm text-muted-foreground">{address.address}</p>
                                <p class="text-sm text-muted-foreground">
                                    {address.city}, {address.state} {address.zipCode}
                                </p>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <Sheet.Footer>
                <Button.Root variant="outline" onclick={() => isSavedAddressesOpen = false}>
                    Cancel
                </Button.Root>
            </Sheet.Footer>
        </Sheet.Content>
    </Sheet.Root>
{:else}
    <Dialog.Root open={isSavedAddressesOpen} onOpenChange={(open) => isSavedAddressesOpen = open}>
        <Dialog.Content class="sm:max-w-[500px]">
            <Dialog.Header>
                <Dialog.Title>Saved Addresses</Dialog.Title>
                <Dialog.Description>Select from your saved addresses</Dialog.Description>
            </Dialog.Header>

            <div class="py-4 space-y-3">
                {#each savedAddresses as address}
                    <div
                            class="border rounded-lg p-3 cursor-pointer hover:border-primary transition-all"
                            onclick={() => selectSavedAddress(address)}
                    >
                        <div class="flex items-start gap-3">
                            <Home class="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div class="flex-grow">
                                <div class="flex items-center">
                                    <h4 class="font-medium">{address.name}</h4>
                                    {#if address.isDefault}
                                        <Badge.Root variant="outline" class="ml-2 text-[10px] py-0 h-4">
                                            Default
                                        </Badge.Root>
                                    {/if}
                                </div>
                                <p class="text-sm">{address.fullName}</p>
                                <p class="text-sm text-muted-foreground">{address.address}</p>
                                <p class="text-sm text-muted-foreground">
                                    {address.city}, {address.state} {address.zipCode}
                                </p>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <Dialog.Footer>
                <Button.Root variant="outline" onclick={() => isSavedAddressesOpen = false}>
                    Cancel
                </Button.Root>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
{/if}