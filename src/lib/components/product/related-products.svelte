<script>
    import { onMount } from 'svelte';
    import * as Card from '$lib/components/ui/card';
    import * as AspectRatio from '$lib/components/ui/aspect-ratio';

    let { category, currentProductId } = $props()

    let relatedProducts = $state([]);

    // Mock data for related products
    onMount(() => {
        // In a real app, you would fetch related products from an API
        relatedProducts = [
            {
                id: 101,
                title: "Leather Tote Bag",
                price: 149.99,
                rating: 4.3,
                reviewCount: 87,
                image: "https://cdn.dummyjson.com/products/images/womens-bags/Women%20Handbag%20Black/thumbnail.png",
                category: "Accessories",
                subcategory: "Bags"
            },
            {
                id: 102,
                title: "Canvas Backpack",
                price: 89.99,
                rating: 4.7,
                reviewCount: 124,
                image: "https://cdn.dummyjson.com/products/images/womens-bags/Prada%20Women%20Bag/thumbnail.png",
                category: "Accessories",
                subcategory: "Bags"
            },
            {
                id: 103,
                title: "Messenger Bag",
                price: 129.99,
                rating: 4.5,
                reviewCount: 56,
                image: "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/thumbnail.png",
                category: "Accessories",
                subcategory: "Bags"
            },
            {
                id: 104,
                title: "Leather Wallet",
                price: 59.99,
                rating: 4.8,
                reviewCount: 203,
                image: "https://cdn.dummyjson.com/products/images/womens-bags/Blue%20Women's%20Handbag/thumbnail.png",
                category: "Accessories",
                subcategory: "Wallets"
            }
        ];
    });

    function navigateToProduct(productId) {
        // In a real app, this would navigate to the product page
        console.log(`Navigating to product ${productId}`);
    }
</script>

<section>
    <h2 class="text-2xl font-bold mb-6">Related Products</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each relatedProducts as product}
            <Card.Root class="h-full">
                <Card.Content class="p-0">
                    <button
                            class="w-full text-left"
                            on:click={() => navigateToProduct(product.id)}
                    >
                        <AspectRatio.Root ratio={1}>
                            <img
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.title}
                                    class="w-full h-full object-cover rounded-t-lg"
                            />
                        </AspectRatio.Root>

                        <div class="p-4">
                            <h3 class="font-medium text-lg mb-1 line-clamp-1">{product.title}</h3>

                            <div class="flex items-center gap-2 mb-2">
                                <div class="flex">
                                    {#each Array(5) as _, i}
                                        <svg
                                                class="w-4 h-4 {i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    {/each}
                                </div>
                                <span class="text-xs text-gray-500">({product.reviewCount})</span>
                            </div>

                            <p class="font-bold text-lg">${product.price}</p>
                        </div>
                    </button>
                </Card.Content>
            </Card.Root>
        {/each}
    </div>
</section>