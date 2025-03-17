<script>
    import * as Card from '$lib/components/ui/card';
    import * as Button from '$lib/components/ui/button';
    import * as Separator from '$lib/components/ui/separator';
    import { CreditCard, MapPin, Mail, Phone, User, Wallet, Smartphone, DollarSign, Store } from 'lucide-svelte';

    let {
        customerData = {},
        shippingData = {},
        paymentData = {},
        cartItems = [],
        onSubmit,
        onBack
    } = $props();

    // Calculate order summary
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping for pickup
    const tax = subtotal * 0.08;
    const discount = 20; // Sample discount
    const total = subtotal + shipping + tax - discount;

    function getPaymentMethodIcon(method) {
        switch (method) {
            case 'credit-card': return CreditCard;
            case 'opay': return Smartphone;
            case 'haha-wallet': return Wallet;
            case 'bank-transfer': return DollarSign;
            default: return CreditCard;
        }
    }

    function getPaymentMethodName(method) {
        switch (method) {
            case 'credit-card': return 'Credit Card';
            case 'opay': return 'OPay';
            case 'haha-wallet': return 'Haha Wallet';
            case 'bank-transfer': return 'Bank Transfer';
            default: return 'Credit Card';
        }
    }

    function getPaymentDetails() {
        if (paymentData.savedCardId) {
            return 'Saved card ending in ' + paymentData.cardNumber.slice(-4);
        }

        if (paymentData.method === 'credit-card') {
            return paymentData.cardNumber ? `Card ending in ${paymentData.cardNumber.slice(-4)}` : '';
        } else if (paymentData.method === 'haha-wallet') {
            return 'Haha Wallet Balance';
        } else if (paymentData.method === 'opay') {
            return 'OPay Mobile Payment';
        } else {
            return 'Bank Transfer';
        }
    }

    function handleSubmit() {
        onSubmit();
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
            <div>
                <h3 class="font-medium mb-3">Customer Information</h3>
                <div class="bg-muted p-4 rounded-lg">
                    <div class="flex items-start gap-3">
                        <User class="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                            {#if customerData.savedProfileId}
                                <p class="text-sm font-medium">Saved Profile</p>
                            {/if}
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div class="flex items-center gap-2">
                                    <Mail class="h-4 w-4 text-muted-foreground" />
                                    <span class="text-sm">{customerData.email}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Phone class="h-4 w-4 text-muted-foreground" />
                                    <span class="text-sm">{customerData.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Shipping Information -->
            <div>
                <h3 class="font-medium mb-3">Pickup Information</h3>
                <div class="bg-muted p-4 rounded-lg">
                    <div class="flex items-start gap-3">
                        <Store class="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p class="text-sm font-medium">Pickup Station</p>
                            <p class="text-sm">{shippingData.fullName}</p>
                            {#if shippingData.pickupStationId}
                                <div class="mt-2 p-3 bg-background rounded border">
                                    <div class="flex items-start gap-2">
                                        <MapPin class="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p class="text-sm font-medium">Downtown Fashion Store</p>
                                            <p class="text-sm text-muted-foreground">789 Fashion Ave</p>
                                            <p class="text-sm text-muted-foreground">New York, NY 10003</p>
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment Information -->
            <div>
                <h3 class="font-medium mb-3">Payment Information</h3>
                <div class="bg-muted p-4 rounded-lg">
                    <div class="flex items-start gap-3">
                        <svelte:component this={getPaymentMethodIcon(paymentData.method)} class="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p class="text-sm font-medium">{getPaymentMethodName(paymentData.method)}</p>
                            <p class="text-sm">{getPaymentDetails()}</p>
                            {#if paymentData.method === 'credit-card' && !paymentData.savedCardId}
                                <p class="text-sm">{paymentData.cardName}</p>
                                <p class="text-sm text-muted-foreground">Expires: {paymentData.expiryDate}</p>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Summary -->
            <div>
                <h3 class="font-medium mb-3">Order Summary</h3>
                <div class="bg-muted p-4 rounded-lg">
                    <div class="space-y-3">
                        {#each cartItems as item}
                            <div class="flex items-center py-2 border-b last:border-b-0">
                                <img
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        class="w-16 h-16 object-cover rounded"
                                />
                                <div class="ml-3 flex-grow">
                                    <h4 class="font-medium">{item.name}</h4>
                                    <p class="text-sm text-muted-foreground">
                                        {item.color}, Size: {item.size}
                                    </p>
                                    <div class="flex justify-between mt-1">
                                        <span class="text-sm">Qty: {item.quantity}</span>
                                        <span class="font-medium">₦{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        {/each}

                        <Separator.Root />

                        <div class="space-y-2 pt-2">
                            <div class="flex justify-between">
                                <span class="text-sm">Subtotal</span>
                                <span class="font-medium">₦{subtotal.toFixed(2)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm">Shipping</span>
                                <span class="font-medium">Free</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm">Tax</span>
                                <span class="font-medium">₦{tax.toFixed(2)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm">Discount</span>
                                <span class="font-medium text-green-600">-₦{discount.toFixed(2)}</span>
                            </div>
                            <Separator.Root />
                            <div class="flex justify-between pt-1">
                                <span class="font-medium">Total</span>
                                <span class="font-bold text-lg">₦{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Card.Content>

    <Card.Footer class="mx-4 px-0 sm:px-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button.Root variant="outline" onclick={onBack} class="order-2 sm:order-1 w-full sm:w-auto">
            Back
        </Button.Root>

        <Button.Root onclick={handleSubmit} class="order-1 sm:order-2 w-full sm:w-auto">
            Place Order
        </Button.Root>
    </Card.Footer>
</Card.Root>