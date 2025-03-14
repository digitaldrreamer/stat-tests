<script>
    import {Button} from '$lib/components/ui/button';
    import { ShoppingBag } from 'lucide-svelte';
</script>

<div class="flex flex-col items-center justify-center min-h-[400px] text-center">
    <ShoppingBag class="h-16 w-16 text-muted-foreground mb-4" />
    <h2 class="text-2xl font-semibold mb-2">Your cart is empty</h2>
    <p class="text-muted-foreground mb-6">
        Looks like you haven't added anything to your cart yet.
    </p>
    <Button href="/">
        Continue Shopping
    </Button>
</div>