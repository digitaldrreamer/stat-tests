<script>
    import * as Button from '$lib/components/ui/button';
    import * as Tooltip from '$lib/components/ui/tooltip';

    let { product, isInCart = false, onAddToCart, onBuyNow } = $props()

    // Stock status
    const stockStatus = $state(product.inStock ? 'In Stock' : 'Out of Stock');
    const isAvailable = $state(product.inStock);
</script>

<div class="space-y-4">
    <!-- Stock Status -->
    <div class="flex items-center gap-2">
        <span class={`inline-block w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span class="text-sm font-medium">{stockStatus}</span>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3">
        <Button.Root
                variant="outline"
                class="flex-1 gap-2"
                onclick={onAddToCart}
                disabled={!isAvailable || isInCart}
        >
            {#if isInCart}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Added to Cart
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                </svg>
                Add to Cart
            {/if}
        </Button.Root>

        <Button.Root
                class="flex-1"
                onclick={onBuyNow}
                disabled={!isAvailable}
        >
            Buy Now
        </Button.Root>
    </div>

    <!-- Additional Actions -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button class="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck">
                            <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"></path>
                            <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"></path>
                            <circle cx="7" cy="18" r="2"></circle>
                            <circle cx="17" cy="18" r="2"></circle>
                        </svg>
                        Shipping Info
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>Free shipping on orders over $50</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </Tooltip.Provider>

        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button class="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                            <path d="M3 3v5h5"></path>
                        </svg>
                        Return Policy
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>30-day easy returns</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </Tooltip.Provider>
    </div>
</div>