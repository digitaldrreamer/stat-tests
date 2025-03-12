<script>
    import * as Toggle from '$lib/components/ui/toggle';
    import * as Skeleton from '$lib/components/ui/skeleton';


    let { categories = [], selectedCategory = $bindable('all'), onsetCategory } = $props();


    function setCategory(category) {
        onsetCategory(category.slug);
    }
</script>

<section class="py-10 bg-neutral-100 dark:bg-neutral-800">
    <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6 text-center">Shop by Category</h2>

        <div class="flex flex-wrap gap-2 justify-center">
            {#if categories.length === 0}
                <Skeleton.Skeleton class="h-10 w-24" />
                <Skeleton.Skeleton class="h-10 w-28" />
                <Skeleton.Skeleton class="h-10 w-20" />
                <Skeleton.Skeleton class="h-10 w-32" />
            {:else}
                {#each categories as category}
                    <Toggle.Root
                            pressed={selectedCategory === category.slug}
                            onPressedChange={() => setCategory(category.slug)}
                            class="capitalize"
                    >
                        {category.name}
                    </Toggle.Root>
                {/each}
            {/if}
        </div>
    </div>
</section>