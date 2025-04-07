<script>
    import * as Card from '$lib/components/ui/card';
    import * as Button from '$lib/components/ui/button';
    import * as Badge from '$lib/components/ui/badge';
    let {product, onaddToCart} = $props();

    // Add a function to handle bookmark/heart button clicks
    function handleBookmark(e) {
        e.preventDefault();
        e.stopPropagation();
        // Add your bookmark logic here
        console.log('Bookmark clicked for product:', product.id);
    }
</script>

<Card.Root class="relative">
    <div class="relative h-64 overflow-hidden p-4 flex items-center justify-center">
        <a href={`/products/${product.id}`} class="block w-full h-full flex items-center justify-center">
            <img src={product.thumbnail || "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZmFzaGlvbiUyMHdhdGNoZXN8ZW58MHx8MHx8fDA%3D"}
                 alt={product.title}
                 class="max-h-full max-w-full object-contain"
            />
        </a>
        <Badge.Root variant="outline" class="absolute top-2 left-2">
            {product.category}
        </Badge.Root>
        <Button.Root
                variant="outline"
                size="icon"
                class="absolute top-2 right-2 rounded-full"
                on:click={handleBookmark}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
        </Button.Root>
    </div>

    <Card.Content class="p-4">
        <a href={`/products/${product.id}`} class="block">
            <h3 class="font-medium text-lg mb-2 line-clamp-1">{product.title}</h3>
            <p class="text-neutral-600 dark:text-neutral-400 text-sm mb-3 line-clamp-2">{product.description}</p>
        </a>

        <div class="flex justify-between items-center">
            <div>
                <span class="font-bold text-lg">₦{product.price.toFixed(2)}</span>
                {#if product.discountPercentage > 0}
                    <span class="text-sm text-neutral-500 dark:text-neutral-400 line-through ml-2">
                        ₦{(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                {/if}
            </div>
            <Button.Root
                    on:click={(e) => {
                        e.stopPropagation();
                        onaddToCart(product);
                    }}
            >
                Add to Cart
            </Button.Root>
        </div>
    </Card.Content>
</Card.Root>