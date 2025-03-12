<script>
    import * as Card from '$lib/components/ui/card';
</script>

<section class="py-10 bg-neutral-100 dark:bg-neutral-800">
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card.Root class="bg-white dark:bg-neutral-700">
                <Card.Content class="p-6 flex flex-col items-center text-center">
                    <div class="w-16 h-16 mb-4 flex items-center justify-center bg-neutral-200 dark:bg-neutral-600 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14"/>
                            <path d="M12 5v14"/>
                        </svg>
                    </div>
                    <Card.Title class="text-xl font-bold mb-2">Free Shipping</Card.Title>
                    <Card.Description>On all orders over ₦50,000</Card.Description>
                </Card.Content>
            </Card.Root>

            <Card.Root class="bg-white dark:bg-neutral-700">
                <Card.Content class="p-6 flex flex-col items-center text-center">
                    <div class="w-16 h-16 mb-4 flex items-center justify-center bg-neutral-200 dark:bg-neutral-600 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                        </svg>
                    </div>
                    <Card.Title class="text-xl font-bold mb-2">Secure Payment</Card.Title>
                    <Card.Description>100% secure payment</Card.Description>
                </Card.Content>
            </Card.Root>

            <Card.Root class="bg-white dark:bg-neutral-700">
                <Card.Content class="p-6 flex flex-col items-center text-center">
                    <div class="w-16 h-16 mb-4 flex items-center justify-center bg-neutral-200 dark:bg-neutral-600 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                            <line x1="4" x2="4" y1="22" y2="15"/>
                        </svg>
                    </div>
                    <Card.Title class="text-xl font-bold mb-2">Easy Returns</Card.Title>
                    <Card.Description>30 days return policy</Card.Description>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</section>