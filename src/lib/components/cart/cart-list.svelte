<script>
    import * as Card from '$lib/components/ui/card';
    import {Button} from '$lib/components/ui/button';
    import { Trash2 } from 'lucide-svelte';

    let { cartItems = [], onQuantityChange, onRemoveItem } = $props()

    function updateQuantity(itemId, delta) {
        const item = cartItems.find(i => i.id === itemId);
        if (item) {
            const newQuantity = Math.max(1, item.quantity + delta);
            onQuantityChange(itemId, newQuantity);
        }
    }
</script>

<div class="space-y-3 md:space-y-4">
    {#each cartItems as item (item.id)}
        <Card.Root class="overflow-hidden">
            <div class="p-3 md:p-4 flex flex-col sm:flex-row gap-3 md:gap-4">
                <!-- Product Image -->
                <div class="w-full sm:w-24 h-36 sm:h-24 flex-shrink-0">
                    <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            class="w-full h-full object-cover rounded-md"
                    />
                </div>

                <!-- Product Details -->
                <div class="flex-grow">
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                            <h3 class="font-medium text-lg truncate">{item.title}</h3>
                            <p class="text-sm text-muted-foreground">
                                {item.category} / {item.subcategory}
                            </p>
                            <div class="mt-1 flex flex-wrap gap-2">
                                <span class="text-sm text-muted-foreground">
                                    Color: {item.color}
                                </span>
                                <span class="text-sm text-muted-foreground">
                                    Size: {item.size}
                                </span>
                            </div>
                        </div>
                        <div class="flex justify-between items-start mt-2 sm:mt-0 sm:text-right">
                            <p class="font-medium sm:mb-2">₦{item.price}</p>
                            <Button
                                    variant="ghost"
                                    size="icon"
                                    class="text-destructive hover:text-destructive/90 -mt-1"
                                    onclick={() => onRemoveItem(item.id)}
                            >
                                <Trash2 class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <!-- Quantity Controls -->
                    <div class="mt-3 md:mt-4 flex items-center gap-2">
                        <Button
                                variant="outline"
                                size="icon"
                                class="h-8 w-8"
                                onclick={() => updateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                        >
                            -
                        </Button>

                        <span class="w-12 text-center">{item.quantity}</span>

                        <Button
                                variant="outline"
                                size="icon"
                                class="h-8 w-8"
                                onclick={() => updateQuantity(item.id, 1)}
                        >
                            +
                        </Button>
                    </div>
                </div>
            </div>
        </Card.Root>
    {/each}
</div>