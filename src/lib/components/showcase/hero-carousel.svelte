<script>
    import { onMount } from 'svelte';
    import { PromotionalImage } from '$lib/components/showcase/index.js'
    import * as Button from '$lib/components/ui/button';

    let { promotions = [] } = $props();

    // Current promotion index for carousel
    let currentPromotion = $state(0);

    // Carousel controls
    function nextPromotion() {
        currentPromotion = (currentPromotion + 1) % promotions.length;
    }

    function prevPromotion() {
        currentPromotion = (currentPromotion - 1 + promotions.length) % promotions.length;
    }

    // Auto-advance carousel
    onMount(() => {
        const interval = setInterval(() => {
            nextPromotion();
        }, 5000);

        return () => clearInterval(interval);
    });
</script>

<section class="relative overflow-hidden">
    <div class="relative h-[400px] md:h-[500px]">
        {#each promotions as promo, i}
            <div
                    class="absolute inset-0 transition-opacity duration-500"
                    style="opacity: {i === currentPromotion ? '1' : '0'}; pointer-events: {i === currentPromotion ? 'auto' : 'none'};"
            >
                <PromotionalImage
                        image={promo.image}
                        title={promo.title}
                        description={promo.description}
                        buttonText={promo.buttonText}
                        variant={promo.variant}
                        theme={promo.theme}
                        discount={promo.discount}
                        endDate={promo.endDate}
                        height="100%"
                />
            </div>
        {/each}

        <!-- Carousel Controls -->
        <Button.Root variant="outline" size="icon" class="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full z-20" onclick={prevPromotion}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m15 18-6-6 6-6"/>
            </svg>
        </Button.Root>

        <Button.Root variant="outline" size="icon" class="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full z-20" onclick={nextPromotion}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6"/>
            </svg>
        </Button.Root>

        <!-- Carousel Indicators -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {#each promotions as _, i}
                <button
                        onclick={() => currentPromotion = i}
                        class="w-3 h-3 rounded-full {i === currentPromotion ? 'bg-neutral-800 dark:bg-white' : 'bg-neutral-400 dark:bg-neutral-600'}"
                ></button>
            {/each}
        </div>
    </div>
</section>