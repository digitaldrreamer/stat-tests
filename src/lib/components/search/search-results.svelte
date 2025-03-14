<script>
    import { ProductCard } from '$lib/components/product/index.js';
    import SearchSkeleton from './search-skeleton.svelte';

    let {
        results = [],
        isLoading = false,
        columns = {
            mobile: 2,
            tablet: 3,
            desktop: 4
        },
        onAddToCart
    } = $props();
</script>

<div>
    {#if isLoading}
        <SearchSkeleton columns={columns}/>
    {:else if results.length === 0}
        <div class="py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="mx-auto mb-4 text-neutral-400">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
            </svg>
            <h3 class="text-lg font-medium mb-2">No results found</h3>
            <p class="text-neutral-500 dark:text-neutral-400">
                Try adjusting your search or filter criteria
            </p>
        </div>
    {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {#each results as product}
                <ProductCard {product} onaddToCart={onAddToCart}/>
            {/each}
        </div>
    {/if}
</div>