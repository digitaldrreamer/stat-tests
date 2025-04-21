<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Separator } from "$lib/components/ui/separator";
    import { Input } from "$lib/components/ui/input";
    import { Card, CardContent, CardHeader, CardFooter } from "$lib/components/ui/card";
    import { Search, Heart, Package2, ShoppingCart, Trash2 } from "lucide-svelte";
	import { fetchWithProxy } from "$lib/utils/fetch";
	import { onMount } from "svelte";
    import { loadingData } from '$lib/stores/loading'

    const getWishlist = async () => {
        return await fetchWithProxy('/wishlist').then(res => res.json())
    }
    
    let wishlistItems = $state([
        {
            id: "ITEM-1234",
            name: "Premium Leather Jacket",
            price: "$249.99",
            originalPrice: "$299.99",
            discount: "17% OFF",
            image: "/api/placeholder/180/180",
            inStock: true,
            addedOn: "March 10, 2025"
        },
        {
            id: "ITEM-5678",
            name: "Wireless Noise-Cancelling Headphones",
            price: "$179.99",
            originalPrice: "$219.99",
            discount: "18% OFF",
            image: "/api/placeholder/180/180",
            inStock: true,
            addedOn: "March 8, 2025"
        },
        {
            id: "ITEM-9012",
            name: "Ceramic Coffee Mug Set",
            price: "$32.50",
            originalPrice: "$45.00",
            discount: "28% OFF",
            image: "/api/placeholder/180/180",
            inStock: false,
            addedOn: "February 28, 2025"
        },
        {
            id: "ITEM-3456",
            name: "Fitness Smartwatch",
            price: "$149.99",
            originalPrice: "$199.99",
            discount: "25% OFF",
            image: "/api/placeholder/180/180",
            inStock: true,
            addedOn: "February 20, 2025"
        }
    ]);

    onMount(async () => {
        $loadingData = true
        getWishlist()
        .then(res => wishlistItems = res.data)
        .then(() => $loadingData = false)
    })

    // Sample wishlist data

    let searchQuery = $state("");
    let filteredItems = $derived(wishlistItems?.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ));


    const moveToCart = (itemId: string) => {
        // This would connect to your cart functionality
        console.log(`Moving item ${itemId} to cart`);
    };

    const removeFromWishlist = (itemId: string) => {
        // This would remove the item from the wishlist
        console.log(`Removing item ${itemId} from wishlist`);
    };
</script>

<div class="container mx-auto py-8 px-4 max-w-6xl">
    <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-bold tracking-tight">Your Wishlist</h1>
            <p class="text-muted-foreground">Save items you love for later</p>
        </div>

        <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div class="flex items-center gap-2">
                <Heart class="h-5 w-5" />
                <span class="font-medium">{wishlistItems.length} Items</span>
            </div>

            <div class="flex gap-2">
                <div class="relative flex-grow">
                    <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                            type="search"
                            placeholder="Search wishlist..."
                            class="pl-8 w-full"
                            bind:value={searchQuery}
                    />
                </div>

                <Button variant="outline" class="whitespace-nowrap">
                    Move All to Cart
                </Button>
            </div>
        </div>

        {#if filteredItems.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each filteredItems as item}
                    <Card class="overflow-hidden flex flex-col">
                        <CardHeader class="p-4 pb-0">
                            <div class="relative aspect-square w-full mb-4">
                                <img src={item.image} alt={item.name} class="object-cover rounded-md w-full h-full" />
                                <Button
                                        variant="ghost"
                                        size="icon"
                                        class="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background"
                                        onclick={() => removeFromWishlist(item.id)}
                                >
                                    <Trash2 class="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                            <div class="space-y-1">
                                <h3 class="font-semibold text-lg">{item.name}</h3>
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">{item.price}</span>
                                    {#if item.originalPrice}
                                        <span class="text-sm text-muted-foreground line-through">{item.originalPrice}</span>
                                    {/if}
                                    {#if item.discount}
                                        <Badge variant="secondary" class="text-xs">{item.discount}</Badge>
                                    {/if}
                                </div>
                                <p class="text-sm text-muted-foreground">Added on {item.addedOn}</p>
                            </div>
                        </CardHeader>
                        <CardContent class="p-4 pt-0 flex-grow">
                            <div class="flex items-center mt-2">
                                {#if item.inStock}
                                    <Badge variant="outline" class="bg-green-500/10 text-green-600 border-green-200">In Stock</Badge>
                                {:else}
                                    <Badge variant="outline" class="bg-red-500/10 text-red-600 border-red-200">Out of Stock</Badge>
                                {/if}
                            </div>
                        </CardContent>
                        <CardFooter class="p-4 pt-0">
                            <div class="flex gap-2 w-full">
                                <Button
                                        variant="default"
                                        class="flex-grow"
                                        disabled={!item.inStock}
                                        onclick={() => moveToCart(item.id)}
                                >
                                    <ShoppingCart class="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                {/each}
            </div>
        {:else}
            <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Heart class="h-16 w-16 text-muted-foreground mb-4" />
                <h3 class="text-lg font-medium mb-2">Your wishlist is empty</h3>
                <p class="text-muted-foreground mb-6 max-w-md">Save items you'd like to buy later by clicking the heart icon on product pages.</p>
                <Button>Explore Products</Button>
            </div>
        {/if}
    </div>
</div>