<script>
    import { onMount } from 'svelte';
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import * as Input from '$lib/components/ui/input';
    import * as Button from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as Sheet from '$lib/components/ui/sheet';
    import * as Badge from '$lib/components/ui/badge';
    import { User, ChevronRight, Check, Plus } from 'lucide-svelte';
    import {browser} from "$app/environment";

    let { initialData = {
        email: '',
        phone: '',
        savedProfileId: ''
    }, onSubmit } = $props()

    let email = $state(initialData.email);
    let phone = $state(initialData.phone);
    let savedProfileId = $state(initialData.savedProfileId || '');
    let errors = $state({});

    // Dialog/Sheet state
    let isProfilesOpen = $state(false);
    let isMobile = $state(browser && window.innerWidth < 768);

    // Sample saved profiles
    const savedProfiles = [
        {
            id: 'profile1',
            name: 'Personal',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            isDefault: true
        },
        {
            id: 'profile2',
            name: 'Work',
            email: 'john.doe@company.com',
            phone: '+1 (555) 987-6543',
            isDefault: false
        }
    ];

    function getSelectedProfile() {
        return savedProfiles.find(profile => profile.id === savedProfileId);
    }

    function selectProfile(profile) {
        savedProfileId = profile.id;
        email = profile.email;
        phone = profile.phone;
        isProfilesOpen = false;
    }

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
            onSubmit({
                email,
                phone,
                savedProfileId
            });
        }
    }

    // Window resize listener for mobile detection
    function handleResize() {
        isMobile = browser && window.innerWidth < 768;
    }

    onMount(() => {
        browser && window.addEventListener('resize', handleResize);
        return () => {
            browser && window.removeEventListener('resize', handleResize);
        };
    });
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
            <!-- Saved Profiles -->
            <div class="space-y-2">
                <div class="flex justify-between items-center">
                    <label class="text-sm font-medium">Your Profiles</label>
                    <Button.Root
                            variant="ghost"
                            size="sm"
                            onclick={() => isProfilesOpen = true}
                            class="text-xs h-8"
                    >
                        Select Profile
                        <ChevronRight class="h-4 w-4 ml-1" />
                    </Button.Root>
                </div>

                {#if savedProfileId}
                    {#each getSelectedProfile() as profile}
                    <div class="border rounded-lg p-3 relative">
                        <div class="flex justify-between">
                            <div class="flex items-start gap-3">
                                <User class="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <div class="flex items-center">
                                        <h4 class="font-medium">{profile.name}</h4>
                                        {#if profile.isDefault}
                                            <Badge.Root variant="outline" class="ml-2 text-[10px] py-0 h-4">
                                                Default
                                            </Badge.Root>
                                        {/if}
                                    </div>
                                    <p class="text-sm text-muted-foreground">{profile.email}</p>
                                    <p class="text-sm text-muted-foreground">{profile.phone}</p>
                                </div>
                            </div>
                            <Button.Root
                                    variant="ghost"
                                    size="icon"
                                    class="h-8 w-8 absolute top-2 right-2"
                                    onclick={() => isProfilesOpen = true}
                            >
                                <ChevronRight class="h-4 w-4" />
                            </Button.Root>
                        </div>
                    </div>
                    {/each}
                {/if}
            </div>

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

    <Card.Footer class="mx-4 px-0 sm:px-6 flex justify-end">
        <Button.Root onclick={handleSubmit} class="w-full sm:w-auto">
            Continue to Shipping
        </Button.Root>
    </Card.Footer>
</Card.Root>

<!-- Saved Profiles Dialog/Sheet -->
{#if isMobile}
    <Sheet.Root open={isProfilesOpen} onOpenChange={(open) => isProfilesOpen = open}>
        <Sheet.Content side="bottom" class="h-[60vh]">
            <Sheet.Header>
                <Sheet.Title>Saved Profiles</Sheet.Title>
                <Sheet.Description>Select from your saved profiles</Sheet.Description>
            </Sheet.Header>

            <div class="py-4 space-y-3">
                {#each savedProfiles as profile}
                    <div
                            class="border rounded-lg p-3 cursor-pointer hover:border-primary transition-all"
                            onclick={() => selectProfile(profile)}
                    >
                        <div class="flex items-start gap-3">
                            <User class="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div class="flex-grow">
                                <div class="flex items-center">
                                    <h4 class="font-medium">{profile.name}</h4>
                                    {#if profile.isDefault}
                                        <Badge.Root variant="outline" class="ml-2 text-[10px] py-0 h-4">
                                            Default
                                        </Badge.Root>
                                    {/if}
                                </div>
                                <p class="text-sm text-muted-foreground">{profile.email}</p>
                                <p class="text-sm text-muted-foreground">{profile.phone}</p>
                            </div>
                            {#if profile.id === savedProfileId}
                                <Check class="h-5 w-5 text-primary flex-shrink-0" />
                            {/if}
                        </div>
                    </div>
                {/each}

                <Button.Root
                        variant="outline"
                        class="w-full flex items-center justify-center gap-2"
                        onclick={() => {
                        savedProfileId = '';
                        email = '';
                        phone = '';
                        isProfilesOpen = false;
                    }}
                >
                    <Plus class="h-4 w-4" />
                    Enter new information
                </Button.Root>
            </div>

            <Sheet.Footer>
                <Button.Root variant="outline" onclick={() => isProfilesOpen = false}>
                    Cancel
                </Button.Root>
            </Sheet.Footer>
        </Sheet.Content>
    </Sheet.Root>
{:else}
    <Dialog.Root open={isProfilesOpen} onOpenChange={(open) => isProfilesOpen = open}>
        <Dialog.Content class="sm:max-w-[500px]">
            <Dialog.Header>
                <Dialog.Title>Saved Profiles</Dialog.Title>
                <Dialog.Description>Select from your saved profiles</Dialog.Description>
            </Dialog.Header>

            <div class="py-4 space-y-3">
                {#each savedProfiles as profile}
                    <div
                            class="border rounded-lg p-3 cursor-pointer hover:border-primary transition-all"
                            onclick={() => selectProfile(profile)}
                    >
                        <div class="flex items-start gap-3">
                            <User class="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div class="flex-grow">
                                <div class="flex items-center">
                                    <h4 class="font-medium">{profile.name}</h4>
                                    {#if profile.isDefault}
                                        <Badge.Root variant="outline" class="ml-2 text-[10px] py-0 h-4">
                                            Default
                                        </Badge.Root>
                                    {/if}
                                </div>
                                <p class="text-sm text-muted-foreground">{profile.email}</p>
                                <p class="text-sm text-muted-foreground">{profile.phone}</p>
                            </div>
                            {#if profile.id === savedProfileId}
                                <Check class="h-5 w-5 text-primary flex-shrink-0" />
                            {/if}
                        </div>
                    </div>
                {/each}

                <Button.Root
                        variant="outline"
                        class="w-full flex items-center justify-center gap-2"
                        onclick={() => {
                        savedProfileId = '';
                        email = '';
                        phone = '';
                        isProfilesOpen = false;
                    }}
                >
                    <Plus class="h-4 w-4" />
                    Enter new information
                </Button.Root>
            </div>

            <Dialog.Footer>
                <Button.Root variant="outline" onclick={() => isProfilesOpen = false}>
                    Cancel
                </Button.Root>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
{/if}