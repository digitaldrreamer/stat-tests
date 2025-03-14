<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import * as Card from '$lib/components/ui/card';
    import * as Button from '$lib/components/ui/button';
    import { Check, Download, Printer, ArrowRight } from 'lucide-svelte';

    let orderId = $state('');
    let orderDetails = $state(null);
    let isLoading = $state(true);

    onMount(() => {
        // Get order ID from URL
        orderId = $page.url.searchParams.get('id') || 'ORD123456';

        // Simulate fetching order details
        setTimeout(() => {
            orderDetails = {
                id: orderId,
                date: new Date().toLocaleDateString(),
                status: 'Confirmed',
                items: [
                    {
                        id: 1,
                        title: "Premium Leather Crossbody Bag",
                        price: 199.99,
                        quantity: 1,
                        image: "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/thumbnail.png"
                    },
                    {
                        id: 2,
                        title: "Silk Scarf",
                        price: 49.99,
                        quantity: 2,
                        image: "https://cdn.dummyjson.com/products/images/womens-bags/Women%20Handbag%20Black/thumbnail.png"
                    }
                ],
                customer: {
                    name: "Ibrahim Oyewole",
                    email: "ibrahim.wole@gmail.com",
                    phone: "+234 812 345 6789"
                },
                shipping: {
                    address: "123 Ifadele Str",
                    city: "Ede",
                    state: "OS",
                    zipCode: "200141",
                    country: "NG",
                    method: "Standard Shipping",
                    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
                },
                payment: {
                    method: "Haha Wallet",
                    last4: "5793"
                },
                subtotal: 299.97,
                shippingCost: 0,
                tax: 29.99,
                total: 329.96
            };
            isLoading = false;
        }, 1000);
    });

    function handlePrintInvoice() {
        window.print();
    }

    function handleDownloadInvoice() {
        // In a real app, this would generate and download a PDF
        alert('Invoice download functionality would be implemented here');
    }

    function handleTrackOrder() {
        window.location.href = `/order/tracking?id=${orderId}`;
    }

    $inspect('orderDetails', orderDetails)
</script>

<svelte:head>
    <title>Order Confirmation | Fashion Store</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
    {#if isLoading}
        <div class="flex items-center justify-center min-h-[400px]">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    {:else}
        <div class="max-w-3xl mx-auto">
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <Check class="h-8 w-8" />
                </div>
                <h1 class="text-3xl font-bold">Order Confirmed!</h1>
                <p class="text-muted-foreground mt-2">
                    Thank you for your purchase. Your order has been confirmed.
                </p>
            </div>

            <Card.Root>
                <Card.Header>
                    <div class="flex justify-between items-center">
                        <Card.Title>Order #{orderDetails.id}</Card.Title>
                        <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                            {orderDetails.status}
                        </span>
                    </div>
                    <Card.Description>
                        Placed on {orderDetails.date}
                    </Card.Description>
                </Card.Header>

                <Card.Content>
                    <div class="space-y-6">
                        <!-- Order Items -->
                        <div>
                            <h3 class="font-medium mb-4">Items</h3>
                            <div class="space-y-4">
                                {#each orderDetails.items as item}
                                    <div class="flex gap-4">
                                        <img
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.title}
                                                class="w-16 h-16 object-cover rounded-md"
                                        />
                                        <div class="flex-grow">
                                            <h4 class="font-medium">{item.title}</h4>
                                            <p class="text-sm text-muted-foreground">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <div class="text-right">
                                            <p class="font-medium">₦{item.price}</p>
                                            <p class="text-sm text-muted-foreground">
                                                ₦{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <!-- Shipping Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 class="font-medium mb-2">Shipping Information</h3>
                                <p class="text-sm">{orderDetails.shipping.address}</p>
                                <p class="text-sm">{orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.zipCode}</p>
                                <p class="text-sm">{orderDetails.shipping.country}</p>
                                <p class="text-sm mt-2">
                                    <span class="text-muted-foreground">Method:</span> {orderDetails.shipping.method}
                                </p>
                                <p class="text-sm">
                                    <span class="text-muted-foreground">Estimated Delivery:</span> {orderDetails.shipping.estimatedDelivery}
                                </p>
                            </div>

                            <div>
                                <h3 class="font-medium mb-2">Payment Information</h3>
                                <p class="text-sm">
                                    <span class="text-muted-foreground">Method:</span> {orderDetails.payment.method}
                                </p>
                                {#if orderDetails.payment.last4}
                                    <p class="text-sm">
                                        <span class="text-muted-foreground">Card:</span> •••• {orderDetails.payment.last4}
                                    </p>
                                {/if}

                                <div class="mt-4 space-y-1">
                                    <div class="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span>₦{orderDetails.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span>Shipping:</span>
                                        <span>
                                            {#if orderDetails.shippingCost === 0}
                                                Free
                                            {:else}
                                                ₦{orderDetails.shippingCost.toFixed(2)}
                                            {/if}
                                        </span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span>Tax:</span>
                                        <span>₦{orderDetails.tax.toFixed(2)}</span>
                                    </div>
                                    <div class="flex justify-between font-medium pt-2 border-t">
                                        <span>Total:</span>
                                        <span>₦{orderDetails.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card.Content>

                <Card.Footer class="flex flex-wrap gap-3 justify-between">
                    <div class="flex flex-wrap gap-3">
                        <Button.Root variant="outline" onclick={handlePrintInvoice}>
                            <Printer class="h-4 w-4 mr-2" />
                            Print Invoice
                        </Button.Root>
                        <Button.Root variant="outline" onclick={handleDownloadInvoice}>
                            <Download class="h-4 w-4 mr-2" />
                            Download Invoice
                        </Button.Root>
                    </div>

                    <Button.Root onclick={handleTrackOrder}>
                        Track Order
                        <ArrowRight class="h-4 w-4 ml-2" />
                    </Button.Root>
                </Card.Footer>
            </Card.Root>

            <div class="text-center mt-8">
                <Button.Root variant="link" href="/products">
                    Continue Shopping
                </Button.Root>
            </div>
        </div>
    {/if}
</div>