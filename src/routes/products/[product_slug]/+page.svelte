<script>
    import { onMount } from 'svelte';
    import {ProductGallery, ProductInfo, ProductActions, RelatedProducts, ReviewSection} from '$lib/components/product';
    import * as Tabs from '$lib/components/ui/tabs';
    import * as ScrollArea from '$lib/components/ui/scroll-area';

    // Product data (would come from your API)
    let product = {
        id: 1,
        title: "Premium Leather Crossbody Bag",
        slug: "premium-leather-crossbody",
        price: 199.99,
        originalPrice: 249.99,
        discount: 20,
        rating: 4.5,
        reviewCount: 128,
        category: "Accessories",
        subcategory: "Bags",
        type: "Crossbody",
        brand: "LeatherCraft",
        isHot: true,
        isHighlyRated: true,
        inStock: true,
        description: `
            Crafted from premium full-grain leather, this versatile crossbody bag combines
            timeless style with modern functionality. Perfect for everyday use, it features:

            • Premium full-grain leather construction
            • Adjustable shoulder strap
            • Multiple interior compartments
            • Secure zip closure
            • Phone pocket and card slots
            • Signature hardware details
        `,
        features: [
            "Water-resistant leather",
            "Reinforced stitching",
            "Metal hardware",
            "Interior organization",
            "Adjustable strap"
        ],
        specifications: {
            "Material": "Full-grain leather",
            "Dimensions": "10\" x 8\" x 4\"",
            "Weight": "1.2 lbs",
            "Strap Length": "Adjustable up to 22\"",
            "Closure": "YKK zipper"
        },
        images: [
            "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/1.png",
            "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/2.png",
            "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/3.png"
        ],
        colors: [
            { id: 'brown', name: 'Brown', hex: '#8B4513' },
            { id: 'black', name: 'Black', hex: '#000000' },
            { id: 'tan', name: 'Tan', hex: '#D2B48C' }
        ],
        sizes: ['Small', 'Medium', 'Large']
    };

    let selectedColor = $state(product.colors[0]);
    let selectedSize = $state(product.sizes[0]);
    let quantity = $state(1);

    // Cart and wishlist state
    let isInCart = $state(false);
    let isInWishlist = $state(false);

    // Reviews data
    let reviews = $state([
        {
            "rating": 4,
            "text": "Highly impressed!",
            "date": "2024-05-23T08:56:21.627Z",
            "reviewerName": "Hunter Gordon",
            "reviewerEmail": "hunter.gordon@x.dummyjson.com"
        },
        {
            "rating": 5,
            "text": "Awesome product!",
            "date": "2024-05-23T08:56:21.627Z",
            "reviewerName": "Ethan Fletcher",
            "reviewerEmail": "ethan.fletcher@x.dummyjson.com"
        },
        {
            "rating": 4,
            "text": "Highly recommended!",
            "date": "2024-05-23T08:56:21.627Z",
            "reviewerName": "Aaron Cook",
            "reviewerEmail": "aaron.cook@x.dummyjson.com"
        }
    ]);
    let ratingStats = $state({
        average: 4.5,
        total: 128,
        distribution: {
            5: 90,
            4: 60,
            3: 40,
            2: 30,
            1: 8
        }
    });

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

<div class="container mx-auto px-4 py-8">
    <!-- Product Overview Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- Product Gallery -->
        <ProductGallery images={product.images} />

        <!-- Product Info & Actions -->
        <div class="flex flex-col gap-6">
            <div class="flex items-start justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                    <div class="flex items-center gap-4">
                        <span class="text-sm text-gray-500">{product.category} / {product.subcategory}</span>
                        {#if product.isHot}
                            <span class="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                Hot Product
                            </span>
                        {/if}
                        {#if product.isHighlyRated}
                            <span class="px-2 py-1 bg-amber-100 text-amber-600 text-xs font-medium rounded-full">
                                Highly Rated
                            </span>
                        {/if}
                    </div>
                </div>
                <button
                        class="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        onclick={toggleWishlist}
                >
                    {#if isInWishlist}
                        <svg class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                        </svg>
                    {:else}
                        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    oncolorChange={(e) => selectedColor = e.detail}
                    onsizeChange={(e) => selectedSize = e.detail}
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
    <Tabs.Root value="description" class="mb-12">
        <Tabs.List>
            <Tabs.Trigger value="description">Description</Tabs.Trigger>
            <Tabs.Trigger value="features">Features</Tabs.Trigger>
            <Tabs.Trigger value="specifications">Specifications</Tabs.Trigger>
            <Tabs.Trigger value="reviews">
                Reviews ({product.reviewCount})
            </Tabs.Trigger>
        </Tabs.List>

        <ScrollArea.Root class="h-[400px] rounded-md border p-4">
            <Tabs.Content value="description">
                <div class="prose max-w-none">
                    {product.description}
                </div>
            </Tabs.Content>

            <Tabs.Content value="features">
                <ul class="list-disc pl-5 space-y-2">
                    {#each product.features as feature}
                        <li>{feature}</li>
                    {/each}
                </ul>
            </Tabs.Content>

            <Tabs.Content value="specifications">
                <dl class="divide-y divide-gray-200 dark:divide-gray-700">
                    {#each Object.entries(product.specifications) as [key, value]}
                        <div class="py-3 flex justify-between">
                            <dt class="font-medium text-gray-900 dark:text-gray-100">{key}</dt>
                            <dd class="text-gray-700 dark:text-gray-300">{value}</dd>
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

    <!-- Related Products -->
    <RelatedProducts category={product.category} currentProductId={product.id} />
</div>