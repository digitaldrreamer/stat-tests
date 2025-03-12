<script>
    import * as Button from '$lib/components/ui/button';
    import * as Input from '$lib/components/ui/input';
    import {Badge} from '$lib/components/ui/badge';
    import * as Sheet from '$lib/components/ui/sheet';
    import {ModeWatcher} from "$lib/components/misc/index.js";

    let { searchQuery = $bindable(''), cartCount = $bindable(0) } = $props()

    $inspect('count', cartCount)
</script>

<header class="sticky top-0 z-50 bg-white dark:bg-neutral-800 shadow-md">
    <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-800 dark:text-neutral-200">
                    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                </svg>
                <span class="text-xl font-bold">Haha.ng</span>
            </div>

            <!-- Search -->
            <div class="hidden md:flex items-center flex-1 max-w-md mx-4">
                <div class="relative w-full">
                    <Input.Root>
                        <Input.Input
                                type="text"
                                bind:value={searchQuery}
                                placeholder="Search for products..."
                                class="w-full pr-10"
                        />
                    </Input.Root>
                    <button class="absolute right-3 top-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-500">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.3-4.3"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="flex items-center space-x-6">
                <ModeWatcher />

                <Button.Root variant="ghost" class="hidden md:flex">Account</Button.Root>
                <Button.Root variant="ghost" class="hidden md:flex">Wishlist</Button.Root>

                <div class="relative">
                    <Button.Root variant="ghost" size="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="8" cy="21" r="1"/>
                            <circle cx="19" cy="21" r="1"/>
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                        </svg>
                    </Button.Root>
                    {#key cartCount}
                    {#if cartCount > 0}
                        <Badge class="absolute -top-1 -right-1">
                            {cartCount}
                        </Badge>
                    {/if}
                        {/key}
                </div>

                <Sheet.Root>
                    <Sheet.Trigger class="md:hidden">
                        <Button.Root variant="ghost" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="4" x2="20" y1="12" y2="12"/>
                                <line x1="4" x2="20" y1="6" y2="6"/>
                                <line x1="4" x2="20" y1="18" y2="18"/>
                            </svg>
                        </Button.Root>
                    </Sheet.Trigger>
                    <Sheet.Content side="right" class="w-[300px]">
                        <Sheet.Header>
                            <Sheet.Title>Menu</Sheet.Title>
                            <Sheet.Description>Navigation and search options</Sheet.Description>
                        </Sheet.Header>
                        <div class="py-4">
                            <Input.Root class="mb-4">
                                <Input.Input
                                        type="text"
                                        bind:value={searchQuery}
                                        placeholder="Search for products..."
                                />
                            </Input.Root>
                            <nav class="space-y-2">
                                <Button.Root variant="ghost" class="w-full justify-start">Account</Button.Root>
                                <Button.Root variant="ghost" class="w-full justify-start">Wishlist</Button.Root>
                                <Button.Root variant="ghost" class="w-full justify-start">Cart ({cartCount})</Button.Root>
                            </nav>
                        </div>
                    </Sheet.Content>
                </Sheet.Root>
            </nav>
        </div>

        <!-- Mobile Search -->
        <div class="mt-4 md:hidden">
            <Input.Root>
                <Input.Input
                        type="text"
                        bind:value={searchQuery}
                        placeholder="Search for products..."
                />
            </Input.Root>
        </div>
    </div>
</header>