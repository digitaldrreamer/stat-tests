<script lang="ts">
    import { ArrowUpWideNarrow, ArrowDownWideNarrow, ChevronDown } from 'lucide-svelte';
    import { onMount, onDestroy } from 'svelte';
    import {browser} from "$app/environment";

    // Props
    let { productsPerPage = 8, sortBy = null, onsortChange, onperPageChange } = $props();

    // State
    let sortDropdownOpen = $state(false);
    let perPageDropdownOpen = $state(false);

    // References to the dropdown elements
    let sortDropdownRef: HTMLDivElement;
    let perPageDropdownRef: HTMLDivElement;

    // Handlers
    function handleSortChange(value: string) {
        sortBy = value;
        sortDropdownOpen = false;
        onsortChange(value);
    }

    function handlePerPageChange(value: number) {
        productsPerPage = value;
        perPageDropdownOpen = false;
        onperPageChange(value);
    }

    // Click outside handler
    function handleGlobalClick(event: MouseEvent) {
        // Handle sort dropdown
        if (sortDropdownRef && !sortDropdownRef.contains(event.target as Node) && sortDropdownOpen) {
            sortDropdownOpen = false;
        }

        // Handle per page dropdown
        if (perPageDropdownRef && !perPageDropdownRef.contains(event.target as Node) && perPageDropdownOpen) {
            perPageDropdownOpen = false;
        }
    }

    // Set up event listeners
    onMount(() => {
        browser && document.addEventListener('click', handleGlobalClick, true);
    });

    // Clean up event listeners
    onDestroy(() => {
        browser && document.removeEventListener('click', handleGlobalClick, true);
    });
</script>

<div class="flex flex-col sm:flex-row gap-4">
    <!-- Sort dropdown -->
    <div class="relative" bind:this={sortDropdownRef}>
        <button
                class="flex items-center justify-between w-[180px] px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                onclick={(e) => {
                    e.stopPropagation();
                    sortDropdownOpen = !sortDropdownOpen;
                }}
                aria-haspopup="listbox"
                aria-expanded={sortDropdownOpen}
        >
            <div class="flex items-center">
                {#if sortBy && sortBy.includes('asc')}
                    <div class="mr-2 size-4 text-gray-500 dark:text-gray-400">
                        <ArrowUpWideNarrow size={16} />
                    </div>
                {:else if sortBy}
                    <div class="mr-2 size-4 text-gray-500 dark:text-gray-400">
                        <ArrowDownWideNarrow size={16} />
                    </div>
                {/if}
                <span>{sortBy === "" ? "Relevance" : ""}{sortBy ?? "Sort by"}</span>
            </div>
            <div class="size-4 text-gray-500 dark:text-gray-400" class:rotate-180={sortDropdownOpen}>
                <ChevronDown size={16} />
            </div>
        </button>

        {#if sortDropdownOpen}
            <div
                    class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg"
                    role="listbox"
            >
                <ul class="py-1 max-h-60 overflow-auto">
                    <li
                            class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                            role="option"
                            aria-selected={sortBy === "" ?? !sortBy}
                            onclick={(e) => {
                                e.stopPropagation();
                                handleSortChange("");
                            }}
                    >
                        Default
                    </li>
                    <li
                            class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                            role="option"
                            aria-selected={sortBy === "price-asc"}
                            onclick={(e) => {
                                e.stopPropagation();
                                handleSortChange("price-asc");
                            }}
                    >
                        Price: Low to High
                    </li>
                    <li
                            class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                            role="option"
                            aria-selected={sortBy === "price-desc"}
                            onclick={(e) => {
                                e.stopPropagation();
                                handleSortChange("price-desc");
                            }}
                    >
                        Price: High to Low
                    </li>
                    <li
                            class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                            role="option"
                            aria-selected={sortBy === "newest"}
                            onclick={(e) => {
                                e.stopPropagation();
                                handleSortChange("newest");
                            }}
                    >
                        Newest
                    </li>
                    <li
                            class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                            role="option"
                            aria-selected={sortBy === "updated"}
                            onclick={(e) => {
                                e.stopPropagation();
                                handleSortChange("updated");
                            }}
                    >
                        Updated
                    </li>
                    <li
                            class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                            role="option"
                            aria-selected={sortBy === "best-selling"}
                            onclick={(e) => {
                                e.stopPropagation();
                                handleSortChange("best-selling");
                            }}
                    >
                        Best Selling
                    </li>
                </ul>
            </div>
        {/if}
    </div>

    <!-- Items per page -->
    <div class="relative" bind:this={perPageDropdownRef}>
        <button
                class="flex items-center justify-between w-[180px] px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                onclick={(e) => {
                    e.stopPropagation();
                    perPageDropdownOpen = !perPageDropdownOpen;
                }}
                aria-haspopup="listbox"
                aria-expanded={perPageDropdownOpen}
        >
            <span>
                {productsPerPage ? `Show ${productsPerPage} ${productsPerPage === 1 ? 'item' : 'items'}` : 'No Items Available'}
            </span>
            <div class="size-4 text-gray-500 dark:text-gray-400" class:rotate-180={perPageDropdownOpen}>
                <ChevronDown size={16} />
            </div>
        </button>

        {#if perPageDropdownOpen}
            <div
                    class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg"
                    role="listbox"
            >
                <ul class="py-1 max-h-60 overflow-auto">
                    <li
                            class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                            role="option"
                            aria-selected={productsPerPage === 8}
                            onclick={(e) => {
                                e.stopPropagation();
                                handlePerPageChange(8);
                            }}
                    >
                        Show 8 items
                    </li>
                    <li
                            class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                            role="option"
                            aria-selected={productsPerPage === 12}
                            onclick={(e) => {
                                e.stopPropagation();
                                handlePerPageChange(12);
                            }}
                    >
                        Show 12 items
                    </li>
                    <li
                            class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                            role="option"
                            aria-selected={productsPerPage === 16}
                            onclick={(e) => {
                                e.stopPropagation();
                                handlePerPageChange(16);
                            }}
                    >
                        Show 16 items
                    </li>
                    <li
                            class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                            role="option"
                            aria-selected={productsPerPage === 24}
                            onclick={(e) => {
                                e.stopPropagation();
                                handlePerPageChange(24);
                            }}
                    >
                        Show 24 items
                    </li>
                </ul>
            </div>
        {/if}
    </div>
</div>