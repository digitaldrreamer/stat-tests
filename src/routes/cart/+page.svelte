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
                    image: "/placeholder.svg?height=200&width=200",
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
    <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

    {#if isLoading}
        <div class="flex items-center justify-center min-h-[400px]">
            <!-- Add loading spinner -->
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    {:else if cartItems.length === 0}
        <EmptyCart />
    {:else}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
                <CartList
                        {cartItems}
                        onQuantityChange={handleQuantityChange}
                        onRemoveItem={handleRemoveItem}
                />
            </div>

            <div class="lg:col-span-1">
                <CartSummary
                        {cartItems}
                        onCheckout={handleCheckout}
                />
            </div>
        </div>
    {/if}
</div>