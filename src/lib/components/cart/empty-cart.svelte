<script>
    import {Button} from '$lib/components/ui/button';
    import { ShoppingBag } from 'lucide-svelte';
</script>

<div class="flex flex-col items-center justify-center min-h-[250px] md:min-h-[400px] text-center p-4">
    <ShoppingBag class="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-3 md:mb-4" />
    <h2 class="text-xl md:text-2xl font-semibold mb-2">Your cart is empty</h2>
    <p class="text-muted-foreground mb-4 md:mb-6 max-w-md">
        Looks like you haven't added anything to your cart yet.
    </p>
    <Button href="/" class="px-6">
        Continue Shopping
    </Button>
</div>