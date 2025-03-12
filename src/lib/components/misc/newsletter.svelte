<script>
    import * as Button from '$lib/components/ui/button';
    import * as Input from '$lib/components/ui/input';
</script>

<section class="py-10">
    <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p class="text-neutral-600 dark:text-neutral-400 mb-6">Get the latest updates on new products and upcoming sales</p>

            <form class="flex flex-col sm:flex-row gap-2">
                <Input.Root class="flex-1">
                    <Input.Input
                            type="email"
                            placeholder="Your email address"
                            required
                    />
                </Input.Root>
                <Button.Root type="submit">
                    Subscribe
                </Button.Root>
            </form>
        </div>
    </div>
</section>