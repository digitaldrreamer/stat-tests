<script>
    import { Badge } from '$lib/components/ui/badge';
    import { categories } from "$lib/stores/constants.js";
    import { onMount } from "svelte";

    let { selectedCategory = $bindable('all'), onsetCategory } = $props();
    let container;

    function setCategory(slug) {
        onsetCategory(slug);
    }

    function handleScroll(e) {
        // Optional: Add scroll shadow logic if needed
    }
</script>

<section class="py-10 bg-neutral-100 dark:bg-neutral-800">
    <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6 text-center">Shop by Category</h2>

        <div class="relative">
            <div
                    class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide"
                    onscroll={handleScroll}
                    bind:this={container}
            >
                {#if $categories.length === 0}
                    <div class="flex gap-2 animate-pulse">
                        <div class="h-9 w-24 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <div class="h-9 w-32 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <div class="h-9 w-20 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                {:else}
                    <div class="flex space-x-2 px-1">
                        {#each $categories as category}
                            <button
                                    onclick={() => setCategory(category.slug)}
                                    class={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors
                                    ${
                                        selectedCategory === category.slug
                                            ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                                            : 'bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600'
                                    }`}
                            >
                                {category.name}
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</section>

    <style>
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
    </style>