<script>
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import * as Card from '$lib/components/ui/card';
    import * as Button from '$lib/components/ui/button';
    import { Package, Check, Truck, ShoppingBag, MapPin } from 'lucide-svelte';

    let orderId = $state('');
    let trackingInfo = $state(null);
    let isLoading = $state(true);

    onMount(() => {
        // Get order ID from URL
        orderId = page.url.searchParams.get('id') || 'ORD123456';

        // Simulate fetching tracking info
        setTimeout(() => {
            trackingInfo = {
                orderId: orderId,
                trackingNumber: 'TRK987654321',
                carrier: 'Haha Logistics',
                estimatedDelivery: '2023-12-15',
                currentStatus: 'In Transit',
                currentLocation: 'Distribution Center, Ede Osun State',
                events: [
                    {
                        date: '2023-12-10T14:30:00',
                        status: 'In Transit',
                        location: 'Distribution Center, Ede, Osun State',
                        description: 'Package is in transit to the next facility'
                    },
                    {
                        date: '2023-12-09T08:15:00',
                        status: 'Shipped',
                        location: 'Warehouse, Ibadan',
                        description: 'Package has left the warehouse'
                    },
                    {
                        date: '2023-12-08T16:45:00',
                        status: 'Processing',
                        location: 'Warehouse, Ibadan',
                        description: 'Package is being prepared for shipment'
                    },
                    {
                        date: '2023-12-07T10:20:00',
                        status: 'Order Confirmed',
                        location: 'Online',
                        description: 'Your order has been confirmed'
                    }
                ]
            };
            isLoading = false;
        }, 1000);
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }

    function getStatusIcon(status) {
        switch (status.toLowerCase()) {
            case 'order confirmed':
                return ShoppingBag;
            case 'processing':
                return Package;
            case 'shipped':
                return Truck;
            case 'in transit':
                return Truck;
            case 'delivered':
                return Check;
            default:
                return MapPin;
        }
    }
</script>

<svelte:head>
    <title>Order Tracking | Fashion Store</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Track Your Order</h1>

    {#if isLoading}
        <div class="flex items-center justify-center min-h-[400px]">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    {:else}
        <div class="max-w-3xl mx-auto">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Tracking Information</Card.Title>
                    <Card.Description>
                        Order #{trackingInfo.orderId} • Tracking #{trackingInfo.trackingNumber}
                    </Card.Description>
                </Card.Header>

                <Card.Content>
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 class="font-medium mb-2">Shipping Details</h3>
                                <p class="text-sm">
                                    <span class="text-muted-foreground">Carrier:</span> {trackingInfo.carrier}
                                </p>
                                <p class="text-sm">
                                    <span class="text-muted-foreground">Estimated Delivery:</span> {new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}
                                </p>
                                <p class="text-sm">
                                    <span class="text-muted-foreground">Current Status:</span> {trackingInfo.currentStatus}
                                </p>
                                <p class="text-sm">
                                    <span class="text-muted-foreground">Current Location:</span> {trackingInfo.currentLocation}
                                </p>
                            </div>

                            <div class="flex items-center justify-center">
                                <div class="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Truck class="h-16 w-16 text-primary" />
                                </div>
                            </div>
                        </div>

                        <div class="relative pt-6">
                            <div class="absolute left-4 top-6 bottom-0 w-0.5 bg-muted"></div>

                            <div class="space-y-8">
                                {#each trackingInfo.events as event, index}
                                    <div class="relative pl-10">
                                        <div class="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <svelte:component this={getStatusIcon(event.status)} class="h-4 w-4 text-primary" />
                                        </div>

                                        <div>
                                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                                <h4 class="font-medium">{event.status}</h4>
                                                <span class="text-sm text-muted-foreground">
                                                    {formatDate(event.date)}
                                                </span>
                                            </div>
                                            <p class="text-sm">{event.location}</p>
                                            <p class="text-sm text-muted-foreground mt-1">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </Card.Content>

                <Card.Footer class="flex justify-between">
                    <Button.Root variant="outline" href={`/order-details?id=${trackingInfo.orderId}`}>
                        Back to Order
                    </Button.Root>
                </Card.Footer>
            </Card.Root>
        </div>
    {/if}
</div>