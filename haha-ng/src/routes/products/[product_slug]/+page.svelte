<script>
    import { onMount } from 'svelte';
    import {ProductGallery, ProductInfo, ProductActions, RelatedProducts, ReviewSection} from '$lib/components/product';
    import * as Tabs from '$lib/components/ui/tabs';
    import * as ScrollArea from '$lib/components/ui/scroll-area';

    let { data } = $props()

    // Product data (would come from your API)
    let product = data.product;

    let selectedColor = $state(product.colors[0]);
    let selectedSize = $state(product.sizes[0]);
    let quantity = $state(1);

    // Cart and wishlist state
    let isInCart = $state(false);
    let isInWishlist = $state(false);

    // Reviews data
    let reviews = $state(data.reviews.comments);
    let ratingStats = $state(data.reviews.stats);

    function handleAddToCart() {
        isInCart = true;
        // Add to cart logic
    }

    function handleBuyNow() {
        handleAddToCart();
        // Redirect to checkout
    }

    function toggleWishlist() {
        isInWishlist = !isInWishlist;
        // Update wishlist logic
    }

    onMount(async () => {
        // Fetch product data, reviews, etc.
    });
</script>

<svelte:head>
    <title>{product.title} | Fashion Store</title>
    <meta name="description" content={product.description} />
</svelte:head>

<div class="container mx-auto px-4 py-6 md:py-8">
    <!-- Product Overview Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
        <!-- Product Gallery -->
        <ProductGallery images={product.images} />

        <!-- Product Info & Actions -->
        <div class="flex flex-col gap-4 md:gap-6">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">{product.title}</h1>
                    <div class="flex flex-wrap items-center gap-2 md:gap-4">
                        <span class="text-sm text-neutral-500 dark:text-neutral-400">{product.category} / {product.subcategory}</span>
                        {#if product.isHot}
                            <span class="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-xs font-medium rounded-full">
                                Hot Product
                            </span>
                        {/if}
                        {#if product.isHighlyRated}
                            <span class="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 text-xs font-medium rounded-full">
                                Highly Rated
                            </span>
                        {/if}
                    </div>
                </div>
                <button
                        class="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex-shrink-0 ml-2"
                        onclick={toggleWishlist}
                >
                    {#if isInWishlist}
                        <svg class="w-5 h-5 md:w-6 md:h-6 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                        </svg>
                    {:else}
                        <svg class="w-5 h-5 md:w-6 md:h-6 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    {/if}
                </button>
            </div>

            <ProductInfo
                    {product}
                    {selectedColor}
                    {selectedSize}
                    bind:quantity
                    oncolorChange={(color) => selectedColor = color}
                    onsizeChange={(size) => selectedSize = size}
            />

            <ProductActions
                    {product}
                    {isInCart}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
            />
        </div>
    </div>

    <!-- Product Details Tabs -->
    <div class="mb-8 md:mb-12 w-full overflow-hidden">
        <Tabs.Root value="description" class="w-full">
            <Tabs.List class="border-b border-neutral-300 dark:border-neutral-700 w-full overflow-x-auto flex">
                <Tabs.Trigger value="description" class="whitespace-nowrap text-neutral-900 dark:text-white px-4 py-2">Description</Tabs.Trigger>
                <Tabs.Trigger value="features" class="whitespace-nowrap text-neutral-900 dark:text-white px-4 py-2">Features</Tabs.Trigger>
                <Tabs.Trigger value="specifications" class="whitespace-nowrap text-neutral-900 dark:text-white px-4 py-2">Specifications</Tabs.Trigger>
                <Tabs.Trigger value="reviews" class="whitespace-nowrap text-neutral-900 dark:text-white px-4 py-2">
                    Reviews ({product.reviewCount})
                </Tabs.Trigger>
            </Tabs.List>

            <ScrollArea.Root class="h-64 md:h-80 lg:h-96 rounded-md border border-neutral-300 dark:border-neutral-700 p-3 md:p-4 dark:bg-neutral-800">
                <Tabs.Content value="description">
                    <div class="prose max-w-none text-neutral-700 dark:text-neutral-300">
                        {product.description}
                    </div>
                </Tabs.Content>

                <Tabs.Content value="features">
                    <ul class="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                        {#each product.features as feature}
                            <li>{feature}</li>
                        {/each}
                    </ul>
                </Tabs.Content>

                <Tabs.Content value="specifications">
                    <dl class="divide-y divide-neutral-200 dark:divide-neutral-700">
                        {#each Object.entries(product.specifications) as [key, value]}
                            <div class="py-3 flex flex-col sm:flex-row sm:justify-between">
                                <dt class="font-medium text-neutral-900 dark:text-neutral-100 mb-1 sm:mb-0">{key}</dt>
                                <dd class="text-neutral-700 dark:text-neutral-300">{value}</dd>
                            </div>
                        {/each}
                    </dl>
                </Tabs.Content>

                <Tabs.Content value="reviews">
                    <ReviewSection
                            {reviews}
                            {ratingStats}
                            productId={product.id}
                    />
                </Tabs.Content>
            </ScrollArea.Root>
        </Tabs.Root>
    </div>

    <!-- Related Products -->
    <RelatedProducts category={product.category} currentProductId={product.id} />
</div>