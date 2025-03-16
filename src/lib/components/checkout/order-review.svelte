<script>
    import * as Card from '$lib/components/ui/card';
    import * as Button from '$lib/components/ui/button';
    import * as Separator from '$lib/components/ui/separator';
    import { Check, CreditCard, Truck, User } from 'lucide-svelte';

    let { customerData = {}, shippingData = {}, paymentData = {}, cartItems = [], onBack, onPlaceOrder } = $props()

    const countries = [
        { value: 'US', label: 'United States' },
        { value: 'CA', label: 'Canada' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'AU', label: 'Australia' },
        { value: 'DE', label: 'Germany' },
        { value: 'FR', label: 'France' }
    ];

    const subtotal = $derived(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
    const shipping = $derived(subtotal > 100 ? 0 : 10);
    const tax = $derived(subtotal * 0.1); // 10% tax
    const total = $derived(subtotal + shipping + tax);

    function getPaymentMethodDisplay() {
        if (paymentData.method === 'credit-card') {
            return `Credit Card (${paymentData.cardNumber.slice(-4)})`;
        } else if (paymentData.method === 'opay') {
            return 'OPay';
        } else if (paymentData.method === 'bank-transfer') {
            return 'Bank Transfer';
        } else if (paymentData.method === "haha-wallet") {
            return 'Haha Wallet';
        }
        return 'Not specified';
    }
</script>

<Card.Root class="border-none sm:border shadow-none sm:shadow">
    <Card.Header class="px-0 sm:px-6">
        <Card.Title class="text-xl mx-4">Review Your Order</Card.Title>
        <Card.Description class="mx-4">
            Please review your order details before placing your order
        </Card.Description>
    </Card.Header>

    <Card.Content class="px-0 sm:px-6">
        <div class="space-y-6 mx-4">
            <!-- Customer Information -->
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <User class="h-5 w-5 text-primary" />
                    <h3 class="font-medium">Customer Information</h3>
                </div>
                <div class="bg-muted/50 p-3 sm:p-4 rounded-lg">
                    <p class="text-sm">
                        <span class="text-muted-foreground">Email:</span> {customerData.email || 'Not provided'}
                    </p>
                    <p class="text-sm">
                        <span class="text-muted-foreground">Phone:</span> {customerData.phone || 'Not provided'}
                    </p>
                </div>
            </div>

            <!-- Shipping Information -->
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <Truck class="h-5 w-5 text-primary" />
                    <h3 class="font-medium">Shipping Information</h3>
                </div>
                <div class="bg-muted/50 p-3 sm:p-4 rounded-lg">
                    <p class="text-sm font-medium">{shippingData.fullName || 'Not provided'}</p>
                    <p class="text-sm">{shippingData.address || 'Not provided'}</p>
                    <p class="text-sm">
                        {shippingData.city || ''}{shippingData.city && shippingData.state ? ', ' : ''}
                        {shippingData.state || ''} {shippingData.zipCode || ''}
                    </p>
                    <p class="text-sm">
                        {countries.find(c => c.value === shippingData.country)?.label || shippingData.country || 'Not provided'}
                    </p>
                </div>
            </div>

            <!-- Payment Method -->
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <CreditCard class="h-5 w-5 text-primary" />
                    <h3 class="font-medium">Payment Method</h3>
                </div>
                <div class="bg-muted/50 p-3 sm:p-4 rounded-lg">
                    <p class="text-sm">{getPaymentMethodDisplay()}</p>
                </div>
            </div>

            <!-- Order Items -->
            <div class="space-y-2">
                <h3 class="font-medium">Order Items</h3>
                <div class="space-y-4">
                    {#each cartItems as item}
                        <div class="flex gap-3 sm:gap-4">
                            <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md"
                            />
                            <div class="flex-grow min-w-0">
                                <h4 class="font-medium text-sm sm:text-base truncate">{item.title}</h4>
                                <p class="text-xs sm:text-sm text-muted-foreground">
                                    Qty: {item.quantity}
                                </p>
                            </div>
                            <div class="text-right">
                                <p class="font-medium text-sm sm:text-base">${item.price}</p>
                                <p class="text-xs sm:text-sm text-muted-foreground">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Order Summary -->
            <div class="space-y-2">
                <h3 class="font-medium">Order Summary</h3>
                <div class="bg-muted/50 p-3 sm:p-4 rounded-lg">
                    <div class="space-y-1">
                        <div class="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>Shipping:</span>
                            <span>
                                {#if shipping === 0}
                                    Free
                                {:else}
                                    ${shipping.toFixed(2)}
                                {/if}
                            </span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>Tax:</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <Separator.Root class="my-2" />
                        <div class="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="bg-primary/5 p-3 sm:p-4 rounded-lg">
                <p class="text-xs sm:text-sm">
                    By placing your order, you agree to our <a href="/terms" class="text-primary underline">Terms of Service</a> and <a href="/privacy" class="text-primary underline">Privacy Policy</a>. You also acknowledge that your order may be subject to shipping delays.
                </p>
            </div>
        </div>
    </Card.Content>

    <Card.Footer class="mx-4 px-0 sm:px-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button.Root variant="outline" onclick={onBack} class="order-2 sm:order-1 w-full sm:w-auto">
            Back
        </Button.Root>

        <Button.Root onclick={onPlaceOrder} class="order-1 sm:order-2 w-full sm:w-auto">
            Place Order
        </Button.Root>
    </Card.Footer>
</Card.Root>