<script>
    import { onMount } from 'svelte';
    import * as Input from '$lib/components/ui/input';
    import * as Button from '$lib/components/ui/button';

    let {
        placeholder = "Search for products...",
        onSearch,
        getSuggestions
    } = $props();


    let searchInput = $state('');
    let suggestions = $state([]);
    let showSuggestions = $state(false);
    let inputElement;

    function handleInput() {
        if (searchInput.trim()) {
            suggestions = getSuggestions(searchInput);
            showSuggestions = suggestions.length > 0;
        } else {
            showSuggestions = false;
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (searchInput.trim()) {
            onSearch(searchInput);
            showSuggestions = false;
        }
    }

    function selectSuggestion(suggestion) {
        searchInput = suggestion;
        showSuggestions = false;
        handleSubmit();
    }

    // Close suggestions when clicking outside
    function handleClickOutside(event) {
        if (inputElement && !inputElement.contains(event.target)) {
            showSuggestions = false;
        }
    }

    onMount(() => {
        document.getElementById('searchEl').focus()
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<div class="relative" bind:this={inputElement}>
    <form onsubmit={handleSubmit} class="flex">
        <div class="relative flex-grow">
            <Input.Root
                    type="text"
                    id="searchEl"
                    bind:value={searchInput}
                    placeholder={placeholder}
                    oninput={handleInput}
                    class="pr-10"
            />
            {#if searchInput}
                <button
                        type="button"
                        class="absolute right-10 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        onclick={() => { searchInput = ''; handleInput(); }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </button>
            {/if}
        </div>
        <Button.Root type="submit" class="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
            </svg>
            Search
        </Button.Root>
    </form>

    {#if showSuggestions}
        <div class="absolute z-10 mt-1 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg">
            <ul class="py-1">
                {#each suggestions as suggestion}
                    <li>
                        <button
                                class="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm"
                                onclick={() => selectSuggestion(suggestion)}
                        >
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-neutral-400">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="m21 21-4.3-4.3"/>
                                </svg>
                                {suggestion}
                            </div>
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>