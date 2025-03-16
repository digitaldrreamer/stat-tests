<script>
    import { fade } from 'svelte/transition';
    import * as Card from '$lib/components/ui/card';
    import * as Separator from '$lib/components/ui/separator';
    import * as Collapsible from '$lib/components/ui/collapsible';
    import { ChevronDown, ChevronUp, ShoppingBag } from 'lucide-svelte';

    let { cartItems = [], subtotal = 0, shipping = 0, tax = 0, total = 0 } = $props()

    let isItemsExpanded = $state(false);
</script>

<Card.Root class="h-full">
    <Card.Header class="px-4 sm:px-6">
        <Card.Title class="text-lg sm:text-xl">Order Summary</Card.Title>
    </Card.Header>

    <Card.Content class="px-4 sm:px-6 space-y-4">
        <!-- Items Summary -->
        <Collapsible.Root open={isItemsExpanded}>
            <Collapsible.Trigger class="flex items-center justify-between w-full py-2">
                <div class="flex items-center gap-2">
                    <ShoppingBag class="h-4 w-4" />
                    <span class="font-medium">
                        {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>
                <button class="text-muted-foreground hover:text-foreground transition-colors">
                    {#if isItemsExpanded}
                        <ChevronUp class="h-4 w-4" />
                    {:else}
                        <ChevronDown class="h-4 w-4" />
                    {/if}
                </button>
            </Collapsible.Trigger>

            <Collapsible.Content>
                <div class="mt-3 space-y-3">
                    {#each cartItems as item}
                        <div class="flex gap-3">
                            <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    class="w-12 h-12 object-cover rounded-md flex-shrink-0"
                            />
                            <div class="flex-grow min-w-0">
                                <p class="text-sm font-medium truncate">{item.title}</p>
                                <p class="text-xs text-muted-foreground">
                                    Qty: {item.quantity}
                                </p>
                            </div>
                            <div class="text-right flex-shrink-0">
                                <p class="text-sm font-medium">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
                <Separator.Root class="my-4" />
            </Collapsible.Content>
        </Collapsible.Root>

        <!-- Price Breakdown -->
        <div class="space-y-2">
            <div class="flex justify-between">
                <span class="text-sm">Subtotal</span>
                <span class="text-sm">${subtotal.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-sm">Shipping</span>
                <span class="text-sm">
                    {#if shipping === 0}
                        Free
                    {:else}
                        ${shipping.toFixed(2)}
                    {/if}
                </span>
            </div>
            <div class="flex justify-between">
                <span class="text-sm">Tax</span>
                <span class="text-sm">${tax.toFixed(2)}</span>
            </div>
            <Separator.Root class="my-2" />
            <div class="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>
    </Card.Content>

    <Card.Footer class="px-4 sm:px-6 pt-2">
        {#if subtotal < 100}
            <p class="text-xs sm:text-sm text-muted-foreground text-center">
                Add ${(100 - subtotal).toFixed(2)} more for free shipping
            </p>
        {/if}
    </Card.Footer>
</Card.Root>