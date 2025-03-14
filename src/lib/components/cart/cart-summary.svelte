<script>
    import * as Card from '$lib/components/ui/card';
    import {Button} from '$lib/components/ui/button';
    import {Input} from '$lib/components/ui/input';

    let { cartItems = [], onCheckout } = $props()

    let couponCode = $state('');
    let isApplyingCoupon = $state(false);

    const subtotal = $derived(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
    const shipping = $derived(subtotal > 100 ? 0 : 10);
    const tax = $derived(subtotal * 0.1); // 10% tax
    const total = $derived(subtotal + shipping + tax);

    async function handleApplyCoupon() {
        isApplyingCoupon = true;
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        isApplyingCoupon = false;
        // Handle coupon logic here
    }
</script>

<Card.Root class="shadow-sm">
    <Card.Header class="pb-3">
        <Card.Title>Order Summary</Card.Title>
    </Card.Header>

    <Card.Content class="space-y-4">
        <!-- Price Breakdown -->
        <div class="space-y-2">
            <div class="flex justify-between">
                <span>Subtotal</span>
                <span>₦{subtotal.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span>Shipping</span>
                <span>
                    {#if shipping === 0}
                        Free
                    {:else}
                        ₦{shipping.toFixed(2)}
                    {/if}
                </span>
            </div>
            <div class="flex justify-between">
                <span>Tax</span>
                <span>₦{tax.toFixed(2)}</span>
            </div>
            <div class="border-t pt-2 mt-2">
                <div class="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₦{total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <!-- Coupon Code -->
        <div class="space-y-2">
            <label class="text-sm font-medium">
                Have a coupon code?
            </label>
            <div class="flex gap-2">
                <Input
                        type="text"
                        bind:value={couponCode}
                        placeholder="Enter code"
                        class="flex-grow"
                />
                <Button
                        variant="outline"
                        disabled={isApplyingCoupon || !couponCode}
                        onclick={handleApplyCoupon}
                        class="whitespace-nowrap"
                >
                    Apply
                </Button>
            </div>
        </div>
    </Card.Content>

    <Card.Footer class="flex flex-col space-y-4">
        <Button
                class="w-full"
                onclick={onCheckout}
        >
            Proceed to Checkout
        </Button>

        {#if subtotal < 100}
            <p class="text-sm text-muted-foreground text-center">
                Add ₦{(100 - subtotal).toFixed(2)} more for free shipping
            </p>
        {/if}
    </Card.Footer>
</Card.Root>