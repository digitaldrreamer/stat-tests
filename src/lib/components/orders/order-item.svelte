<script>
    import { slide } from 'svelte/transition';
    import * as Card from '$lib/components/ui/card';
    import * as Button from '$lib/components/ui/button';
    import * as Collapsible from '$lib/components/ui/collapsible';
    import { ChevronDown, ChevronUp, Package, RefreshCw, Download, ExternalLink } from 'lucide-svelte';


    let { order } = $props()

    let isExpanded = $state(false);

    function getStatusColor(status) {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function handleViewDetails() {
        window.location.href = `/order-details?id=${order.id}`;
    }

    function handleTrackOrder() {
        if (order.tracking?.url) {
            window.open(order.tracking.url, '_blank');
        } else {
            window.location.href = `/order-tracking?id=${order.id}`;
        }
    }

    function handleReturnRequest() {
        window.location.href = `/return-request?id=${order.id}`;
    }
</script>

<Card.Root>
    <Card.Header class="flex flex-col sm:flex-row justify-between gap-4">
        <div>
            <Card.Title>{order.id}</Card.Title>
            <Card.Description>
                Placed on {formatDate(order.date)}
            </Card.Description>
        </div>

        <div class="flex flex-col sm:items-end gap-2">
            <span class={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(order.status)}`}>
                {order.status}
            </span>
            <span class="text-sm font-medium">${order.total.toFixed(2)}</span>
        </div>
    </Card.Header>

    <Collapsible.Root open={isExpanded}>
        <Card.Content class="pb-0">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <img
                            src={order.items[0].image || "/placeholder.svg"}
                            alt={order.items[0].title}
                            class="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                        <p class="font-medium">{order.items[0].title}</p>
                        <p class="text-sm text-muted-foreground">
                            {order.items.length > 1 ? `+${order.items.length - 1} more item${order.items.length > 2 ? 's' : ''}` : ''}
                        </p>
                    </div>
                </div>

                <Button.Root
                        variant="ghost"
                        size="sm"
                        onclick={() => isExpanded = !isExpanded}
                        class="flex items-center gap-1"
                >
                    {#if isExpanded}
                        <span class="text-sm">Hide Details</span>
                        <ChevronUp class="h-4 w-4" />
                    {:else}
                        <span class="text-sm">View Details</span>
                        <ChevronDown class="h-4 w-4" />
                    {/if}
                </Button.Root>
            </div>
        </Card.Content>

        <Collapsible.Content>
            <Card.Content class="pt-4">
                {#if isExpanded}
                    <div transition:slide={{ duration: 300 }} class="space-y-4">
                        <div class="space-y-3">
                            {#each order.items as item}
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
                                        <p class="font-medium">${item.price}</p>
                                        <p class="text-sm text-muted-foreground">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            {/each}
                        </div>

                        {#if order.tracking}
                            <div class="bg-muted/50 p-4 rounded-lg">
                                <h4 class="font-medium flex items-center gap-2 mb-2">
                                    <Package class="h-4 w-4" />
                                    Tracking Information
                                </h4>
                                <p class="text-sm">
                                    <span class="text-muted-foreground">Carrier:</span> {order.tracking.carrier}
                                </p>
                                <p class="text-sm">
                                    <span class="text-muted-foreground">Tracking Number:</span> {order.tracking.number}
                                </p>
                            </div>
                        {/if}
                    </div>
                {/if}
            </Card.Content>
        </Collapsible.Content>
    </Collapsible.Root>

    <Card.Footer class="flex flex-wrap gap-3">
        <Button.Root variant="outline" size="sm" onclick={handleViewDetails}>
            View Details
        </Button.Root>

        {#if order.status === 'Shipped' || order.status === 'Delivered'}
            <Button.Root variant="outline" size="sm" onclick={handleTrackOrder}>
                <Package class="h-4 w-4 mr-2" />
                Track Order
            </Button.Root>
        {/if}

        {#if order.status === 'Delivered'}
            <Button.Root variant="outline" size="sm" onclick={handleReturnRequest}>
                <RefreshCw class="h-4 w-4 mr-2" />
                Return Items
            </Button.Root>
        {/if}

        <Button.Root variant="outline" size="sm" href={`/invoice?id=${order.id}`}>
            <Download class="h-4 w-4 mr-2" />
            Invoice
        </Button.Root>
    </Card.Footer>
</Card.Root>