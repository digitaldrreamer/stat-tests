<script>
    import { onMount } from 'svelte';
    import {CartList, EmptyCart, CartSummary} from '$lib/components/cart';
    import {Button} from '$lib/components/ui/button';

    // Cart state
    let cartItems = $state([]);
    let isLoading = $state(true);

    onMount(async () => {
        // Simulate loading cart items
        setTimeout(() => {
            cartItems = [
                {
                    id: 1,
                    title: "Premium Leather Crossbody Bag",
                    price: 199.99,
                    quantity: 1,
                    image: "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/thumbnail.png",
                    category: "Accessories",
                    subcategory: "Bags",
                    color: "Brown",
                    size: "Medium"
                },
                // Add more items as needed
            ];
            isLoading = false;
        }, 1000);
    });

    function handleQuantityChange(itemId, newQuantity) {
        cartItems = cartItems.map(item =>
            item.id === itemId
                ? { ...item, quantity: newQuantity }
                : item
        );
    }

    function handleRemoveItem(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
    }

    function handleCheckout() {
        // Navigate to checkout
        window.location.href = '/checkout';
    }
</script>

<svelte:head>
    <title>Shopping Cart | Haha.ng</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4 md:mb-8">Shopping Cart</h1>

    {#if isLoading}
        <div class="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
            <div class="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    {:else if cartItems.length === 0}
        <EmptyCart />
    {:else}
        <div class="grid grid-cols-1 gap-6 md:gap-8">
            <div class="order-2 md:order-1 md:col-span-2 lg:col-span-2">
                <CartList
                        {cartItems}
                        onQuantityChange={handleQuantityChange}
                        onRemoveItem={handleRemoveItem}
                />
            </div>

            <div class="order-1 md:order-2 md:col-span-1 lg:col-span-1 sticky top-4">
                <CartSummary
                        {cartItems}
                        onCheckout={handleCheckout}
                />
            </div>

        </div>
    {/if}
</div>

            <!-- Adjust to proper grid at medium breakpoint and above -->
            <style>
                @media (min-width: 768px) {
                    .grid {
                        grid-template-columns: 2fr 1fr;
                    }
                }
            </style>
