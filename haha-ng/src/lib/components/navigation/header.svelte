<script>
    import {Badge} from '$lib/components/ui/badge';
    import {ModeWatcher} from "$lib/components/misc/index.js";
    import {goto} from "$app/navigation";
    import * as Button from '$lib/components/ui/button';
    import {Input} from '$lib/components/ui/input';
    import * as Sheet from '$lib/components/ui/sheet';
    import * as Avatar from '$lib/components/ui/avatar';
    import {page} from '$app/state'

    let {
        cartCount = $bindable(0),
        isAuthenticated = false,
        user = page.data.user
    } = $props();

    if (!user.profilePicture || user.profilePicture === '') {
        user.profilePicture = `https://api.dicebear.com/9.x/lorelei/svg?seed=${user?.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&backgroundType=gradientLinear,solid`
    }

    const isSearchPage = page.url.pathname === "/search"

    $inspect('count', cartCount);



    // Control the dropdown state
    let isDropdownOpen = $state(false);

    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
    }

    function closeDropdown() {
        isDropdownOpen = false;
    }
</script>

<header class="sticky top-0 z-50 bg-white dark:bg-neutral-800 shadow-md">
    <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
            <!-- Logo -->
            <a href="/" class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="text-neutral-800 dark:text-neutral-200">
                    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                </svg>
                <span class="text-xl font-bold">Haha.ng</span>
            </a>

            <!-- Search -->
            <div class="hidden md:flex items-center flex-1 max-w-md mx-4">
                <form onsubmit={(event) => {
                    event.preventDefault();
                    const searchValue = event.target.querySelector('input').value;
        if (searchValue.trim()) {
            goto(`/search?q=${encodeURIComponent(searchValue.trim())}`);
        }

                }} class="relative w-full">
                    <Input
                                onclick={(e) => {
                                    if (!e?.target?.value.trim() && !isSearchPage) goto('/search')
                                }}
                                onkeydown={(e) => {
                                    if (e.key === 'Enter') {
                                        const searchValue = e?.target?.value
                                        if (searchValue.trim()) {
                                            goto(`/search?q=${encodeURIComponent(searchValue.trim())}`);
                                        }
                                    }
                                }}
                                type="text"
                                placeholder="Search for products..."
                                class="w-full pr-10"
                        />
                    <button class="absolute right-3 top-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="text-neutral-500">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.3-4.3"/>
                        </svg>
                    </button>
                </form>
            </div>

            <!-- Navigation -->
            <nav class="flex items-center space-x-6">
                <ModeWatcher/>

                <!-- Authentication for large screens -->
                {#if isAuthenticated}
                    <!-- User Profile Dropdown -->
                    <div class="hidden md:block relative">
                        <button
                                class="flex items-center space-x-1 focus:outline-none"
                                onclick={toggleDropdown}
                                aria-haspopup="true"
                                aria-expanded={isDropdownOpen}
                        >
                            <Avatar.Root>
                                <Avatar.Image src={user?.profilePicture} alt={user?.firstName}
                                onerror={(e) => e.target.src = `https://api.dicebear.com/9.x/lorelei/svg?seed=${user?.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&backgroundType=gradientLinear,solid`}/>
                                <Avatar.Fallback>{user?.firstName[0] || 'U'}</Avatar.Fallback>
                            </Avatar.Root>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round" class="text-neutral-500">
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </button>

                        {#if isDropdownOpen}
                            <div
                                    class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu"
                            >
                                <div class="py-1 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3">
                                    <p class="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                                    <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user?.email}</p>
                                </div>
                                <div class="py-1">
                                    <a
                                            href="/profile"
                                            class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center"
                                            onclick={closeDropdown}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                        Profile
                                    </a>
                                    <a
                                            href="/orders"
                                            class="block justify-between px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center"
                                            onclick={closeDropdown}
                                    >
                                        <span class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                            <path d="M9 17h6"/>
                                            <path d="M9 13h6"/>
                                            <path d="M9 9h6"/>
                                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"/>
                                        </svg>
                                        Orders
                                        </span>
                                        <Badge>
                                            1
                                        </Badge>
                                    </a>
                                    <a
                                            href="/cart"
                                            class="block justify-between px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center"
                                            onclick={closeDropdown}
                                    >
                                        <span class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                            <circle cx="8" cy="21" r="1"/>
                                            <circle cx="19" cy="21" r="1"/>
                                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                                        </svg>
                                        Cart
                                        </span>
                                        <Badge>
                                            1
                                        </Badge>
                                    </a>
                                    <a
                                            href="/wishlist"
                                            class="block justify-between px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center"
                                            onclick={closeDropdown}
                                    >
                                        <span class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                        </svg>
                                        Wishlist
                                        </span>
                                        <Badge>
                                            1
                                        </Badge>
                                    </a>
                                    <a
                                            href="/profile/settings"
                                            class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center"
                                            onclick={closeDropdown}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                        Settings
                                    </a>
                                </div>
                                <div class="py-1 border-t border-neutral-200 dark:border-neutral-700">
                                    <a
                                            href="/returns"
                                            class="block justify-between px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center"
                                            onclick={closeDropdown}
                                    >
                                        <span class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path
                                                    d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M22 8c0-2.3-.8-4.3-2-6"/><path
                                                    d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/><path
                                                    d="M4 2C2.8 3.7 2 5.7 2 8"/></svg>
                                        Notifications
                                        </span>
                                        <Badge>
                                            1
                                        </Badge>
                                    </a>
                                    <a
                                            href="/returns"
                                            class="block justify-between px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center"
                                            onclick={closeDropdown}
                                    >
                                        <span class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path
                                                d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path
                                                d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line
                                                x1="12" x2="12" y1="22" y2="12"/><path d="m17 13 5 5m-5 0 5-5"/></svg>
                                        Returns
                                        </span>
                                        <Badge>
                                            1
                                        </Badge>
                                    </a>
                                    <a
                                            href="/auth/logout"
                                            class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center"
                                            onclick={closeDropdown}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                            <circle cx="12" cy="12" r="10"/>
                                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                            <path d="M12 17h.01"/>
                                        </svg>
                                        Support
                                    </a>
                                </div>
                                <div class="py-1 border-t border-neutral-200 dark:border-neutral-700">
                                    <a
                                            href="/auth/logout"
                                            class="block px-4 py-2 text-sm text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center"
                                            onclick={closeDropdown}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                            <polyline points="16 17 21 12 16 7"/>
                                            <line x1="21" y1="12" x2="9" y2="12"/>
                                        </svg>
                                        Log out
                                    </a>
                                </div>
                            </div>
                        {/if}

                        <!-- Close dropdown when clicking outside -->
                        {#if isDropdownOpen}
                            <div
                                    class="fixed inset-0 z-40"
                                    onclick={closeDropdown}
                                    onkeydown={(e) => e.key === 'Escape' && closeDropdown()}
                                    tabindex="-1"
                            ></div>
                        {/if}
                    </div>
                {:else}
                    <!-- Auth buttons for non-authenticated users -->
                    <div class="hidden md:flex space-x-2">
                        <Button.Root variant="outline" size="sm">
                            <a href="/auth/login" class="w-full">Sign In</a>
                        </Button.Root>
                        <Button.Root variant="default" size="sm">
                            <a href="/auth/register" class="w-full">Sign Up</a>
                        </Button.Root>
                    </div>
                {/if}

                <!-- Wishlist button (only show on large screens if authenticated) -->
                {#if isAuthenticated}
                    <Button.Root variant="ghost" class="hidden md:flex">
                        <a href="/wishlist" class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round" class="mr-2">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                            </svg>
                            Wishlist
                        </a>
                    </Button.Root>
                {/if}

                <!-- Cart button -->
                <div class="relative">
                    <Button.Root variant="ghost" size="icon">
                        <a title="Cart" href="/cart">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round">
                                <circle cx="8" cy="21" r="1"/>
                                <circle cx="19" cy="21" r="1"/>
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                            </svg>
                        </a>
                    </Button.Root>
                    {#key cartCount}
                        {#if cartCount > 0}
                            <Badge class="absolute -top-1 -right-1">
                                {cartCount}
                            </Badge>
                        {/if}
                    {/key}
                </div>

                <!-- Mobile menu -->
                <Sheet.Root>
                    <Sheet.Trigger class="md:hidden">
                        <Button.Root variant="ghost" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round">
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
                            <!-- User profile section for mobile -->
                            {#if isAuthenticated}
                                <div class="flex items-center space-x-3 mb-6 p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                                    <Avatar.Root>
                                        <Avatar.Image src={user?.profilePicture} alt={user?.firstName}
                                        onerror={(e) => e.target.src = `https://api.dicebear.com/9.x/lorelei/svg?seed=${user?.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&backgroundType=gradientLinear,solid`}/>
                                        <Avatar.Fallback>{user?.firstName[0] || 'U'}</Avatar.Fallback>
                                    </Avatar.Root>
                                    <div>
                                        <p class="font-medium">{user?.firstName} {user?.lastName}</p>
                                        <p class="text-xs text-neutral-500 dark:text-neutral-400">{user?.email}</p>
                                    </div>
                                </div>
                            {/if}

                            <form class="relative"
                                  onsubmit={(event) => {
          event.preventDefault();
          const searchValue = event.target.querySelector('input').value;
          if (searchValue.trim()) {
              goto(`/search?q=${encodeURIComponent(searchValue.trim())}`);
          }
      }}>
                                <Input class="mb-4"
                                            onclick={(e) => {
                if (!e?.target?.value?.trim() && !isSearchPage) goto('/search');
            }}
                                            onkeydown={(e) => {
                if (e.key === 'Enter') {
                    const searchValue = e?.target?.value;
                    if (searchValue?.trim()) {
                        goto(`/search?q=${encodeURIComponent(searchValue.trim())}`);
                    }
                }
            }}
                                            type="text"
                                            placeholder="Search for products..."
                                    />
                            </form>

                            <nav class="space-y-2 overflow-y-scroll max-h-screen py-2">
                                {#if isAuthenticated}
                                    <Button.Root variant="ghost" class="w-full justify-start">
                                        <a href="/profile" class="w-full flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                                <circle cx="12" cy="7" r="4"/>
                                            </svg>
                                            Profile
                                        </a>
                                    </Button.Root>
                                    <Button.Root variant="ghost" class="w-full justify-start">
                                        <a href="/orders" class="w-full flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                                <path d="M9 17h6"/>
                                                <path d="M9 13h6"/>
                                                <path d="M9 9h6"/>
                                                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"/>
                                            </svg>
                                            Orders (0)
                                        </a>
                                    </Button.Root>
                                    <Button.Root variant="ghost" class="w-full justify-start">
                                        <a href="/wishlist" class="w-full flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                            </svg>
                                            Wishlist (24)
                                        </a>
                                    </Button.Root>
                                    <Button.Root variant="ghost" class="w-full justify-start">
                                        <a href="/profile/settings" class="w-full flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                            Settings
                                        </a>
                                    </Button.Root>
                                    <Button.Root variant="ghost" class="w-full justify-start">
                                        <a href="/wishlist" class="w-full flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                                <path d="M10.268 21a2 2 0 0 0 3.464 0"/>
                                                <path d="M22 8c0-2.3-.8-4.3-2-6"/>
                                                <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
                                                <path d="M4 2C2.8 3.7 2 5.7 2 8"/>
                                            </svg>
                                            Notifications (6)
                                        </a>
                                    </Button.Root>
                                    <Button.Root variant="ghost" class="w-full justify-start">
                                        <a href="/wishlist" class="w-full flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                            </svg>
                                            Returns (1)
                                        </a>
                                    </Button.Root>
                                    <Button.Root variant="ghost" class="w-full justify-start">
                                        <a href="/wishlist" class="w-full flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                                <circle cx="12" cy="12" r="10"/>
                                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                                <path d="M12 17h.01"/>
                                            </svg>
                                            Support
                                        </a>
                                    </Button.Root>
                                    <Button.Root variant="ghost" class="w-full justify-start text-red-500">
                                        <a href="/auth/logout" class="w-full flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                                <polyline points="16 17 21 12 16 7"/>
                                                <line x1="21" y1="12" x2="9" y2="12"/>
                                            </svg>
                                            Log out
                                        </a>
                                    </Button.Root>
                                {:else}
                                    <div class="flex flex-col space-y-2 mb-4">
                                        <Button.Root variant="outline" class="w-full">
                                            <a href="/auth/login" class="w-full">Sign In</a>
                                        </Button.Root>
                                        <Button.Root variant="default" class="w-full">
                                            <a href="/auth/register" class="w-full">Sign Up</a>
                                        </Button.Root>
                                    </div>
                                {/if}

                                <Button.Root variant="ghost" class="w-full justify-start">
                                    <a href="/cart" class="w-full flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                            <circle cx="8" cy="21" r="1"/>
                                            <circle cx="19" cy="21" r="1"/>
                                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                                        </svg>
                                        Cart ({cartCount})
                                    </a>
                                </Button.Root>
                            </nav>
                        </div>
                    </Sheet.Content>
                </Sheet.Root>
            </nav>
        </div>

        <!-- Mobile Search -->
        <form
                class="mt-4 md:hidden"
                onsubmit={(event) => {
        event.preventDefault();
        const searchValue = event.target.querySelector('input').value;
        if (searchValue.trim()) {
            goto(`/search?q=${encodeURIComponent(searchValue.trim())}`);
        }
    }}>
            <Input
                        onclick={(e) => {
                if (!e?.target?.value?.trim() && !isSearchPage) goto('/search');
            }}
                        onkeydown={(e) => {
                if (e.key === 'Enter') {
                    const searchValue = e?.target?.value;
                    if (searchValue?.trim()) {
                        goto(`/search?q=${encodeURIComponent(searchValue.trim())}`);
                    }
                }
            }}
                        type="text"
                        placeholder="Search for products..."
                />
        </form>
    </div>
</header>