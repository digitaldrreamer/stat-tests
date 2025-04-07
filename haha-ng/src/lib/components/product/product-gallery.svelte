<script>
    import * as AspectRatio from '$lib/components/ui/aspect-ratio';

    let { images = [] } = $props()

    let selectedImage = $state(images[0]);

    function selectImage(image) {
        selectedImage = image;
    }
</script>

<div class="product-gallery">
    <!-- Main Image -->
    <div class="mb-3 md:mb-4">
        <AspectRatio.Root ratio={1}>
            <img
                    src={selectedImage || "/placeholder.svg?height=600&width=600"}
                    alt="Product view"
                    class="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-700"
            />
        </AspectRatio.Root>
    </div>

    <!-- Thumbnails -->
    <div class="grid grid-cols-4 gap-1 sm:gap-2">
        {#each images as image, index}
            <button
                    class="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                    onclick={() => selectImage(image)}
                    aria-label={`View product image ${index + 1}`}
            >
                <AspectRatio.Root ratio={1}>
                    <img
                            src={image || "/placeholder.svg?height=150&width=150"}
                            alt={`Product thumbnail ${index + 1}`}
                            class="w-full h-full object-cover rounded-md border-2 transition-colors"
                            class:border-primary={selectedImage === image}
                            class:border-transparent={selectedImage !== image}
                            class:opacity-75={selectedImage !== image}
                            class:opacity-100={selectedImage === image}
                    />
                </AspectRatio.Root>
            </button>
        {/each}
    </div>
</div>